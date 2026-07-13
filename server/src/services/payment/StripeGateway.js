import Stripe from 'stripe';
import PaymentGateway from './PaymentGateway.js';

export default class StripeGateway extends PaymentGateway {
  constructor() {
    super('stripe');
    // Stripe will error if secret key is missing, so we use fallback/dummy for dev if not set
    const key = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
    this.stripe = new Stripe(key);
  }

  async createSession(order, customerDetails) {
    try {
      const lineItems = order.items.map((item) => {
        // Ensure image is a valid absolute HTTP URL for Stripe, otherwise fallback
        const itemImage = item.image && item.image.startsWith('http') 
          ? item.image 
          : 'https://placehold.co/400x480?text=Product';

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${item.name} (${item.size} / ${item.color})`,
              images: [itemImage],
            },
            unit_amount: Math.round(item.price * 100), // Stripe accepts cents
          },
          quantity: item.qty,
        };
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?gateway=stripe&session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`,
        customer_email: customerDetails.email,
        metadata: {
          orderId: order._id.toString(),
        },
      });

      return {
        url: session.url,
        paymentId: session.id,
      };
    } catch (error) {
      console.error('Stripe Session Creation Failed:', error);
      // In development, if Stripe key is invalid, generate a mock redirect URL
      if (process.env.STRIPE_SECRET_KEY === 'sk_test_mock_key' || !process.env.STRIPE_SECRET_KEY) {
        console.warn('Using Mock Stripe Redirect for Development');
        const mockSessionId = `mock-stripe-${Date.now()}`;
        return {
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?gateway=stripe&session_id=${mockSessionId}&order_id=${order._id}&mock=true`,
          paymentId: mockSessionId,
        };
      }
      throw error;
    }
  }

  async verifyPayment(payload) {
    const { session_id } = payload;
    if (!session_id) throw new Error('Stripe session_id is required for verification');

    // Handle mock payment for dev environment
    if (session_id.startsWith('mock-stripe-')) {
      return {
        success: true,
        paymentId: session_id,
        paymentStatus: 'paid',
        details: { mock: true, message: 'Mock development payment successful' },
      };
    }

    try {
      const session = await this.stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === 'paid') {
        return {
          success: true,
          paymentId: session.id,
          paymentStatus: 'paid',
          details: session,
        };
      }
      return {
        success: false,
        paymentId: session.id,
        paymentStatus: 'pending',
        details: session,
      };
    } catch (error) {
      console.error('Stripe payment verification failed:', error);
      throw error;
    }
  }

  async handleWebhook(headers, rawBody) {
    const sig = headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.warn('Stripe Webhook Secret not configured. Skipping signature check.');
      // If we don't have a secret, parse body directly (unsafe for production, ok for dev)
      const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        return {
          orderId: session.metadata.orderId,
          paymentId: session.id,
          paymentStatus: 'paid',
          raw: session,
        };
      }
      return null;
    }

    try {
      const event = this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        return {
          orderId: session.metadata.orderId,
          paymentId: session.id,
          paymentStatus: 'paid',
          raw: session,
        };
      }
      return null;
    } catch (err) {
      console.error(`Stripe Webhook Verification Failed: ${err.message}`);
      throw err;
    }
  }
}

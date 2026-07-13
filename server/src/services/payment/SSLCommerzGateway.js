import SSLCommerzPayment from 'sslcommerz-lts';
import PaymentGateway from './PaymentGateway.js';

export default class SSLCommerzGateway extends PaymentGateway {
  constructor() {
    super('sslcommerz');
    this.storeId = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || 'testbox@ssl';
    this.isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';
    
    // We will initialize SSLCommerz payment class
    this.sslcz = new SSLCommerzPayment(this.storeId, this.storePassword, this.isLive);
  }

  async createSession(order, customerDetails) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const transactionId = order._id.toString();

    const data = {
      total_amount: order.totalAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${backendUrl}/api/payments/callback/sslcommerz/success`,
      fail_url: `${backendUrl}/api/payments/callback/sslcommerz/fail`,
      cancel_url: `${backendUrl}/api/payments/callback/sslcommerz/cancel`,
      ipn_url: `${backendUrl}/api/payments/callback/sslcommerz/ipn`,
      shipping_method: 'Courier',
      product_name: order.items.map(item => item.name).join(', ').slice(0, 100),
      product_category: 'Clothing',
      product_profile: 'general',
      cus_name: customerDetails.name,
      cus_email: customerDetails.email,
      cus_add1: order.shippingAddress.address,
      cus_city: order.shippingAddress.city,
      cus_postcode: order.shippingAddress.postalCode || '1000',
      cus_country: order.shippingAddress.country || 'Bangladesh',
      cus_phone: customerDetails.phone || '01712345678',
      ship_name: customerDetails.name,
      ship_add1: order.shippingAddress.address,
      ship_city: order.shippingAddress.city,
      ship_postcode: order.shippingAddress.postalCode || '1000',
      ship_country: order.shippingAddress.country || 'Bangladesh',
    };

    try {
      const response = await this.sslcz.init(data);
      if (response && response.GatewayPageURL) {
        return {
          url: response.GatewayPageURL,
          paymentId: transactionId,
        };
      } else {
        throw new Error(response.failedreason || 'Failed to initialize SSLCommerz gateway session');
      }
    } catch (error) {
      console.error('SSLCommerz Initialisation Failed:', error);
      // In development, if SSLCommerz fails or credentials are placeholder, generate a mock redirect
      if (this.storeId === 'testbox' || !process.env.SSLCOMMERZ_STORE_ID) {
        console.warn('Using Mock SSLCommerz Redirect for Development');
        const mockTranId = `mock-ssl-${Date.now()}`;
        return {
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?gateway=sslcommerz&session_id=${mockTranId}&order_id=${order._id}&mock=true`,
          paymentId: mockTranId,
        };
      }
      throw error;
    }
  }

  async verifyPayment(payload) {
    const { val_id, tran_id } = payload;

    // Handle mock payment for dev environment
    if (tran_id && (tran_id.startsWith('mock-ssl-') || tran_id.startsWith('mock-'))) {
      return {
        success: true,
        paymentId: tran_id,
        paymentStatus: 'paid',
        details: { mock: true, message: 'Mock SSLCommerz verification successful' },
      };
    }

    if (!val_id) {
      throw new Error('val_id is required for SSLCommerz payment verification');
    }

    try {
      const response = await this.sslcz.validate({ val_id });
      if (response.status === 'VALID' || response.status === 'VALIDATED') {
        return {
          success: true,
          paymentId: response.tran_id,
          paymentStatus: 'paid',
          details: response,
        };
      }
      return {
        success: false,
        paymentId: response.tran_id,
        paymentStatus: 'failed',
        details: response,
      };
    } catch (error) {
      console.error('SSLCommerz validation failed:', error);
      throw error;
    }
  }

  async handleWebhook(headers, rawBody) {
    // SSLCommerz sends IPN as post request with form-encoded data.
    // Express parses it as req.body, which acts as rawBody/payload here.
    const payload = rawBody;
    const val_id = payload.val_id;

    if (!val_id) {
      return null;
    }

    try {
      const verification = await this.verifyPayment({ val_id, tran_id: payload.tran_id });
      if (verification.success) {
        return {
          orderId: payload.tran_id, // We used Order ID as transaction ID (tran_id)
          paymentId: payload.tran_id,
          paymentStatus: 'paid',
          raw: payload,
        };
      }
      return {
        orderId: payload.tran_id,
        paymentId: payload.tran_id,
        paymentStatus: 'failed',
        raw: payload,
      };
    } catch (error) {
      console.error('SSLCommerz IPN verification failed:', error);
      throw error;
    }
  }
}

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PaymentService from '../services/payment/PaymentService.js';

// @desc    Initialize checkout and create gateway payment session
// @route   POST /api/payments/checkout
// @access  Private
export const checkout = async (req, res) => {
  const { cartItems, shippingAddress, paymentMethod, customerDetails: bodyDetails } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  if (!paymentMethod || !['stripe', 'sslcommerz'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Invalid or missing payment method' });
  }

  try {
    // 1. Validate items and compute totals in backend to prevent client-side manipulation
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      // Find product in DB
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found in catalog` });
      }

      const price = dbProduct.price;
      calculatedTotal += price * item.qty;

      validatedItems.push({
        productId: dbProduct._id.toString(),
        name: dbProduct.name,
        image: dbProduct.image,
        size: item.size,
        color: item.color,
        price: price,
        qty: item.qty,
      });
    }

    // 2. Create the pending order in database
    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        email: bodyDetails?.email || req.user.email,
        phone: bodyDetails?.phone || '',
      },
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus: 'pending',
    });

    const savedOrder = await order.save();

    // 3. Resolve the active payment gateway and create a session
    const gateway = PaymentService.getGateway(paymentMethod);
    const customerDetails = {
      email: bodyDetails?.email || req.user.email,
      name: req.user.name,
      phone: bodyDetails?.phone || '',
    };

    const paymentSession = await gateway.createSession(savedOrder, customerDetails);

    // 4. Update order with payment session identifier
    savedOrder.paymentId = paymentSession.paymentId;
    await savedOrder.save();

    // 5. Return redirect url and order ID
    res.status(200).json({
      url: paymentSession.url,
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error('Checkout failed:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay for an existing pending order
// @route   POST /api/payments/:id/pay
// @access  Private
export const payExistingOrder = async (req, res) => {
  const { paymentMethod } = req.body;

  if (!paymentMethod || !['stripe', 'sslcommerz'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Invalid or missing payment method' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.paymentStatus !== 'pending' && order.paymentStatus !== 'failed') {
      return res.status(400).json({ message: 'Order is not in pending or failed status' });
    }

    // Update the payment method if changed
    order.paymentMethod = paymentMethod;
    
    // Set status to pending if it was failed and user is retrying
    order.paymentStatus = 'pending';

    const gateway = PaymentService.getGateway(paymentMethod);
    const customerDetails = {
      email: order.shippingAddress.email || req.user.email,
      name: req.user.name,
      phone: order.shippingAddress.phone || '',
    };

    const paymentSession = await gateway.createSession(order, customerDetails);

    order.paymentId = paymentSession.paymentId;
    await order.save();

    res.status(200).json({
      url: paymentSession.url,
      orderId: order._id,
    });
  } catch (error) {
    console.error('Pay existing order failed:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment status of an order manually (fallback/redirect callback verification)
// @route   GET /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  const { gateway, session_id, order_id } = req.query;

  if (!gateway || !session_id || !order_id) {
    return res.status(400).json({ message: 'Missing gateway, session_id, or order_id' });
  }

  try {
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if already paid
    if (order.paymentStatus === 'paid') {
      return res.status(200).json({ success: true, order });
    }

    // Validate using Strategy Pattern
    const paymentGateway = PaymentService.getGateway(gateway);
    const verification = await paymentGateway.verifyPayment({ session_id, tran_id: session_id });

    if (verification.success) {
      order.paymentStatus = 'paid';
      order.paymentDetails = verification.details;
      await order.save();
      return res.status(200).json({ success: true, order });
    }

    res.status(400).json({ success: false, message: 'Payment verification failed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    SSLCommerz Success URL (POST) redirect to frontend
// @route   POST /api/payments/callback/sslcommerz/success
// @access  Public (Called by SSLCommerz)
export const sslCommerzSuccess = async (req, res) => {
  const payload = req.body;
  const { tran_id, val_id } = payload;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const order = await Order.findById(tran_id);
    if (!order) {
      return res.redirect(`${frontendUrl}/cart?payment=failed&reason=order_not_found`);
    }

    const gateway = PaymentService.getGateway('sslcommerz');
    const verification = await gateway.verifyPayment({ val_id, tran_id });

    if (verification.success) {
      order.paymentStatus = 'paid';
      order.paymentId = val_id;
      order.paymentDetails = verification.details;
      await order.save();

      return res.redirect(`${frontendUrl}/payment-success?gateway=sslcommerz&session_id=${val_id}&order_id=${tran_id}`);
    }

    res.redirect(`${frontendUrl}/cart?payment=failed&reason=verification_failed`);
  } catch (error) {
    console.error('SSLCommerz success handler error:', error);
    res.redirect(`${frontendUrl}/cart?payment=failed`);
  }
};

// @desc    SSLCommerz Failure / Cancel URL (POST) redirect to frontend
// @route   POST /api/payments/callback/sslcommerz/fail
// @access  Public (Called by SSLCommerz)
export const sslCommerzFailOrCancel = async (req, res) => {
  const { tran_id, status } = req.body;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const order = await Order.findById(tran_id);
    if (order) {
      order.paymentStatus = 'failed';
      order.paymentDetails = req.body;
      await order.save();
    }
    res.redirect(`${frontendUrl}/cart?payment=failed&status=${status || 'failed'}`);
  } catch (error) {
    console.error('SSLCommerz fail/cancel handler error:', error);
    res.redirect(`${frontendUrl}/cart?payment=failed`);
  }
};

// @desc    SSLCommerz IPN (POST) background verification
// @route   POST /api/payments/callback/sslcommerz/ipn
// @access  Public (Called by SSLCommerz)
export const sslCommerzIPN = async (req, res) => {
  try {
    const gateway = PaymentService.getGateway('sslcommerz');
    const ipnData = await gateway.handleWebhook({}, req.body);

    if (ipnData && ipnData.paymentStatus === 'paid') {
      const order = await Order.findById(ipnData.orderId);
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.paymentId = ipnData.paymentId;
        order.paymentDetails = ipnData.raw;
        await order.save();
      }
    }
    res.status(200).json({ status: 'IPN Processed' });
  } catch (error) {
    console.error('SSLCommerz IPN handler failed:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Stripe Webhook (POST) event processor
// @route   POST /api/payments/webhook/stripe
// @access  Public (Called by Stripe)
export const stripeWebhook = async (req, res) => {
  const headers = req.headers;
  const rawBody = req.body; // Needs to be raw buffer for signature verification

  try {
    const gateway = PaymentService.getGateway('stripe');
    const webhookData = await gateway.handleWebhook(headers, rawBody);

    if (webhookData && webhookData.paymentStatus === 'paid') {
      const order = await Order.findById(webhookData.orderId);
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.paymentId = webhookData.paymentId;
        order.paymentDetails = webhookData.raw;
        await order.save();
      }
    }
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

import express from 'express';
import {
  checkout,
  verifyPayment,
  sslCommerzSuccess,
  sslCommerzFailOrCancel,
  sslCommerzIPN,
  stripeWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Checkout session creation
router.post('/payments/checkout', protect, checkout);

// Manual verification endpoint (front-end success page callback)
router.get('/payments/verify', protect, verifyPayment);

// SSLCommerz redirect callbacks (POST from gateway)
router.post('/payments/callback/sslcommerz/success', sslCommerzSuccess);
router.post('/payments/callback/sslcommerz/fail', sslCommerzFailOrCancel);
router.post('/payments/callback/sslcommerz/cancel', sslCommerzFailOrCancel);
router.post('/payments/callback/sslcommerz/ipn', sslCommerzIPN);

// Stripe Webhook callback
// Note: server.js must capture req.rawBody as a buffer for Stripe verification
router.post('/payments/webhook/stripe', stripeWebhook);

export default router;

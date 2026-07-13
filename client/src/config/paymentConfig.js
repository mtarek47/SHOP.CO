/**
 * Central configuration for payment methods.
 * Toggle the boolean flags below to activate or deactivate gateways.
 */
export const paymentConfig = {
  activeMethods: {
    stripe: true,       // Set to false to hide/deactivate International payment (Stripe)
    sslcommerz: true,   // Set to false to hide/deactivate Local payment (SSLCommerz)
  }
};

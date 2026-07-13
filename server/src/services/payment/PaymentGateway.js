/**
 * Abstract Class PaymentGateway.
 * Acts as the interface for all payment providers.
 */
export default class PaymentGateway {
  constructor(name) {
    if (this.constructor === PaymentGateway) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.name = name;
  }

  /**
   * Initialize a payment session.
   * @param {Object} order - Order document/details.
   * @param {Object} customerDetails - Customer information (email, name, etc).
   * @returns {Promise<Object>} Session object containing URL and transaction ID/ref.
   */
  async createSession(order, customerDetails) {
    throw new Error("Method 'createSession()' must be implemented.");
  }

  /**
   * Verify transaction validity.
   * @param {Object} payload - Data payload from redirect/IPN.
   * @returns {Promise<Object>} Verification status and payload.
   */
  async verifyPayment(payload) {
    throw new Error("Method 'verifyPayment()' must be implemented.");
  }

  /**
   * Handle API webhook event.
   * @param {Object} signature - Webhook signature/headers.
   * @param {Buffer|Object} rawBody - Raw webhook body/data.
   * @returns {Promise<Object>} Standardized response containing order ID and payment status.
   */
  async handleWebhook(signature, rawBody) {
    throw new Error("Method 'handleWebhook()' must be implemented.");
  }
}

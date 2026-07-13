import StripeGateway from './StripeGateway.js';
import SSLCommerzGateway from './SSLCommerzGateway.js';

class PaymentService {
  constructor() {
    this.gateways = {
      stripe: new StripeGateway(),
      sslcommerz: new SSLCommerzGateway(),
    };
  }

  /**
   * Resolves the concrete payment gateway instance by name.
   * @param {string} name - Name of the gateway ('stripe' or 'sslcommerz').
   * @returns {PaymentGateway} Concrete gateway instance.
   */
  getGateway(name) {
    if (!name) {
      throw new Error('Payment gateway name is required.');
    }
    const gateway = this.gateways[name.toLowerCase()];
    if (!gateway) {
      throw new Error(`Payment gateway '${name}' is not supported.`);
    }
    return gateway;
  }
}

export default new PaymentService();

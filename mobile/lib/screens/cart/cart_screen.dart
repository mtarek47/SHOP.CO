import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/cart_provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/order_service.dart';
import '../../models/order_model.dart';
import '../../models/cart_item_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../auth/auth_bottom_sheet.dart';


const String _validPromo = 'SHOP20';

/// CartScreen — mirrors CartPage.jsx exactly
/// Cart items, promo code, order summary, checkout form, payment selection
class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final _orderService = OrderService();

  bool _promoApplied = false;
  final _promoCtrl = TextEditingController();

  bool _showCheckout = false;
  bool _loading = false;
  String? _error;

  // Checkout form — mirrors CartPage.jsx form fields
  final _addressCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _postalCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  String _country = 'Bangladesh';
  String _paymentMethod = 'sslcommerz'; // or 'stripe'

  List<OrderModel> _myOrders = [];
  bool _loadingOrders = false;

  @override
  void initState() {
    super.initState();
    _loadOrders();
    // Pre-fill email if user logged in
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = context.read<AuthProvider>().user;
      if (user?.email != null) _emailCtrl.text = user!.email;
    });
  }

  Future<void> _loadOrders() async {
    setState(() => _loadingOrders = true);
    final auth = context.read<AuthProvider>();
    if (!auth.isLoggedIn || auth.user?.token == null) {
      if (mounted) setState(() => _loadingOrders = false);
      return;
    }
    _myOrders = await _orderService.fetchMyOrders(auth.user!.token!);
    if (mounted) setState(() => _loadingOrders = false);
  }

  void _applyPromo() {
    if (_promoCtrl.text.trim().toUpperCase() == _validPromo) {
      setState(() => _promoApplied = true);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Promo code applied! 20% discount')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid promo code')),
      );
    }
  }

  Future<void> _checkout() async {
    final cart = context.read<CartProvider>();
    final auth = context.read<AuthProvider>();

    if (!auth.isLoggedIn || auth.user?.token == null) {
      // Show auth sheet or error if token is missing
      AuthBottomSheet.show(context);
      return;
    }

    if (_addressCtrl.text.isEmpty || _cityCtrl.text.isEmpty || _emailCtrl.text.isEmpty) {
      setState(() => _error = 'Please fill in all required fields');
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    final items = cart.items
        .map((i) => {
              'productId': i.product.id,
              'name': i.product.name,
              'qty': i.quantity,
              'size': i.selectedSize,
              'color': i.selectedColor,
            })
        .toList();

    try {
      final response = await _orderService.checkout(
        items: items,
        address: _addressCtrl.text,
        city: _cityCtrl.text,
        postalCode: _postalCtrl.text,
        country: _country,
        email: _emailCtrl.text,
        phone: _phoneCtrl.text,
        paymentMethod: _paymentMethod,
        token: auth.user!.token!,
      );

      if (response != null && response.containsKey('url')) {
        final url = response['url'];
        if (await canLaunchUrl(Uri.parse(url))) {
          await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
          cart.clearCart();
          if (mounted) Navigator.pushReplacementNamed(context, '/payment-success');
        } else {
          setState(() => _error = 'Failed to open payment page.');
        }
      } else {
        setState(() => _error = 'Failed to initiate $_paymentMethod payment. Try again.');
      }
    } catch (e) {
      setState(() => _error = 'Checkout error: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Your Cart')),
      body: cart.items.isEmpty
          ? _buildEmptyCart()
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Cart Items
                  ...cart.items.map((item) => _CartItemTile(
                        item: item,
                        onRemove: () => cart.removeItem(item.cartKey),
                        onQtyChange: (qty) => cart.updateQty(item.cartKey, qty),
                      )),

                  const SizedBox(height: 16),

                  // Promo Code — mirrors CartPage.jsx promo section
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _promoCtrl,
                          decoration: const InputDecoration(
                            hintText: 'Add promo code',
                            prefixIcon: Icon(Icons.discount_outlined),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: _applyPromo,
                        child: const Text('Apply'),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Order Summary — mirrors CartPage.jsx order summary
                  _OrderSummary(
                    subtotal: cart.subtotal,
                    promoApplied: _promoApplied,
                    discountAmount: cart.discountAmount(_promoApplied),
                    total: cart.total(_promoApplied),
                  ),

                  const SizedBox(height: 24),

                  // Checkout toggle
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => setState(() => _showCheckout = !_showCheckout),
                      child: Text(_showCheckout ? 'Hide Checkout' : 'Proceed to Checkout'),
                    ),
                  ),

                  // Checkout Form — mirrors CartPage.jsx checkout form
                  if (_showCheckout) ...[
                    const SizedBox(height: 24),
                    _CheckoutForm(
                      addressCtrl: _addressCtrl,
                      cityCtrl: _cityCtrl,
                      postalCtrl: _postalCtrl,
                      emailCtrl: _emailCtrl,
                      phoneCtrl: _phoneCtrl,
                      country: _country,
                      paymentMethod: _paymentMethod,
                      onCountryChanged: (v) => setState(() => _country = v ?? _country),
                      onPaymentMethodChanged: (v) =>
                          setState(() => _paymentMethod = v ?? _paymentMethod),
                    ),

                    if (_error != null)
                      Container(
                        margin: const EdgeInsets.only(top: 12),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.redLight,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          _error!,
                          style: const TextStyle(color: AppColors.red, fontSize: 14),
                        ),
                      ),

                    const SizedBox(height: 16),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _checkout,
                        child: _loading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: AppColors.white),
                              )
                            : const Text('Place Order & Pay'),
                      ),
                    ),
                  ],

                  // My Orders History
                  if (_myOrders.isNotEmpty) ...[
                    const SizedBox(height: 32),
                    Text('Order History', style: AppTextStyles.sectionTitle),
                    const SizedBox(height: 12),
                    ..._myOrders.map((order) => _OrderHistoryTile(order: order)),
                  ],

                  const SizedBox(height: 80),
                ],
              ),
            ),
    );
  }

  Widget _buildEmptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.shopping_bag_outlined, size: 80, color: AppColors.gray200),
          const SizedBox(height: 16),
          Text('Your cart is empty', style: AppTextStyles.bodyLg),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/category'),
            child: const Text('Shop Now'),
          ),
        ],
      ),
    );
  }
}

// ─── Cart Item Tile ────────────────────────────────────────────────────────────

class _CartItemTile extends StatelessWidget {
  final CartItemModel item;
  final VoidCallback onRemove;
  final Function(int) onQtyChange;

  const _CartItemTile({
    required this.item,
    required this.onRemove,
    required this.onQtyChange,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.gray100),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // Product Image
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              width: 80,
              height: 80,
              color: AppColors.offWhite,
              child: item.product.displayImage.isNotEmpty
                  ? Image.network(
                      item.product.displayImage,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Icon(
                        Icons.image_not_supported_outlined,
                        color: AppColors.gray200,
                      ),
                    )
                  : const Icon(Icons.image_not_supported_outlined,
                      color: AppColors.gray200),
            ),
          ),
          const SizedBox(width: 12),

          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.product.name,
                    style: AppTextStyles.labelLg, maxLines: 2),
                Text(
                  'Size: ${item.selectedSize} | Color: ${item.selectedColor}',
                  style: AppTextStyles.bodySm,
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'BDT ${item.totalPrice.toStringAsFixed(0)}',
                      style: AppTextStyles.price.copyWith(fontSize: 16),
                    ),
                    Row(
                      children: [
                        _QtyButton(
                          icon: Icons.remove,
                          onTap: () => onQtyChange(item.quantity - 1),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          child: Text('${item.quantity}', style: AppTextStyles.labelMd),
                        ),
                        _QtyButton(
                          icon: Icons.add,
                          onTap: () => onQtyChange(item.quantity + 1),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Remove
          IconButton(
            icon: const Icon(Icons.delete_outline, color: AppColors.red, size: 20),
            onPressed: onRemove,
          ),
        ],
      ),
    );
  }
}

class _QtyButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _QtyButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.gray200),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Icon(icon, size: 16),
      ),
    );
  }
}

// ─── Order Summary ─────────────────────────────────────────────────────────────

class _OrderSummary extends StatelessWidget {
  final double subtotal;
  final bool promoApplied;
  final double discountAmount;
  final double total;

  const _OrderSummary({
    required this.subtotal,
    required this.promoApplied,
    required this.discountAmount,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.lightGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Order Summary', style: AppTextStyles.labelLg),
          const SizedBox(height: 12),
          _Row(label: 'Subtotal', value: 'BDT ${subtotal.toStringAsFixed(0)}'),
          if (promoApplied)
            _Row(
              label: 'Discount (20%)',
              value: '-BDT ${discountAmount.toStringAsFixed(0)}',
              isDiscount: true,
            ),
          _Row(label: 'Delivery Fee', value: 'BDT 15'),
          const Divider(color: AppColors.gray200),
          _Row(
            label: 'Total',
            value: 'BDT ${total.toStringAsFixed(0)}',
            isBold: true,
          ),
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  final bool isBold;
  final bool isDiscount;

  const _Row({
    required this.label,
    required this.value,
    this.isBold = false,
    this.isDiscount = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: isBold ? AppTextStyles.labelLg : AppTextStyles.bodyMd),
          Text(
            value,
            style: (isBold ? AppTextStyles.price : AppTextStyles.bodyMd).copyWith(
              color: isDiscount ? AppColors.green : null,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Checkout Form ─────────────────────────────────────────────────────────────

class _CheckoutForm extends StatelessWidget {
  final TextEditingController addressCtrl;
  final TextEditingController cityCtrl;
  final TextEditingController postalCtrl;
  final TextEditingController emailCtrl;
  final TextEditingController phoneCtrl;
  final String country;
  final String paymentMethod;
  final Function(String?) onCountryChanged;
  final Function(String?) onPaymentMethodChanged;

  const _CheckoutForm({
    required this.addressCtrl,
    required this.cityCtrl,
    required this.postalCtrl,
    required this.emailCtrl,
    required this.phoneCtrl,
    required this.country,
    required this.paymentMethod,
    required this.onCountryChanged,
    required this.onPaymentMethodChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Shipping Details', style: AppTextStyles.sectionTitle),
        const SizedBox(height: 16),
        TextField(
          controller: addressCtrl,
          decoration: const InputDecoration(hintText: 'Street Address *'),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: cityCtrl,
                decoration: const InputDecoration(hintText: 'City *'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TextField(
                controller: postalCtrl,
                decoration: const InputDecoration(hintText: 'Postal Code'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        DropdownButtonFormField<String>(
          value: country,
          decoration: const InputDecoration(hintText: 'Country'),
          items: ['Bangladesh', 'India', 'USA', 'UK', 'Canada']
              .map((c) => DropdownMenuItem(value: c, child: Text(c)))
              .toList(),
          onChanged: onCountryChanged,
        ),
        const SizedBox(height: 10),
        TextField(
          controller: emailCtrl,
          keyboardType: TextInputType.emailAddress,
          decoration: const InputDecoration(hintText: 'Email Address *'),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: phoneCtrl,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(hintText: 'Phone Number'),
        ),

        const SizedBox(height: 20),
        Text('Payment Method', style: AppTextStyles.sectionTitle),
        const SizedBox(height: 12),

        // Payment Options — mirrors paymentConfig.activeMethods
        _PaymentOption(
          title: 'SSLCommerz (Local Payment)',
          subtitle: 'bKash, Nagad, Cards',
          value: 'sslcommerz',
          selectedValue: paymentMethod,
          onTap: () => onPaymentMethodChanged('sslcommerz'),
        ),
        _PaymentOption(
          title: 'Stripe (International)',
          subtitle: 'Visa, Mastercard, etc.',
          value: 'stripe',
          selectedValue: paymentMethod,
          onTap: () => onPaymentMethodChanged('stripe'),
        ),
      ],
    );
  }
}

// ─── Order History Tile ────────────────────────────────────────────────────────

class _OrderHistoryTile extends StatelessWidget {
  final OrderModel order;

  const _OrderHistoryTile({required this.order});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.gray100),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Order #${order.id.substring(0, 8)}...',
                  style: AppTextStyles.labelMd,
                ),
                Text(
                  '${order.items.length} item(s) • BDT ${order.totalAmount.toStringAsFixed(0)}',
                  style: AppTextStyles.bodyMd,
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: order.status == 'delivered'
                  ? AppColors.green.withValues(alpha: 0.1)
                  : AppColors.yellow.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(100),
            ),
            child: Text(
              order.status.toUpperCase(),
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: order.status == 'delivered' ? AppColors.green : Colors.orange,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Payment Option Widget ─────────────────────────────────────────────────────

class _PaymentOption extends StatelessWidget {
  final String title;
  final String subtitle;
  final String value;
  final String selectedValue;
  final VoidCallback onTap;

  const _PaymentOption({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.selectedValue,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = value == selectedValue;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppColors.black : AppColors.gray200,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppColors.black : AppColors.gray400,
                  width: isSelected ? 6 : 2,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 14)),
                Text(subtitle,
                    style: const TextStyle(
                        color: AppColors.gray500, fontSize: 12)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}


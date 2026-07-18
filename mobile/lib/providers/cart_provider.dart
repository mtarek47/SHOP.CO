import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/cart_item_model.dart';
import '../models/product_model.dart';

const String _cartKey = 'shopco_cart';
const double deliveryFee = 15.0;
const double discountRate = 0.20;

/// CartProvider — mirrors CartContext.jsx
/// Persists cart to shared_preferences (same as localStorage in web)
class CartProvider extends ChangeNotifier {
  List<CartItemModel> _items = [];

  List<CartItemModel> get items => List.unmodifiable(_items);

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal => _items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double discountAmount(bool promoApplied) =>
      promoApplied ? subtotal * discountRate : 0.0;

  double total(bool promoApplied) =>
      subtotal - discountAmount(promoApplied) + deliveryFee;

  CartProvider() {
    _loadFromStorage();
  }

  /// Add item to cart — mirrors addItem() in CartContext.jsx
  void addItem(ProductModel product, String size, String color, {int qty = 1}) {
    final key = '${product.id}_${size}_$color';
    final existingIndex = _items.indexWhere((i) => i.cartKey == key);

    if (existingIndex >= 0) {
      _items[existingIndex].quantity += qty;
    } else {
      _items.add(CartItemModel(
        product: product,
        selectedSize: size,
        selectedColor: color,
        quantity: qty,
      ));
    }
    notifyListeners();
    _saveToStorage();
  }

  /// Remove item — mirrors removeItem() in CartContext.jsx
  void removeItem(String cartKey) {
    _items.removeWhere((i) => i.cartKey == cartKey);
    notifyListeners();
    _saveToStorage();
  }

  /// Update quantity — mirrors updateQty() in CartContext.jsx
  void updateQty(String cartKey, int qty) {
    if (qty <= 0) {
      removeItem(cartKey);
      return;
    }
    final index = _items.indexWhere((i) => i.cartKey == cartKey);
    if (index >= 0) {
      _items[index] = _items[index].copyWith(quantity: qty);
      notifyListeners();
      _saveToStorage();
    }
  }

  /// Clear cart — mirrors clearCart() in CartContext.jsx
  void clearCart() {
    _items.clear();
    notifyListeners();
    _saveToStorage();
  }

  Future<void> _saveToStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = _items.map((i) => i.toJson()).toList();
    await prefs.setString(_cartKey, jsonEncode(jsonList));
  }

  Future<void> _loadFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonStr = prefs.getString(_cartKey);
      if (jsonStr == null) return;

      final List<dynamic> jsonList = jsonDecode(jsonStr);
      // Note: We store minimal data; full product data will be loaded separately
      // For now we reconstruct with stored data
      _items = jsonList.map((json) {
        final product = ProductModel(
          id: json['productId'] ?? '',
          name: json['name'] ?? '',
          price: (json['price'] ?? 0).toDouble(),
          rating: 0,
          image: json['image'],
        );
        return CartItemModel(
          product: product,
          selectedSize: json['selectedSize'] ?? '',
          selectedColor: json['selectedColor'] ?? '',
          quantity: json['quantity'] ?? 1,
        );
      }).toList();

      notifyListeners();
    } catch (_) {}
  }
}

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/order_model.dart';
import '../core/constants/api_constants.dart';

class OrderService {
  static final OrderService _instance = OrderService._internal();
  factory OrderService() => _instance;
  OrderService._internal();

  /// Checkout — replaces placeOrder, initStripePayment, and initSSLCommerzPayment
  Future<Map<String, dynamic>?> checkout({
    required List<Map<String, dynamic>> items,
    required String address,
    required String city,
    required String postalCode,
    required String country,
    required String email,
    required String phone,
    required String paymentMethod,
    required String token,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.checkout),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
            body: jsonEncode({
              'cartItems': items,
              'shippingAddress': {
                'address': address,
                'city': city,
                'postalCode': postalCode,
                'country': country,
              },
              'paymentMethod': paymentMethod,
              'customerDetails': {
                'email': email,
                'phone': phone,
              }
            }),
          )
          .timeout(const Duration(seconds: 20));

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('[OrderService] checkout failed: ${response.statusCode} ${response.body}');
        return null;
      }
    } catch (e) {
      print('[OrderService] checkout error: $e');
      return null;
    }
  }

  /// Fetch user's order history — mirrors loadMyOrders() in CartPage.jsx
  Future<List<OrderModel>> fetchMyOrders(String token) async {
    try {
      final response = await http
          .get(
            Uri.parse(ApiConstants.myOrders),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => OrderModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}

/// API Constants for SHOP.CO Mobile App
/// Mirrors productService.js base URL
class ApiConstants {
  ApiConstants._();

  /// Change this to your machine's local IP when using a physical device
  /// Android Emulator: http://10.0.2.2:5000/api
  /// iOS Simulator:    http://127.0.0.1:5000/api  ← use IP, NOT 'localhost'
  /// Physical Device:  http://<your-local-ip>:5000/api
  static const String baseUrl = 'http://127.0.0.1:5000/api';


  // Products
  static const String products = '$baseUrl/products';
  static String productById(String id) => '$baseUrl/products/$id';

  // Auth
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String logout = '$baseUrl/auth/logout';
  static const String me = '$baseUrl/auth/me';

  // Orders
  static const String orders = '$baseUrl/orders';
  static const String myOrders = '$baseUrl/orders/myorders';

  // Payment
  static const String checkout = '$baseUrl/payments/checkout';

  // Config
  static const String heroConfig = '$baseUrl/config/hero';
}

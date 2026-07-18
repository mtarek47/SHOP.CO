import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import '../core/constants/api_constants.dart';

class AuthResult {
  final bool success;
  final String? message;
  final UserModel? user;

  AuthResult({required this.success, this.message, this.user});
}

/// AuthService — mirrors AuthContext.jsx login/register/logout
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  /// Login — mirrors: login(email, password)
  Future<AuthResult> login(String email, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.login),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'email': email, 'password': password}),
          )
          .timeout(const Duration(seconds: 15));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        final userData = data['user'] ?? data;
        // Inject token into userData if it exists at the root level
        if (data.containsKey('token')) {
          userData['token'] = data['token'];
        }
        return AuthResult(
          success: true,
          user: UserModel.fromJson(userData),
        );
      }
      return AuthResult(
        success: false,
        message: data['message'] ?? 'Login failed',
      );
    } catch (e) {
      return AuthResult(success: false, message: 'Connection error');
    }
  }

  /// Register — mirrors: register(name, email, password)
  Future<AuthResult> register(String name, String email, String password) async {
    try {
      final response = await http
          .post(
            Uri.parse(ApiConstants.register),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'name': name, 'email': email, 'password': password}),
          )
          .timeout(const Duration(seconds: 15));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final userData = data['user'] ?? data;
        // Inject token into userData if it exists at the root level
        if (data.containsKey('token')) {
          userData['token'] = data['token'];
        }
        return AuthResult(
          success: true,
          user: UserModel.fromJson(userData),
        );
      }
      return AuthResult(
        success: false,
        message: data['message'] ?? 'Registration failed',
      );
    } catch (e) {
      return AuthResult(success: false, message: 'Connection error');
    }
  }

  /// Get current user
  Future<UserModel?> getMe(String? token) async {
    try {
      final headers = {'Content-Type': 'application/json'};
      if (token != null) headers['Authorization'] = 'Bearer $token';

      final response = await http
          .get(Uri.parse(ApiConstants.me), headers: headers)
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return UserModel.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

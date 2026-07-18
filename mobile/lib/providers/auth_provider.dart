import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

const String _userKey = 'shopco_user';

/// AuthProvider — mirrors AuthContext.jsx
class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _loading = false;

  UserModel? get user => _user;
  bool get loading => _loading;
  bool get isLoggedIn => _user != null;

  final _authService = AuthService();

  AuthProvider() {
    _loadUserFromStorage();
  }

  /// Login — mirrors login() in AuthContext.jsx
  Future<({bool success, String? message})> login(
      String email, String password) async {
    _loading = true;
    notifyListeners();

    final result = await _authService.login(email, password);
    _loading = false;

    if (result.success && result.user != null) {
      _user = result.user;
      await _saveUserToStorage();
      notifyListeners();
      return (success: true, message: null);
    }

    notifyListeners();
    return (success: false, message: result.message);
  }

  /// Register — mirrors register() in AuthContext.jsx
  Future<({bool success, String? message})> register(
      String name, String email, String password) async {
    _loading = true;
    notifyListeners();

    final result = await _authService.register(name, email, password);
    _loading = false;

    if (result.success && result.user != null) {
      _user = result.user;
      await _saveUserToStorage();
      notifyListeners();
      return (success: true, message: null);
    }

    notifyListeners();
    return (success: false, message: result.message);
  }

  /// Logout — mirrors logout() in AuthContext.jsx
  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
    notifyListeners();
  }

  Future<void> _saveUserToStorage() async {
    if (_user == null) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(_user!.toJson()));
  }

  Future<void> _loadUserFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonStr = prefs.getString(_userKey);
      if (jsonStr == null) return;
      
      _user = UserModel.fromJson(jsonDecode(jsonStr));
      notifyListeners();
    } catch (e) {
      print('Error loading user from storage: $e');
    }
  }
}

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product_model.dart';
import '../core/constants/api_constants.dart';

/// ProductService — mirrors client/src/services/productService.js
class ProductService {
  static final ProductService _instance = ProductService._internal();
  factory ProductService() => _instance;
  ProductService._internal();

  /// Fetch products with optional filters
  /// Mirrors: fetchProducts(filters)
  Future<List<ProductModel>> fetchProducts({
    String? category,
    String? search,
    double? minPrice,
    double? maxPrice,
    List<String>? sizes,
    List<String>? colors,
    String? sort,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (category != null && category.isNotEmpty) queryParams['category'] = category;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
      if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
      if (sizes != null && sizes.isNotEmpty) queryParams['sizes'] = sizes.join(',');
      if (colors != null && colors.isNotEmpty) queryParams['colors'] = colors.join(',');
      if (sort != null && sort.isNotEmpty) queryParams['sort'] = sort;

      final uri = Uri.parse(ApiConstants.products).replace(queryParameters: queryParams);
      final response = await http.get(uri).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => ProductModel.fromJson(json)).toList();
      }
      // ignore: avoid_print
      print('[ProductService] fetchProducts failed: ${response.statusCode} ${response.body.substring(0, response.body.length.clamp(0, 200))}');
      return [];
    } catch (e) {
      // ignore: avoid_print
      print('[ProductService] fetchProducts error: $e');
      return [];
    }
  }

  /// Fetch a single product by ID
  /// Mirrors: fetchProductById(id)
  Future<ProductModel?> fetchProductById(String id) async {
    try {
      final response = await http
          .get(Uri.parse(ApiConstants.productById(id)))
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        return ProductModel.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Fetch related products in same category, excluding current product
  /// Mirrors: fetchRelatedProducts(category, excludeId)
  Future<List<ProductModel>> fetchRelatedProducts(String category, String excludeId) async {
    final products = await fetchProducts(category: category);
    return products.where((p) => p.id != excludeId).take(4).toList();
  }

  /// Fetch hero config
  Future<Map<String, dynamic>?> fetchHeroConfig() async {
    try {
      final response = await http
          .get(Uri.parse(ApiConstants.heroConfig))
          .timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

/// Product model — mirrors backend product schema and web app ProductCard usage
class ProductModel {
  final String id;
  final String name;
  final String? description;
  final double price;
  final double? originalPrice;
  final double? discount;
  final double rating;
  final int? reviewCount;
  final String? image;
  final List<String> images;
  final String? bgColor;
  final String? category;
  final List<String> sizes;
  final List<String> colors;
  final bool inStock;
  final bool isNewArrival;
  final bool isTopSelling;

  const ProductModel({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.originalPrice,
    this.discount,
    required this.rating,
    this.reviewCount,
    this.image,
    this.images = const [],
    this.bgColor,
    this.category,
    this.sizes = const [],
    this.colors = const [],
    this.inStock = true,
    this.isNewArrival = false,
    this.isTopSelling = false,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      price: (json['price'] ?? 0).toDouble(),
      originalPrice: json['originalPrice'] != null
          ? (json['originalPrice']).toDouble()
          : null,
      discount:
          json['discount'] != null ? (json['discount']).toDouble() : null,
      rating: (json['rating'] ?? 0).toDouble(),
      reviewCount: json['reviewCount'],
      image: json['image'],
      images: List<String>.from(json['images'] ?? []),
      bgColor: json['bgColor'],
      category: json['category'],
      sizes: List<String>.from(json['sizes'] ?? []),
      colors: List<String>.from(json['colors'] ?? []),
      inStock: json['inStock'] ?? true,
      isNewArrival: json['isNewArrival'] ?? false,
      isTopSelling: json['isTopSelling'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'price': price,
        'rating': rating,
      };

  /// Returns the primary display image
  String get displayImage => image ?? (images.isNotEmpty ? images.first : '');

  /// Returns true if this product has a sale price
  bool get isOnSale => originalPrice != null && originalPrice! > price;
}

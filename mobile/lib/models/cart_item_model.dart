import 'product_model.dart';

/// CartItem model — mirrors CartContext.jsx state
class CartItemModel {
  final ProductModel product;
  final String selectedSize;
  final String selectedColor;
  int quantity;

  CartItemModel({
    required this.product,
    required this.selectedSize,
    required this.selectedColor,
    this.quantity = 1,
  });

  double get totalPrice => product.price * quantity;

  String get cartKey => '${product.id}_${selectedSize}_$selectedColor';

  Map<String, dynamic> toJson() => {
        'productId': product.id,
        'name': product.name,
        'price': product.price,
        'image': product.displayImage,
        'selectedSize': selectedSize,
        'selectedColor': selectedColor,
        'quantity': quantity,
      };

  CartItemModel copyWith({int? quantity}) {
    return CartItemModel(
      product: product,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
      quantity: quantity ?? this.quantity,
    );
  }
}

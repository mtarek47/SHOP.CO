import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/product_service.dart';
import '../../models/product_model.dart';
import '../../providers/cart_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../widgets/star_rating.dart';
import '../../widgets/product_card.dart';
import '../../widgets/section_header.dart';

/// ProductDetailScreen — mirrors ProductDetailPage.jsx
class ProductDetailScreen extends StatefulWidget {
  final String productId;
  final Function(String id) onProductTap;

  const ProductDetailScreen({
    super.key,
    required this.productId,
    required this.onProductTap,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final _productService = ProductService();

  ProductModel? _product;
  List<ProductModel> _related = [];
  bool _loading = true;

  String? _selectedSize;
  String? _selectedColor;
  int _quantity = 1;
  int _selectedImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    setState(() => _loading = true);

    final product = await _productService.fetchProductById(widget.productId);
    if (!mounted) return;

    if (product != null) {
      final related = await _productService.fetchRelatedProducts(
        product.category ?? '',
        product.id,
      );

      setState(() {
        _product = product;
        _related = related;
        _selectedSize = product.sizes.isNotEmpty ? product.sizes.first : null;
        _selectedColor = product.colors.isNotEmpty ? product.colors.first : null;
        _loading = false;
      });
    } else {
      setState(() => _loading = false);
    }
  }

  void _addToCart() {
    if (_product == null) return;
    if (_selectedSize == null && _product!.sizes.isNotEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a size')),
      );
      return;
    }
    if (_selectedColor == null && _product!.colors.isNotEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a color')),
      );
      return;
    }

    context.read<CartProvider>().addItem(
          _product!,
          _selectedSize ?? 'One Size',
          _selectedColor ?? 'Default',
          qty: _quantity,
        );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${_product!.name} added to cart!'),
        action: SnackBarAction(
          label: 'View Cart',
          textColor: AppColors.yellow,
          onPressed: () => Navigator.pushNamed(context, '/cart'),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: AppColors.black)),
      );
    }

    if (_product == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Product not found')),
      );
    }

    final p = _product!;
    final allImages = [
      if (p.image != null) p.image!,
      ...p.images.where((img) => img != p.image),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(p.name, maxLines: 1, overflow: TextOverflow.ellipsis),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Main Image
            Container(
              height: 360,
              color: _parseColor(p.bgColor) ?? AppColors.offWhite,
              child: Stack(
                children: [
                  // Product Image
                  PageView.builder(
                    itemCount: allImages.isEmpty ? 1 : allImages.length,
                    onPageChanged: (i) => setState(() => _selectedImageIndex = i),
                    itemBuilder: (_, i) {
                      final imgUrl = allImages.isEmpty ? '' : allImages[i];
                      return imgUrl.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: imgUrl,
                              fit: BoxFit.contain,
                              placeholder: (_, __) => const Center(
                                child: CircularProgressIndicator(strokeWidth: 2),
                              ),
                              errorWidget: (_, __, ___) => const Icon(
                                Icons.image_not_supported_outlined,
                                size: 80,
                                color: AppColors.gray200,
                              ),
                            )
                          : const Icon(
                              Icons.image_not_supported_outlined,
                              size: 80,
                              color: AppColors.gray200,
                            );
                    },
                  ),

                  // Image dots indicator
                  if (allImages.length > 1)
                    Positioned(
                      bottom: 12,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          allImages.length,
                          (i) => Container(
                            margin: const EdgeInsets.symmetric(horizontal: 3),
                            width: _selectedImageIndex == i ? 20 : 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: _selectedImageIndex == i
                                  ? AppColors.black
                                  : AppColors.gray200,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name
                  Text(p.name, style: AppTextStyles.displaySm),

                  const SizedBox(height: 8),

                  // Rating
                  StarRating(rating: p.rating),

                  const SizedBox(height: 12),

                  // Price Row
                  Row(
                    children: [
                      Text(
                        'BDT ${p.price.toStringAsFixed(0)}',
                        style: AppTextStyles.price.copyWith(fontSize: 22),
                      ),
                      if (p.isOnSale) ...[
                        const SizedBox(width: 10),
                        Text(
                          'BDT ${p.originalPrice!.toStringAsFixed(0)}',
                          style: AppTextStyles.priceOriginal,
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.redLight,
                            borderRadius: BorderRadius.circular(100),
                          ),
                          child: Text(
                            '-${p.discount?.toStringAsFixed(0)}%',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppColors.red,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),

                  if (p.description != null) ...[
                    const SizedBox(height: 16),
                    const Divider(color: AppColors.gray100),
                    const SizedBox(height: 12),
                    Text(p.description!, style: AppTextStyles.bodyLg),
                  ],

                  // Colors
                  if (p.colors.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    const Divider(color: AppColors.gray100),
                    const SizedBox(height: 16),
                    Text('Select Colors', style: AppTextStyles.labelLg),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 10,
                      children: p.colors.map((color) {
                        final isSelected = _selectedColor == color;
                        return GestureDetector(
                          onTap: () => setState(() => _selectedColor = color),
                          child: Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: _nameToColor(color),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isSelected ? AppColors.black : AppColors.gray200,
                                width: isSelected ? 3 : 1,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],

                  // Sizes
                  if (p.sizes.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    const Divider(color: AppColors.gray100),
                    const SizedBox(height: 16),
                    Text('Choose Size', style: AppTextStyles.labelLg),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      children: p.sizes.map((size) {
                        final isSelected = _selectedSize == size;
                        return ChoiceChip(
                          label: Text(size),
                          selected: isSelected,
                          onSelected: (_) => setState(() => _selectedSize = size),
                          selectedColor: AppColors.black,
                          backgroundColor: AppColors.lightGray,
                          labelStyle: TextStyle(
                            color: isSelected ? AppColors.white : AppColors.black,
                            fontWeight: FontWeight.w600,
                          ),
                        );
                      }).toList(),
                    ),
                  ],

                  const SizedBox(height: 24),
                  const Divider(color: AppColors.gray100),
                  const SizedBox(height: 16),

                  // Quantity + Add to Cart
                  Row(
                    children: [
                      // Quantity selector — mirrors web quantity controls
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.lightGray,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 18),
                              onPressed: _quantity > 1
                                  ? () => setState(() => _quantity--)
                                  : null,
                            ),
                            Text('$_quantity', style: AppTextStyles.labelLg),
                            IconButton(
                              icon: const Icon(Icons.add, size: 18),
                              onPressed: () => setState(() => _quantity++),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _addToCart,
                          child: const Text('Add to Cart'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // You Might Also Like — mirrors related products in web
            if (_related.isNotEmpty) ...[
              const Padding(
                padding: EdgeInsets.only(left: 16, right: 16, bottom: 8),
                child: Divider(color: AppColors.gray100),
              ),
              SectionHeader(title: 'YOU MIGHT ALSO LIKE'),
              const SizedBox(height: 12),
              SizedBox(
                height: 260,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _related.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (_, index) => SizedBox(
                    width: 160,
                    child: ProductCard(
                      product: _related[index],
                      onTap: () => widget.onProductTap(_related[index].id),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],

            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }

  Color? _parseColor(String? hex) {
    if (hex == null || hex.isEmpty) return null;
    try {
      return Color(int.parse('FF${hex.replaceAll('#', '')}', radix: 16));
    } catch (_) {
      return null;
    }
  }

  Color _nameToColor(String name) {
    const colorMap = {
      'black': Color(0xFF000000),
      'white': Color(0xFFFFFFFF),
      'red': Color(0xFFFF3333),
      'blue': Color(0xFF3333FF),
      'green': Color(0xFF01AB31),
      'yellow': Color(0xFFFFC633),
      'pink': Color(0xFFFFC0CB),
      'brown': Color(0xFF8B4513),
      'gray': Color(0xFF8C8C8C),
      'grey': Color(0xFF8C8C8C),
      'purple': Color(0xFF800080),
      'orange': Color(0xFFFF6600),
    };
    return colorMap[name.toLowerCase()] ?? AppColors.gray200;
  }
}

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/product_model.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';
import 'star_rating.dart';

/// ProductCard widget — mirrors ProductCard.jsx exactly
/// Same layout: image on top, name, rating, price row with sale badge
class ProductCard extends StatelessWidget {
  final ProductModel product;
  final VoidCallback? onTap;

  const ProductCard({
    super.key,
    required this.product,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = _parseColor(product.bgColor) ?? AppColors.offWhite;

    return GestureDetector(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product Image — mirrors .product-img-wrap
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: double.infinity,
                color: bgColor,
                child: product.displayImage.isNotEmpty
                    ? CachedNetworkImage(
                        imageUrl: product.displayImage,
                        fit: BoxFit.cover,
                        placeholder: (ctx, url) => const Center(
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        errorWidget: (ctx, url, err) => const Icon(
                          Icons.image_not_supported_outlined,
                          color: AppColors.gray200,
                          size: 40,
                        ),
                      )
                    : const Icon(
                        Icons.image_not_supported_outlined,
                        color: AppColors.gray200,
                        size: 40,
                      ),
              ),
            ),
          ),

          const SizedBox(height: 8),

          // Product Name — mirrors .product-name
          Text(
            product.name,
            style: AppTextStyles.productName,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),

          const SizedBox(height: 4),

          // Star Rating
          StarRating(rating: product.rating, size: 13),

          const SizedBox(height: 4),

          // Price Row — mirrors .product-price-row
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 6,
            runSpacing: 4,
            children: [
              Text(
                'BDT ${product.price.toStringAsFixed(0)}',
                style: AppTextStyles.price.copyWith(fontSize: 15),
              ),
              if (product.isOnSale) ...[
                Text(
                  'BDT ${product.originalPrice!.toStringAsFixed(0)}',
                  style: AppTextStyles.priceOriginal.copyWith(fontSize: 13),
                ),
                // Sale badge — mirrors .badge-sale
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.redLight,
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: Text(
                    '-${product.discount?.toStringAsFixed(0)}%',
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: AppColors.red,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Color? _parseColor(String? hex) {
    if (hex == null || hex.isEmpty) return null;
    try {
      final cleaned = hex.replaceAll('#', '');
      if (cleaned.length == 6) {
        return Color(int.parse('FF$cleaned', radix: 16));
      }
    } catch (_) {}
    return null;
  }
}

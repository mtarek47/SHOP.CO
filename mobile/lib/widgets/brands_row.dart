import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';

/// BrandsRow — mirrors Brands.jsx
/// Shows brand logos: Versace, Zara, Gucci, Prada, Calvin Klein
class BrandsRow extends StatelessWidget {
  final Function(String brand)? onBrandTap;

  const BrandsRow({super.key, this.onBrandTap});

  static const List<String> brands = [
    'VERSACE',
    'ZARA',
    'GUCCI',
    'PRADA',
    'Calvin Klein',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.black,
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: brands
              .map((brand) => GestureDetector(
                    onTap: () => onBrandTap?.call(brand),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Text(
                        brand,
                        style: AppTextStyles.displaySm.copyWith(
                          color: AppColors.white,
                          fontSize: 22,
                          fontStyle: brand == 'VERSACE'
                              ? FontStyle.italic
                              : FontStyle.normal,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ))
              .toList(),
        ),
      ),
    );
  }
}

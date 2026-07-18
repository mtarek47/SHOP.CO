import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';

/// StarRating widget — mirrors StarRating component in ProductCard.jsx
class StarRating extends StatelessWidget {
  final double rating;
  final double size;
  final bool showText;

  const StarRating({
    super.key,
    required this.rating,
    this.size = 14,
    this.showText = true,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        ...List.generate(5, (index) {
          final starValue = index + 1;
          IconData icon;
          if (starValue <= rating.floor()) {
            icon = Icons.star_rounded;
          } else if (starValue - 0.5 <= rating) {
            icon = Icons.star_half_rounded;
          } else {
            icon = Icons.star_outline_rounded;
          }
          return Icon(icon, size: size, color: AppColors.yellow);
        }),
        if (showText) ...[
          const SizedBox(width: 4),
          Text(
            '${rating.toStringAsFixed(1)}/5',
            style: TextStyle(
              fontSize: size * 0.9,
              color: AppColors.gray400,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }
}

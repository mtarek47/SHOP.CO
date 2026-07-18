import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';
import 'star_rating.dart';

/// TestimonialCard — mirrors Testimonials.jsx card
class TestimonialCard extends StatelessWidget {
  final String name;
  final double rating;
  final String review;
  final bool verified;

  const TestimonialCard({
    super.key,
    required this.name,
    required this.rating,
    required this.review,
    this.verified = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 260,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border.all(color: AppColors.gray100),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          StarRating(rating: rating, size: 15, showText: false),
          const SizedBox(height: 10),
          Row(
            children: [
              Text(
                name,
                style: AppTextStyles.labelLg,
              ),
              if (verified) ...[
                const SizedBox(width: 6),
                const Icon(Icons.verified, color: AppColors.green, size: 16),
              ],
            ],
          ),
          const SizedBox(height: 8),
          Text(
            review,
            style: AppTextStyles.bodyMd,
            maxLines: 4,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

/// Static testimonials data — mirrors Testimonials.jsx
final List<Map<String, dynamic>> sampleTestimonials = [
  {
    'name': 'Sarah M.',
    'rating': 5.0,
    'review':
        "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    'verified': true,
  },
  {
    'name': 'Alex K.',
    'rating': 5.0,
    'review':
        "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
    'verified': true,
  },
  {
    'name': 'James L.',
    'rating': 5.0,
    'review':
        "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    'verified': true,
  },
  {
    'name': 'Moana R.',
    'rating': 4.5,
    'review':
        "I absolutely love this shop! The clothes are stylish, high quality, and fit perfectly. Customer service was great too. Highly recommend!",
    'verified': true,
  },
];

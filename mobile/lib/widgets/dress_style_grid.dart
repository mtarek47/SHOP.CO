import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';

/// DressStyleGrid — mirrors DressStyle.jsx
/// "Browse by Dress Style" section with category tiles
class DressStyleGrid extends StatelessWidget {
  final Function(String category)? onCategoryTap;

  const DressStyleGrid({super.key, this.onCategoryTap});

  static const List<Map<String, dynamic>> categories = [
    {'label': 'Casual', 'key': 'casual', 'color': 0xFFF0F0F0, 'flex': 2},
    {'label': 'Formal', 'key': 'formal', 'color': 0xFFE8E8E8, 'flex': 3},
    {'label': 'Party', 'key': 'party', 'color': 0xFFE0E0E0, 'flex': 3},
    {'label': 'Gym', 'key': 'gym', 'color': 0xFFF0F0F0, 'flex': 2},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.offWhite,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'BROWSE BY DRESS STYLE',
            style: AppTextStyles.displaySm.copyWith(fontSize: 20),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _StyleTile(label: 'Casual', onTap: () => onCategoryTap?.call('casual')),
              const SizedBox(width: 12),
              _StyleTile(label: 'Formal', flex: 3, onTap: () => onCategoryTap?.call('formal')),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _StyleTile(label: 'Party', flex: 3, onTap: () => onCategoryTap?.call('party')),
              const SizedBox(width: 12),
              _StyleTile(label: 'Gym', onTap: () => onCategoryTap?.call('gym')),
            ],
          ),
        ],
      ),
    );
  }
}

class _StyleTile extends StatelessWidget {
  final String label;
  final int flex;
  final VoidCallback? onTap;

  const _StyleTile({
    required this.label,
    this.flex = 2,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      flex: flex,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: 100,
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          alignment: Alignment.bottomLeft,
          padding: const EdgeInsets.all(12),
          child: Text(
            label,
            style: AppTextStyles.displaySm.copyWith(fontSize: 18),
          ),
        ),
      ),
    );
  }
}

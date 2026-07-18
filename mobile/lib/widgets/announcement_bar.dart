import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';

/// AnnouncementBar — mirrors AnnouncementBar.jsx
/// Top promo bar, dismissible
class AnnouncementBar extends StatefulWidget {
  const AnnouncementBar({super.key});

  @override
  State<AnnouncementBar> createState() => _AnnouncementBarState();
}

class _AnnouncementBarState extends State<AnnouncementBar> {
  bool _visible = true;

  @override
  Widget build(BuildContext context) {
    if (!_visible) return const SizedBox.shrink();

    return Container(
      color: AppColors.black,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Text(
              'Sign up and get 20% off on your first order. Sign Up Now',
              style: AppTextStyles.bodySm.copyWith(
                color: AppColors.white,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          GestureDetector(
            onTap: () => setState(() => _visible = false),
            child: const Icon(
              Icons.close,
              color: AppColors.white,
              size: 16,
            ),
          ),
        ],
      ),
    );
  }
}

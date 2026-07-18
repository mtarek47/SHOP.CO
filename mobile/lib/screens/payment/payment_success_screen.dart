import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

/// PaymentSuccessScreen — mirrors PaymentSuccessPage.jsx
class PaymentSuccessScreen extends StatelessWidget {
  const PaymentSuccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Success Icon
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: AppColors.green.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  size: 80,
                  color: AppColors.green,
                ),
              ),

              const SizedBox(height: 32),

              Text(
                'Order Placed!',
                style: AppTextStyles.display.copyWith(fontSize: 32),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 16),

              Text(
                'Your order has been placed successfully. You will receive a confirmation email shortly.',
                style: AppTextStyles.bodyLg,
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 40),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      '/',
                      (route) => false,
                    );
                  },
                  child: const Text('Continue Shopping'),
                ),
              ),

              const SizedBox(height: 12),

              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => Navigator.pushNamed(context, '/cart'),
                  child: const Text('View Order History'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

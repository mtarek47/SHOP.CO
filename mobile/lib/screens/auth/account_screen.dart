import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../auth/auth_bottom_sheet.dart';

/// AccountScreen — Account management screen
class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Account')),
      body: Consumer<AuthProvider>(
        builder: (_, auth, __) {
          if (!auth.isLoggedIn) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.person_outline, size: 80, color: AppColors.gray200),
                  const SizedBox(height: 16),
                  Text('Sign in to your account', style: AppTextStyles.bodyLg),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () => AuthBottomSheet.show(context),
                    child: const Text('Sign In / Register'),
                  ),
                ],
              ),
            );
          }

          final user = auth.user!;
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Avatar
              Center(
                child: CircleAvatar(
                  radius: 40,
                  backgroundColor: AppColors.black,
                  child: Text(
                    user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U',
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(user.name, style: AppTextStyles.displaySm, textAlign: TextAlign.center),
              Text(user.email, style: AppTextStyles.bodyMd, textAlign: TextAlign.center),

              const SizedBox(height: 32),

              // Menu items
              _MenuItem(
                icon: Icons.shopping_bag_outlined,
                label: 'My Orders',
                onTap: () => Navigator.pushNamed(context, '/cart'),
              ),
              _MenuItem(
                icon: Icons.favorite_outline,
                label: 'Wishlist',
                onTap: () {},
              ),
              _MenuItem(
                icon: Icons.location_on_outlined,
                label: 'Saved Addresses',
                onTap: () {},
              ),
              _MenuItem(
                icon: Icons.settings_outlined,
                label: 'Settings',
                onTap: () {},
              ),

              const Divider(height: 32),

              // Logout
              ListTile(
                leading: const Icon(Icons.logout, color: AppColors.red),
                title: Text(
                  'Sign Out',
                  style: AppTextStyles.labelLg.copyWith(color: AppColors.red),
                ),
                onTap: () async {
                  await auth.logout();
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Signed out successfully')),
                    );
                  }
                },
              ),
            ],
          );
        },
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _MenuItem({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.black),
      title: Text(label, style: AppTextStyles.labelLg),
      trailing: const Icon(Icons.chevron_right, color: AppColors.gray400),
      onTap: onTap,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_colors.dart';
import 'core/theme/app_theme.dart';
import 'providers/cart_provider.dart';
import 'providers/auth_provider.dart';
import 'screens/home/home_screen.dart';
import 'screens/category/category_screen.dart';
import 'screens/product/product_detail_screen.dart';
import 'screens/cart/cart_screen.dart';
import 'screens/search/search_screen.dart';
import 'screens/auth/account_screen.dart';
import 'screens/payment/payment_success_screen.dart';

/// SHOP.CO App Root
/// Bottom Navigation with 4 tabs: Home, Search, Cart, Account
class ShopCoApp extends StatelessWidget {
  const ShopCoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: 'SHOP.CO',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        initialRoute: '/',
        onGenerateRoute: _generateRoute,
        home: const _MainShell(),
      ),
    );
  }

  static Route<dynamic> _generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const _MainShell());

      case '/category':
        final cat = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (ctx) => CategoryScreen(
            category: cat,
            onProductTap: (id) => Navigator.pushNamed(
              ctx,
              '/product',
              arguments: {'id': id, 'category': cat},
            ),
          ),
        );

      case '/product':
        final args = settings.arguments as Map<String, dynamic>? ?? {};
        final id = args['id'] as String? ?? '';
        final cat = args['category'] as String? ?? '';
        return MaterialPageRoute(
          builder: (ctx) => ProductDetailScreen(
            productId: id,
            onProductTap: (newId) => Navigator.pushReplacementNamed(
              ctx,
              '/product',
              arguments: {'id': newId, 'category': cat},
            ),
          ),
        );

      case '/cart':
        return MaterialPageRoute(builder: (_) => const CartScreen());

      case '/payment-success':
        return MaterialPageRoute(builder: (_) => const PaymentSuccessScreen());

      default:
        return MaterialPageRoute(builder: (_) => const _MainShell());
    }
  }
}

// ─── Main Shell (Bottom Navigation) ───────────────────────────────────────────

class _MainShell extends StatefulWidget {
  const _MainShell();

  @override
  State<_MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<_MainShell> {
  int _currentIndex = 0;

  void _onCategoryTap(String cat) {
    Navigator.pushNamed(context, '/category', arguments: cat);
  }

  void _onProductTap(String id, String cat) {
    Navigator.pushNamed(
      context,
      '/product',
      arguments: {'id': id, 'category': cat},
    );
  }

  late final List<Widget> tabs = [
    HomeScreen(
      onCategoryTap: _onCategoryTap,
      onProductTap: _onProductTap,
    ),
    SearchScreen(onProductTap: (id) => _onProductTap(id, 'search')),
    const CartScreen(),
    const AccountScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: tabs,
      ),
      bottomNavigationBar: Consumer<CartProvider>(
        builder: (_, cart, __) => BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home_rounded),
              label: 'Home',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.search),
              activeIcon: Icon(Icons.search),
              label: 'Search',
            ),
            BottomNavigationBarItem(
              icon: Stack(
                clipBehavior: Clip.none,
                children: [
                  const Icon(Icons.shopping_bag_outlined),
                  if (cart.itemCount > 0)
                    Positioned(
                      right: -6,
                      top: -6,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(
                          color: AppColors.black,
                          shape: BoxShape.circle,
                        ),
                        constraints:
                            const BoxConstraints(minWidth: 16, minHeight: 16),
                        child: Text(
                          '${cart.itemCount}',
                          style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
              activeIcon: const Icon(Icons.shopping_bag_rounded),
              label: 'Cart',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person_rounded),
              label: 'Account',
            ),
          ],
        ),
      ),
    );
  }
}

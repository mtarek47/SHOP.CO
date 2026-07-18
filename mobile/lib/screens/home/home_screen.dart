import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/product_service.dart';
import '../../models/product_model.dart';
import '../../providers/cart_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../widgets/announcement_bar.dart';
import '../../widgets/brands_row.dart';
import '../../widgets/dress_style_grid.dart';
import '../../widgets/product_card.dart';
import '../../widgets/section_header.dart';
import '../../widgets/testimonial_card.dart';
import '../auth/auth_bottom_sheet.dart';

/// HomeScreen — mirrors App.jsx homepage with Hero, Brands, Products, etc.
class HomeScreen extends StatefulWidget {
  final Function(String category) onCategoryTap;
  final Function(String id, String category) onProductTap;

  const HomeScreen({
    super.key,
    required this.onCategoryTap,
    required this.onProductTap,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _productService = ProductService();
  List<ProductModel> _newArrivals = [];
  List<ProductModel> _topSelling = [];
  Map<String, dynamic>? _heroConfig;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final results = await Future.wait([
      _productService.fetchProducts(category: 'new-arrivals'),
      _productService.fetchProducts(sort: 'top-selling'),
      _productService.fetchHeroConfig(),
    ]);

    if (!mounted) return;
    setState(() {
      _newArrivals = (results[0] as List<ProductModel>).take(4).toList();
      _topSelling = (results[1] as List<ProductModel>).take(4).toList();
      _heroConfig = results[2] as Map<String, dynamic>?;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RefreshIndicator(
        color: AppColors.black,
        onRefresh: _loadData,
        child: CustomScrollView(
          slivers: [
            // Announcement Bar
            const SliverToBoxAdapter(child: AnnouncementBar()),

            // App Bar
            SliverAppBar(
              floating: true,
              snap: true,
              backgroundColor: AppColors.white,
              elevation: 0,
              title: const Text(
                'SHOP.CO',
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 22,
                  letterSpacing: 0,
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {},
                ),
                Consumer<CartProvider>(
                  builder: (_, cart, __) => Stack(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.shopping_bag_outlined),
                        onPressed: () => Navigator.pushNamed(context, '/cart'),
                      ),
                      if (cart.itemCount > 0)
                        Positioned(
                          right: 6,
                          top: 6,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: AppColors.black,
                              shape: BoxShape.circle,
                            ),
                            constraints: const BoxConstraints(
                                minWidth: 16, minHeight: 16),
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
                ),
                IconButton(
                  icon: const Icon(Icons.person_outline),
                  onPressed: () => AuthBottomSheet.show(context),
                ),
              ],
            ),

            // Hero Section — mirrors Hero.jsx
            SliverToBoxAdapter(child: _HeroSection(heroConfig: _heroConfig, onShopNow: () => widget.onCategoryTap('casual'))),

            // Brands Row
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(top: 32),
                child: BrandsRow(
                  onBrandTap: (brand) => widget.onCategoryTap('brand-$brand'),
                ),
              ),
            ),

            // New Arrivals Section
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(top: 40),
                child: SectionHeader(
                  title: 'NEW ARRIVALS',
                  onViewAll: () => widget.onCategoryTap('new-arrivals'),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: _loading
                  ? const _ProductGridSkeleton()
                  : _ProductGrid(
                      products: _newArrivals,
                      onProductTap: (id) => widget.onProductTap(id, 'new-arrivals'),
                    ),
            ),

            // Divider
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                child: Divider(color: AppColors.gray100),
              ),
            ),

            // Top Selling Section
            SliverToBoxAdapter(
              child: SectionHeader(
                title: 'TOP SELLING',
                onViewAll: () => widget.onCategoryTap('top-selling'),
              ),
            ),
            SliverToBoxAdapter(
              child: _loading
                  ? const _ProductGridSkeleton()
                  : _ProductGrid(
                      products: _topSelling,
                      onProductTap: (id) => widget.onProductTap(id, 'top-selling'),
                    ),
            ),

            // Browse by Dress Style
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(0, 40, 0, 0),
                child: DressStyleGrid(onCategoryTap: widget.onCategoryTap),
              ),
            ),

            // Testimonials
            SliverToBoxAdapter(
              child: _TestimonialsSection(),
            ),

            // Newsletter
            const SliverToBoxAdapter(child: _NewsletterSection()),

            const SliverToBoxAdapter(child: SizedBox(height: 40)),
          ],
        ),
      ),
    );
  }
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

class _HeroSection extends StatelessWidget {
  final Map<String, dynamic>? heroConfig;
  final VoidCallback? onShopNow;

  const _HeroSection({this.heroConfig, this.onShopNow});

  @override
  Widget build(BuildContext context) {
    final title = heroConfig?['title'] ?? 'FIND CLOTHES\nTHAT MATCHES\nYOUR STYLE';
    final description = heroConfig?['description'] ??
        'Browse through our diverse range of meticulously crafted garments.';
    final stats = (heroConfig?['stats'] as List<dynamic>?) ??
        [
          {'num': '200+', 'label': 'International Brands'},
          {'num': '2,000+', 'label': 'High-Quality Products'},
          {'num': '30,000+', 'label': 'Happy Customers'},
        ];

    return Container(
      color: AppColors.offWhite,
      padding: const EdgeInsets.fromLTRB(16, 32, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            title,
            style: AppTextStyles.display.copyWith(fontSize: 36),
          ),

          const SizedBox(height: 16),

          // Description
          Text(description, style: AppTextStyles.bodyLg),

          const SizedBox(height: 24),

          // Shop Now Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onShopNow,
              child: const Text('Shop Now'),
            ),
          ),

          const SizedBox(height: 24),

          // Stats Row — mirrors .hero-stats
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: stats.asMap().entries.map((entry) {
                final stat = entry.value;
                final isLast = entry.key == stats.length - 1;
                return Expanded(
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          children: [
                            Text(
                              stat['num']?.toString() ?? '',
                              style: AppTextStyles.displaySm,
                            ),
                            Text(
                              stat['label']?.toString() ?? '',
                              style: AppTextStyles.bodySm,
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                      if (!isLast)
                        Container(
                          width: 1,
                          height: 40,
                          color: AppColors.gray200,
                        ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

// ─── Product Grid ──────────────────────────────────────────────────────────────

class _ProductGrid extends StatelessWidget {
  final List<ProductModel> products;
  final Function(String id) onProductTap;

  const _ProductGrid({required this.products, required this.onProductTap});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
        crossAxisSpacing: 12,
        mainAxisSpacing: 16,
      ),
      itemCount: products.length,
      itemBuilder: (_, index) => ProductCard(
        product: products[index],
        onTap: () => onProductTap(products[index].id),
      ),
    );
  }
}

class _ProductGridSkeleton extends StatelessWidget {
  const _ProductGridSkeleton();

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
        crossAxisSpacing: 12,
        mainAxisSpacing: 16,
      ),
      itemCount: 4,
      itemBuilder: (_, __) => Container(
        decoration: BoxDecoration(
          color: AppColors.lightGray,
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

class _TestimonialsSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 40),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'OUR HAPPY CUSTOMERS',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.3,
            ),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 200,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: sampleTestimonials.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (_, index) {
              final t = sampleTestimonials[index];
              return TestimonialCard(
                name: t['name']!,
                rating: t['rating']!,
                review: t['review']!,
                verified: t['verified']!,
              );
            },
          ),
        ),
      ],
    );
  }
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

class _NewsletterSection extends StatelessWidget {
  const _NewsletterSection();

  @override
  Widget build(BuildContext context) {
    final _emailCtrl = TextEditingController();

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 40, 16, 0),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.black,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Text(
            'STAY UP TO DATE ABOUT OUR LATEST OFFERS',
            style: AppTextStyles.displaySm.copyWith(
              color: AppColors.white,
              fontSize: 18,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _emailCtrl,
            keyboardType: TextInputType.emailAddress,
            style: const TextStyle(color: AppColors.black),
            decoration: InputDecoration(
              hintText: 'Enter your email address',
              fillColor: AppColors.white,
              filled: true,
              prefixIcon: const Icon(Icons.email_outlined, color: AppColors.gray400),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(100),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.white,
                foregroundColor: AppColors.black,
                shape: const StadiumBorder(),
              ),
              onPressed: () {},
              child: const Text('Subscribe to Newsletter'),
            ),
          ),
        ],
      ),
    );
  }
}

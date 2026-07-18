import 'package:flutter/material.dart';
import '../../services/product_service.dart';
import '../../models/product_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../widgets/product_card.dart';
import '../../widgets/filter_bottom_sheet.dart';

/// CategoryScreen — mirrors CategoryPage.jsx + FilterSidebar.jsx
class CategoryScreen extends StatefulWidget {
  final String? category;
  final Function(String id) onProductTap;

  const CategoryScreen({
    super.key,
    this.category,
    required this.onProductTap,
  });

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  final _productService = ProductService();

  List<ProductModel> _products = [];
  bool _loading = true;

  // Filters — mirrors FilterSidebar.jsx state
  List<String> _selectedSizes = [];
  List<String> _selectedColors = [];
  RangeValues _priceRange = const RangeValues(0, 10000);
  String? _sortBy;

  static const List<String> _categories = [
    'casual', 'formal', 'party', 'gym',
    'new-arrivals', 'top-selling', 'on-sale',
  ];

  String? get _activeCategory => widget.category;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  @override
  void didUpdateWidget(CategoryScreen old) {
    super.didUpdateWidget(old);
    if (old.category != widget.category) _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _loading = true);

    final products = await _productService.fetchProducts(
      category: _activeCategory,
      sizes: _selectedSizes.isNotEmpty ? _selectedSizes : null,
      colors: _selectedColors.isNotEmpty ? _selectedColors : null,
      minPrice: _priceRange.start > 0 ? _priceRange.start : null,
      maxPrice: _priceRange.end < 10000 ? _priceRange.end : null,
      sort: _sortBy,
    );

    if (!mounted) return;
    setState(() {
      _products = products;
      _loading = false;
    });
  }

  String get _pageTitle {
    if (_activeCategory == null) return 'All Products';
    return _activeCategory!
        .split('-')
        .map((w) => w[0].toUpperCase() + w.substring(1))
        .join(' ');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_pageTitle),
        actions: [
          // Filter button
          Stack(
            alignment: Alignment.topRight,
            children: [
              IconButton(
                icon: const Icon(Icons.tune),
                onPressed: () => FilterBottomSheet.show(
                  context,
                  selectedSizes: _selectedSizes,
                  selectedColors: _selectedColors,
                  priceRange: _priceRange,
                  sortBy: _sortBy,
                  onApply: (sizes, colors, range, sort) {
                    setState(() {
                      _selectedSizes = sizes;
                      _selectedColors = colors;
                      _priceRange = range;
                      _sortBy = sort;
                    });
                    _loadProducts();
                  },
                ),
              ),
              if (_selectedSizes.isNotEmpty ||
                  _selectedColors.isNotEmpty ||
                  _sortBy != null)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: AppColors.red,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Category chips — mirrors breadcrumb & category tabs in web
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, index) {
                final cat = _categories[index];
                final isActive = _activeCategory == cat;
                return ChoiceChip(
                  label: Text(
                    cat.split('-').map((w) => w[0].toUpperCase() + w.substring(1)).join(' '),
                  ),
                  selected: isActive,
                  onSelected: (_) {
                    Navigator.pushReplacementNamed(
                      context,
                      '/category',
                      arguments: cat,
                    );
                  },
                  selectedColor: AppColors.black,
                  backgroundColor: AppColors.lightGray,
                  labelStyle: TextStyle(
                    color: isActive ? AppColors.white : AppColors.black,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                );
              },
            ),
          ),

          // Results count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Text(
                  '${_products.length} Products',
                  style: AppTextStyles.bodyMd.copyWith(color: AppColors.gray500),
                ),
              ],
            ),
          ),

          // Product Grid
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: AppColors.black))
                : _products.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.search_off, size: 64, color: AppColors.gray200),
                            const SizedBox(height: 16),
                            Text('No products found', style: AppTextStyles.bodyLg),
                          ],
                        ),
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.68,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 16,
                        ),
                        itemCount: _products.length,
                        itemBuilder: (_, index) => ProductCard(
                          product: _products[index],
                          onTap: () => widget.onProductTap(_products[index].id),
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

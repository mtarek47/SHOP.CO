import 'package:flutter/material.dart';
import '../../services/product_service.dart';
import '../../models/product_model.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../../widgets/product_card.dart';

/// SearchScreen — mirrors SearchModal.jsx
/// Instant product search
class SearchScreen extends StatefulWidget {
  final Function(String id) onProductTap;

  const SearchScreen({super.key, required this.onProductTap});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _productService = ProductService();
  final _searchCtrl = TextEditingController();

  List<ProductModel> _results = [];
  bool _loading = false;
  bool _searched = false;

  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _results = [];
        _searched = false;
      });
      return;
    }

    setState(() {
      _loading = true;
      _searched = true;
    });

    final results = await _productService.fetchProducts(search: query.trim());

    if (!mounted) return;
    setState(() {
      _results = results;
      _loading = false;
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchCtrl,
          autofocus: true,
          onChanged: _search,
          decoration: InputDecoration(
            hintText: 'Search for products...',
            filled: true,
            fillColor: AppColors.lightGray,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(100),
              borderSide: BorderSide.none,
            ),
            suffixIcon: _searchCtrl.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear, size: 18),
                    onPressed: () {
                      _searchCtrl.clear();
                      _search('');
                    },
                  )
                : null,
          ),
        ),
        automaticallyImplyLeading: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.black))
          : !_searched
              ? _buildSearchHints()
              : _results.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.search_off, size: 64, color: AppColors.gray200),
                          const SizedBox(height: 16),
                          Text(
                            'No results for "${_searchCtrl.text}"',
                            style: AppTextStyles.bodyLg,
                          ),
                        ],
                      ),
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                          child: Text(
                            '${_results.length} results for "${_searchCtrl.text}"',
                            style: AppTextStyles.bodyMd.copyWith(color: AppColors.gray500),
                          ),
                        ),
                        Expanded(
                          child: GridView.builder(
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 0.68,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 16,
                            ),
                            itemCount: _results.length,
                            itemBuilder: (_, index) => ProductCard(
                              product: _results[index],
                              onTap: () => widget.onProductTap(_results[index].id),
                            ),
                          ),
                        ),
                      ],
                    ),
    );
  }

  Widget _buildSearchHints() {
    final suggestions = [
      'T-Shirt', 'Jeans', 'Casual', 'Formal', 'Dress', 'Jacket'
    ];
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Popular Searches', style: AppTextStyles.labelLg),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: suggestions
                .map((s) => GestureDetector(
                      onTap: () {
                        _searchCtrl.text = s;
                        _search(s);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.lightGray,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Text(s, style: AppTextStyles.labelMd),
                      ),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}

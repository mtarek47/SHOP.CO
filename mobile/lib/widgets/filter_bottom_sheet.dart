import 'package:flutter/material.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_text_styles.dart';

/// FilterBottomSheet — mirrors FilterSidebar.jsx
/// Mobile-friendly bottom sheet for filtering products
class FilterBottomSheet extends StatefulWidget {
  final List<String> selectedSizes;
  final List<String> selectedColors;
  final RangeValues priceRange;
  final String? sortBy;
  final Function(
    List<String> sizes,
    List<String> colors,
    RangeValues priceRange,
    String? sortBy,
  ) onApply;

  const FilterBottomSheet({
    super.key,
    required this.selectedSizes,
    required this.selectedColors,
    required this.priceRange,
    this.sortBy,
    required this.onApply,
  });

  static Future<void> show(
    BuildContext context, {
    required List<String> selectedSizes,
    required List<String> selectedColors,
    required RangeValues priceRange,
    String? sortBy,
    required Function(List<String>, List<String>, RangeValues, String?) onApply,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => FilterBottomSheet(
        selectedSizes: selectedSizes,
        selectedColors: selectedColors,
        priceRange: priceRange,
        sortBy: sortBy,
        onApply: onApply,
      ),
    );
  }

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late List<String> _sizes;
  late List<String> _colors;
  late RangeValues _priceRange;
  String? _sortBy;

  static const List<String> availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  static const List<Map<String, dynamic>> availableColors = [
    {'name': 'Black', 'hex': '#000000'},
    {'name': 'White', 'hex': '#FFFFFF'},
    {'name': 'Red', 'hex': '#FF0000'},
    {'name': 'Blue', 'hex': '#0000FF'},
    {'name': 'Green', 'hex': '#008000'},
    {'name': 'Yellow', 'hex': '#FFC633'},
    {'name': 'Pink', 'hex': '#FFC0CB'},
    {'name': 'Brown', 'hex': '#8B4513'},
  ];
  static const List<Map<String, String>> sortOptions = [
    {'key': 'newest', 'label': 'Newest'},
    {'key': 'price-asc', 'label': 'Price: Low to High'},
    {'key': 'price-desc', 'label': 'Price: High to Low'},
    {'key': 'rating', 'label': 'Top Rated'},
  ];

  @override
  void initState() {
    super.initState();
    _sizes = List.from(widget.selectedSizes);
    _colors = List.from(widget.selectedColors);
    _priceRange = widget.priceRange;
    _sortBy = widget.sortBy;
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      maxChildSize: 0.95,
      minChildSize: 0.5,
      builder: (_, controller) => Container(
        decoration: const BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Handle
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.gray200,
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Filters', style: AppTextStyles.displaySm),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),

            const Divider(height: 1),

            Expanded(
              child: ListView(
                controller: controller,
                padding: const EdgeInsets.all(20),
                children: [
                  // Sort By
                  Text('Sort By', style: AppTextStyles.labelLg),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: sortOptions
                        .map((opt) => ChoiceChip(
                              label: Text(opt['label']!),
                              selected: _sortBy == opt['key'],
                              onSelected: (selected) => setState(
                                  () => _sortBy = selected ? opt['key'] : null),
                              selectedColor: AppColors.black,
                              labelStyle: TextStyle(
                                color: _sortBy == opt['key']
                                    ? AppColors.white
                                    : AppColors.black,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ))
                        .toList(),
                  ),

                  const SizedBox(height: 24),

                  // Price Range
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Price Range', style: AppTextStyles.labelLg),
                      Text(
                        'BDT ${_priceRange.start.toInt()} – ${_priceRange.end.toInt()}',
                        style: AppTextStyles.bodyMd,
                      ),
                    ],
                  ),
                  RangeSlider(
                    values: _priceRange,
                    min: 0,
                    max: 10000,
                    divisions: 100,
                    activeColor: AppColors.black,
                    inactiveColor: AppColors.gray200,
                    onChanged: (val) => setState(() => _priceRange = val),
                  ),

                  const SizedBox(height: 24),

                  // Sizes
                  Text('Size', style: AppTextStyles.labelLg),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: availableSizes
                        .map((size) => FilterChip(
                              label: Text(size),
                              selected: _sizes.contains(size),
                              onSelected: (selected) => setState(() {
                                selected ? _sizes.add(size) : _sizes.remove(size);
                              }),
                              selectedColor: AppColors.black,
                              labelStyle: TextStyle(
                                color: _sizes.contains(size)
                                    ? AppColors.white
                                    : AppColors.black,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ))
                        .toList(),
                  ),

                  const SizedBox(height: 24),

                  // Colors
                  Text('Color', style: AppTextStyles.labelLg),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: availableColors
                        .map((c) => GestureDetector(
                              onTap: () => setState(() {
                                _colors.contains(c['name'])
                                    ? _colors.remove(c['name'])
                                    : _colors.add(c['name'] as String);
                              }),
                              child: Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: _hexToColor(c['hex'] as String),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: _colors.contains(c['name'])
                                        ? AppColors.black
                                        : AppColors.gray200,
                                    width: _colors.contains(c['name']) ? 2.5 : 1,
                                  ),
                                ),
                                child: _colors.contains(c['name'])
                                    ? Icon(
                                        Icons.check,
                                        size: 16,
                                        color: c['name'] == 'White'
                                            ? AppColors.black
                                            : AppColors.white,
                                      )
                                    : null,
                              ),
                            ))
                        .toList(),
                  ),
                ],
              ),
            ),

            // Apply Button
            Padding(
              padding: EdgeInsets.fromLTRB(
                  20, 12, 20, MediaQuery.of(context).padding.bottom + 12),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    widget.onApply(_sizes, _colors, _priceRange, _sortBy);
                    Navigator.pop(context);
                  },
                  child: const Text('Apply Filters'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _hexToColor(String hex) {
    try {
      return Color(int.parse('FF${hex.replaceAll('#', '')}', radix: 16));
    } catch (_) {
      return AppColors.gray200;
    }
  }
}

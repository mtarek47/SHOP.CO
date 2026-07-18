import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shopco_mobile/app.dart';

void main() {
  testWidgets('App launches successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const ShopCoApp());
    expect(find.text('SHOP.CO'), findsWidgets);
  });
}

import mongoose from 'mongoose';
import Product from '../models/Product.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sizes, colors, sort, isOnSale, isNewArrival, brand } = req.query;

    const queryObj = {};

    // 1. Category Filter
    if (category && category !== 'all' && category !== 'on-sale' && category !== 'new-arrivals' && !category.startsWith('brand-')) {
      queryObj.category = category.toLowerCase();
    }
    
    // Custom Tag Filters
    if (isOnSale === 'true') queryObj.isOnSale = true;
    if (isNewArrival === 'true') queryObj.isNewArrival = true;
    if (brand) queryObj.brand = { $regex: new RegExp(`^${brand}$`, 'i') }; // case-insensitive exact match

    // 2. Search Text Filter
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // 3. Price Range Filter
    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // 4. Sizes Filter (comma-separated, e.g. "Small,Medium")
    if (sizes) {
      const sizesArray = sizes.split(',');
      queryObj.sizes = { $in: sizesArray };
    }

    // 5. Colors Filter (comma-separated, e.g. "#000000,#FFFFFF")
    if (colors) {
      const colorsArray = colors.split(',');
      queryObj.colors = { $in: colorsArray };
    }

    let query = Product.find(queryObj);

    // 6. Sorting
    if (sort) {
      if (sort === 'price-asc') {
        query = query.sort({ price: 1 });
      } else if (sort === 'price-desc') {
        query = query.sort({ price: -1 });
      } else if (sort === 'rating') {
        query = query.sort({ rating: -1 });
      } else if (sort === 'newest') {
        query = query.sort({ createdAt: -1 });
      }
    } else {
      query = query.sort({ createdAt: -1 }); // Default to newest
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID (either MongoDB ObjectId or custom seeded string ID)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support querying both custom ID and Mongoose ObjectId
    const product = await Product.findOne({
      $or: [
        { _id: id },
        ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
      ]
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

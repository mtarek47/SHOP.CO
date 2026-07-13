import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
    },
    originalPrice: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    bgColor: {
      type: String,
      default: '#f2f0f1',
    },
    image: {
      type: String,
      required: [true, 'Please add a main product image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['casual', 'formal', 'party', 'gym'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    images: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

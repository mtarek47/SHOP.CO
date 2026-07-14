import Product from '../models/Product.js';
import Order from '../models/Order.js';

// ── PRODUCT CRUD ENDPOINTS ──

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, discount, bgColor, image, backViewImage, modelViewImage, category, brand, isOnSale, isNewArrival, description, images, colors, sizes } = req.body;

    const product = new Product({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discount: discount ? Number(discount) : 0,
      bgColor: bgColor || '#f2f0f1',
      image: image || 'https://placehold.co/400x480?text=New+Product',
      backViewImage,
      modelViewImage,
      category,
      brand: brand || '',
      isOnSale: isOnSale === true || isOnSale === 'true',
      isNewArrival: isNewArrival === true || isNewArrival === 'true',
      description,
      images: images || [],
      colors: colors || [],
      sizes: sizes || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, discount, bgColor, image, backViewImage, modelViewImage, category, brand, isOnSale, isNewArrival, description, images, colors, sizes } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
      product.discount = discount !== undefined ? Number(discount) : product.discount;
      product.bgColor = bgColor || product.bgColor;
      product.image = image || product.image;
      product.backViewImage = backViewImage !== undefined ? backViewImage : product.backViewImage;
      product.modelViewImage = modelViewImage !== undefined ? modelViewImage : product.modelViewImage;
      product.category = category || product.category;
      if (brand !== undefined) product.brand = brand;
      if (isOnSale !== undefined) product.isOnSale = isOnSale === true || isOnSale === 'true';
      if (isNewArrival !== undefined) product.isNewArrival = isNewArrival === true || isNewArrival === 'true';
      product.description = description || product.description;
      product.images = images || product.images;
      product.colors = colors || product.colors;
      product.sizes = sizes || product.sizes;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── ORDER MANAGEMENT ENDPOINTS ──

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order delivery status
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
export const updateOrderDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'pending', 'shipped', or 'delivered'
    if (!['pending', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid delivery status value' });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.deliveryStatus = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order payment status manually
// @route   PUT /api/admin/orders/:id/pay
// @access  Private/Admin
export const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'pending', 'paid', or 'failed'
    if (!['pending', 'paid', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status value' });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.paymentStatus = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Cancel an order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

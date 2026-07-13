import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderDeliveryStatus,
  updateOrderPaymentStatus,
  deleteOrder,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & admin middleware to all routes below
router.use(protect);
router.use(admin);

// Product CRUD routes
router.post('/admin/products', createProduct);
router.put('/admin/products/:id', updateProduct);
router.delete('/admin/products/:id', deleteProduct);

// Order management routes
router.get('/admin/orders', getOrders);
router.put('/admin/orders/:id/deliver', updateOrderDeliveryStatus);
router.put('/admin/orders/:id/pay', updateOrderPaymentStatus);
router.delete('/admin/orders/:id', deleteOrder);

export default router;

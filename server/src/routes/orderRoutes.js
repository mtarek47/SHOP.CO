import express from 'express';
import { getMyOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/orders/myorders', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);

export default router;

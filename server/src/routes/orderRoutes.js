import express from 'express';
import { getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/orders/myorders', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);
router.put('/orders/:id/cancel', protect, cancelOrder);

export default router;

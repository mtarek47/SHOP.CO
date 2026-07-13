import express from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/logout', protect, logoutUser);

// User routes (matching frontend AuthContext calls)
router.get('/users/me', protect, getMe);

export default router;

import express from 'express';
import { getHeroConfig, updateHeroConfig } from '../controllers/configController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config/hero', getHeroConfig);
router.put('/config/hero', protect, admin, updateHeroConfig);

export default router;

import express from 'express';
import { getHeroConfig, updateHeroConfig, getDressStyleConfig, updateDressStyleConfig } from '../controllers/configController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config/hero', getHeroConfig);
router.put('/config/hero', protect, admin, updateHeroConfig);

router.get('/config/dress-style', getDressStyleConfig);
router.put('/config/dress-style', protect, admin, updateDressStyleConfig);

export default router;

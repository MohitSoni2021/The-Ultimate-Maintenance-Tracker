import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(protect);

// Admin only routes
router.get('/stats', requireRole('ADMIN'), getDashboardStats);

export default router;

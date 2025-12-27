import { Router } from 'express';
import { createRequest, getMyRequests, getRequestById, getTeamRequests, updateRequest, getStats } from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(protect);

router.post('/', createRequest);
router.get('/my', getMyRequests);
router.get('/stats', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), getStats);
router.get('/team/requests', requireRole('ADMIN', 'MANAGER', 'TECHNICIAN'), getTeamRequests);
router.get('/:id', getRequestById);
router.patch('/:id', updateRequest);

export default router;

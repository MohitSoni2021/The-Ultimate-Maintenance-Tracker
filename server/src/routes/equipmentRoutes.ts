import { Router } from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipmentController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(protect);

router.get('/', getAllEquipment);
router.post('/', requireRole('ADMIN', 'MANAGER'), createEquipment);
router.get('/:id', getEquipmentById);
router.put('/:id', requireRole('ADMIN', 'MANAGER'), updateEquipment);
router.delete('/:id', requireRole('ADMIN', 'MANAGER'), deleteEquipment);

export default router;

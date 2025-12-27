import { Router } from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(protect);

router.get('/', getDepartments);
router.post('/', requireRole('ADMIN'), createDepartment);
router.get('/:id', getDepartmentById);
router.patch('/:id', requireRole('ADMIN'), updateDepartment);
router.delete('/:id', requireRole('ADMIN'), deleteDepartment);

export default router;

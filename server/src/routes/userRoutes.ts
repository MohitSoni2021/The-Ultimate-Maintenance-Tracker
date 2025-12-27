import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.post('/', requireRole('ADMIN'), createUser);
router.get('/', requireRole('ADMIN', 'MANAGER'), getUsers);
router.get('/:id', getUserById);
router.put('/:id', requireRole('ADMIN'), updateUser);
router.delete('/:id', requireRole('ADMIN'), deleteUser);

export default router;

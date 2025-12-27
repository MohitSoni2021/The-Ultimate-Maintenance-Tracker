import express from 'express';
import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.get('/', getTeams);
router.post('/', requireRole('ADMIN'), createTeam);
router.get('/:id', getTeamById);
router.patch('/:id', requireRole('ADMIN'), updateTeam);
router.delete('/:id', requireRole('ADMIN'), deleteTeam);

export default router;

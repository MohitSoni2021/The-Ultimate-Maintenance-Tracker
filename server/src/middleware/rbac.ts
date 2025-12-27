import type { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;

    if (!userRole) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    next();
  };
};

export const requireTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { requestId } = req.params;

    if (!requestId) {
      res.status(400).json({ error: 'Request ID is required' });
      return;
    }

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id: requestId },
      include: { team: true },
    });

    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.teamId !== request.teamId) {
      res.status(403).json({ error: 'You do not have access to this request' });
      return;
    }

    (req as any).request = request;
    next();
  } catch (error) {
    console.error('Team member check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const requireSameTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { userId: targetUserId } = req.params;

    if (!targetUserId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      res.status(404).json({ error: 'Target user not found' });
      return;
    }

    if (user?.teamId !== targetUser.teamId) {
      res.status(403).json({ error: 'You do not have access to this user' });
      return;
    }

    (req as any).targetUser = targetUser;
    next();
  } catch (error) {
    console.error('Team same check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

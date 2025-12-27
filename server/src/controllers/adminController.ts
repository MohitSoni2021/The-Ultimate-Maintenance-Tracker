import type { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get total counts
    const [totalUsers, totalTeams, totalEquipment, totalRequests] = await Promise.all([
      prisma.user.count(),
      prisma.maintenanceTeam.count(),
      prisma.equipment.count(),
      prisma.maintenanceRequest.count(),
    ]);

    // Get request stats by stage
    const requestsByStage = await prisma.maintenanceRequest.groupBy({
      by: ['stage'],
      _count: {
        id: true,
      },
    });

    // Get active equipment count
    const activeEquipment = await prisma.equipment.count({
      where: { isActive: true },
    });

    // Get pending requests (unassigned or in progress)
    const pendingRequests = await prisma.maintenanceRequest.count({
      where: {
        stage: {
          in: ['OPEN', 'IN_PROGRESS'],
        },
      },
    });

    res.json({
      totalUsers,
      totalTeams,
      totalEquipment,
      totalRequests,
      activeEquipment,
      pendingRequests,
      requestsByStage: requestsByStage.map((item) => ({
        stage: item.stage,
        count: item._count.id,
      })),
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

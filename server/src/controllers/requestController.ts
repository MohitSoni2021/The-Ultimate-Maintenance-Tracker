import type { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { title, description, type, equipmentId, scheduledDate, priority } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        type,
        equipmentId,
        teamId: equipment.teamId,
        createdById: userId,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        priority: priority || 'MEDIUM',
      },
      include: {
        equipment: true,
        team: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(request);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        createdById: userId,
      },
      include: {
        equipment: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id) {
      return res.status(400).json({ error: 'Invalid request ID' });
    }

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        equipment: true,
        team: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (req.user?.role === 'GENERAL' && request.createdById !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(request);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeamRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { teamId: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const whereClause: any = {};
    
    if (user.role === 'ADMIN') {
      // ADMIN users can see all requests
    } else if (user.teamId) {
      // Non-admin users can only see their team's requests
      whereClause.teamId = user.teamId;
    } else if (user.role === 'MANAGER' || user.role === 'TECHNICIAN') {
      // If manager or technician has no team, return empty list instead of 403
      return res.json([]);
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    const requests = await prisma.maintenanceRequest.findMany({
      where: whereClause,
      include: {
        equipment: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        team: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stage, assignedToId, description, duration, scheduledDate, priority } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Invalid request ID' });
    }

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        equipment: {
          select: { category: true },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { teamId: true, role: true },
    });

    // Check authorization: ADMIN can access all, MANAGER/TECHNICIAN can only access their team's requests
    if (user?.role !== 'ADMIN') {
      if (!user?.teamId || user.teamId !== request.teamId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const updateData: any = {};
    if (stage) updateData.stage = stage;
    if (assignedToId !== undefined) {
      // Validate that the assigned user exists and is in the same team and department
      if (assignedToId) {
        const assignedUser = await prisma.user.findUnique({
          where: { id: assignedToId },
          include: {
            department: {
              select: { name: true },
            },
          },
        });

        if (!assignedUser) {
          return res.status(404).json({ error: 'Assigned user not found' });
        }

        // Ensure the assigned user is in the same team as the request
        if (assignedUser.teamId !== request.teamId) {
          return res.status(400).json({ error: 'User is not part of this team' });
        }

        // Ensure the assigned user is in the same department as the equipment category
        if (assignedUser.department?.name !== request.equipment?.category) {
          return res.status(400).json({ error: 'User department does not match equipment category' });
        }
      }
      updateData.assignedToId = assignedToId;
    }
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    if (priority) updateData.priority = priority;
    
    if (stage === 'REPAIRED' || stage === 'SCRAP' || stage === 'COMPLETED') {
      updateData.completedDate = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: updateData,
      include: {
        equipment: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        team: true,
      },
    });

    if (stage === 'SCRAP' && updatedRequest.equipment) {
      await prisma.equipment.update({
        where: { id: updatedRequest.equipment.id },
        data: { isActive: false },
      });
    }

    res.json(updatedRequest);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Only ADMIN and MANAGER can view all requests
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const requests = await prisma.maintenanceRequest.findMany({
      include: {
        equipment: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        team: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { teamId: true, role: true },
    });

    if (!user) return res.status(401).json({ error: 'User not found' });

    const whereClause: any = {};
    if (user.role === 'ADMIN') {
      // ADMIN can see all requests, no filter needed
    } else if (user.teamId) {
      whereClause.teamId = user.teamId;
    } else if (user.role === 'MANAGER' || user.role === 'TECHNICIAN') {
      // If manager or technician has no team, return empty stats instead of 403
      return res.json({
        byTeam: [],
        byCategory: [],
        byStage: [],
        total: 0,
      });
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    const requests = await prisma.maintenanceRequest.findMany({
      where: whereClause,
      include: {
        equipment: true,
        team: true,
      },
    });

    const byTeam: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byStage: Record<string, number> = {};

    requests.forEach(req => {
      const teamName = req.team.name;
      const category = req.equipment.category;
      const stage = req.stage;

      byTeam[teamName] = (byTeam[teamName] || 0) + 1;
      byCategory[category] = (byCategory[category] || 0) + 1;
      byStage[stage] = (byStage[stage] || 0) + 1;
    });

    res.json({
      byTeam: Object.entries(byTeam).map(([name, count]) => ({ name, count })),
      byCategory: Object.entries(byCategory).map(([name, count]) => ({ name, count })),
      byStage: Object.entries(byStage).map(([name, count]) => ({ name, count })),
      total: requests.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

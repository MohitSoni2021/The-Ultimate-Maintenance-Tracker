import type { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const { search, department, category } = req.query;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    const whereClause: Record<string, any> = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { serialNo: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (department) {
      whereClause.department = department as string;
    }
    if (category) {
      whereClause.category = category as string;
    }

    if ((userRole === 'TECHNICIAN' || userRole === 'MANAGER') && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { teamId: true, role: true },
      });
      
      if (user?.teamId && user.role === 'TECHNICIAN') {
        whereClause.teamId = user.teamId;
      }
      // MANAGER can see all for reports as implied, but let's see. 
      // Actually the requirements say "View Equipment details".
      // Let's allow MANAGER to see all equipment for now.
    }

    const equipment = await prisma.equipment.findMany({
      where: whereClause,
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(equipment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    
    if (!id) {
      return res.status(400).json({ error: 'Invalid equipment ID' });
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    if (userRole === 'TECHNICIAN' && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { teamId: true },
      });
      
      if (user?.teamId !== equipment.teamId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(equipment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, serialNo, location, department, category, teamId } = req.body;

    if (!name || !serialNo || !location || !department || !category || !teamId) {
      res.status(400).json({ error: 'All fields are required: name, serialNo, location, department, category, teamId' });
      return;
    }

    const existingEquipment = await prisma.equipment.findUnique({
      where: { serialNo },
    });

    if (existingEquipment) {
      res.status(409).json({ error: 'Equipment with this serial number already exists' });
      return;
    }

    const team = await prisma.maintenanceTeam.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const equipment = await prisma.equipment.create({
      data: {
        name,
        serialNo,
        location,
        department,
        category,
        teamId,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(equipment);
  } catch (error: any) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'Invalid equipment ID' });
      return;
    }

    const { name, location, department, category, teamId } = req.body;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    if (teamId) {
      const team = await prisma.maintenanceTeam.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        res.status(404).json({ error: 'Team not found' });
        return;
      }
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (department !== undefined) updateData.department = department;
    if (category !== undefined) updateData.category = category;
    if (teamId !== undefined) updateData.teamId = teamId;

    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: updateData,
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(updatedEquipment);
  } catch (error: any) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Invalid equipment ID' });
      return;
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }

    await prisma.equipment.delete({
      where: { id },
    });

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error: any) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

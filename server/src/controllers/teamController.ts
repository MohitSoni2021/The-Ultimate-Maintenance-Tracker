import type { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.maintenanceTeam.findMany({
      include: {
        members: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Invalid team ID' });
      return;
    }

    const team = await prisma.maintenanceTeam.findUnique({
      where: { id },
      include: {
        members: {
          select: { id: true, name: true, email: true, department: true },
        },
      },
    });

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error) {
    console.error('Get team by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Team name is required' });
      return;
    }

    const team = await prisma.maintenanceTeam.create({
      data: { name },
      include: {
        members: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.status(201).json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Invalid team ID' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Team name is required' });
      return;
    }

    const team = await prisma.maintenanceTeam.update({
      where: { id },
      data: { name },
      include: {
        members: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(team);
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Invalid team ID' });
      return;
    }

    await prisma.maintenanceTeam.delete({
      where: { id },
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

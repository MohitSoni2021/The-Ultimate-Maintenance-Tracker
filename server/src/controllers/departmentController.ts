import type { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Invalid department ID' });
      return;
    }

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!department) {
      res.status(404).json({ error: 'Department not found' });
      return;
    }

    res.json(department);
  } catch (error) {
    console.error('Get department by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Department name is required' });
      return;
    }

    const existingDepartment = await prisma.department.findUnique({
      where: { name },
    });

    if (existingDepartment) {
      res.status(409).json({ error: 'Department with this name already exists' });
      return;
    }

    const department = await prisma.department.create({
      data: {
        name,
        description: description || null,
      },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(department);
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Invalid department ID' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Department name is required' });
      return;
    }

    // Check if name is already taken by another department
    if (name) {
      const existingDepartment = await prisma.department.findUnique({
        where: { name },
      });

      if (existingDepartment && existingDepartment.id !== id) {
        res.status(409).json({ error: 'Department with this name already exists' });
        return;
      }
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        name,
        description: description !== undefined ? description : undefined,
      },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Invalid department ID' });
      return;
    }

    // Check if department has users
    const usersInDepartment = await prisma.user.count({
      where: { departmentId: id },
    });

    if (usersInDepartment > 0) {
      res.status(400).json({
        error: `Cannot delete department with ${usersInDepartment} user(s). Please reassign users first.`,
      });
      return;
    }

    await prisma.department.delete({
      where: { id },
    });

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

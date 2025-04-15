import { Request, Response, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/auth';
import Task from '../models/Task';
import User from '../models/User';
import { Op } from 'sequelize';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, assigneeIds } = req.body;
    const userId = req.user?.uid;
    
    const task = await Task.create({
      title,
      description: description || null,
      dueDate,
      userId,
    });

    // Add assignees if provided
    if (assigneeIds && Array.isArray(assigneeIds)) {
      // @ts-ignore
      await task.addAssignees(assigneeIds);
    }
    
    // Fetch the task with assignees
    const taskWithAssignees = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    res.status(201).json(taskWithAssignees);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ error: 'Failed to create task' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    const tasks = await Task.findAll({ 
      where: {
        [Op.or]: [
          { userId }, // Tasks created by user
          { '$assignees.id$': userId } // Tasks assigned to user
        ]
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById: RequestHandler = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    console.log('Get task by id error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, dueDate, assigneeIds } = req.body;
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if the user is the owner of the task
    if (task.userId !== req.user?.uid) {
      return res.status(403).json({ error: 'You are not authorized to update this task' });
    }

    // Update basic task info
    await task.update({
      title,
      description,
      status,
      dueDate,
    });

    // Update assignees if provided
    if (assigneeIds && Array.isArray(assigneeIds)) {
      // @ts-ignore
      await task.setAssignees(assigneeIds);
    }

    // Fetch updated task with assignees
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ error: 'Failed to update task' });
  }
};

export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Check if the user is the owner of the task
    if (task.userId !== (req as AuthRequest).user?.uid) {
      return res.status(403).json({ error: 'You are not authorized to delete this task' });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}; 
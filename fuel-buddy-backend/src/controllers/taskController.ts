import { Request, Response, RequestHandler } from 'express';
import Task from '../models/Task';

export const createTask: RequestHandler = async (req, res) => {
  try {
    const { title, description, dueDate, userId } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      userId: userId || null,
    });
    res.status(201).json(task);
  } catch (error) {
    console.log('Create task error:', error);
    res.status(400).json({ error: 'Failed to create taskssss' });
  }
};

export const getTasks: RequestHandler = async (req, res) => {
  console.log("getTasks called");
  try {
    const { userId } = req.query;
    const where = userId ? { userId } : {};
    const tasks = await Task.findAll({ where });
    console.log("Tasks found:", tasks.length);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById: RequestHandler = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    console.error('Get task by id error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const updateTask: RequestHandler = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await task.update({
      title,
      description,
      status,
      dueDate,
    });

    res.json(task);
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

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}; 
import express, { Request, Response, Router } from 'express';
import { Task } from '../interface/TaskInterface';

const router = Router();
const tasks: Task[] = [];

// GET /task - List all tasks
router.get('/', (_req: Request, res: Response) => {
  res.json(tasks);
});

// GET /task/:id - Get specific task
router.get('/:id', (req: any, res: any) => {
  
});

// POST /task - Create new task
router.post('/', (req: any, res: any) => {
  
});

// PATCH /task/:id - Partially update task
router.patch('/:id', (req: any, res: any) => {
  
});

// DELETE /task/:id - Delete specific task
router.delete('/:id', (req: any, res: any) => {
  
});

export default router;
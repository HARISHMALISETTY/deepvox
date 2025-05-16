import express from 'express';
import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';
import type { AuthRequest } from '../types/index.js';

const router = express.Router();

// Middleware to verify JWT token
const auth = async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, 'your-secret-key') as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

// Get all tasks for the current user
router.get('/', auth, async (req: AuthRequest, res: express.Response) => {
  try {
    const tasks = await Task.find({ user: req.user?.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
router.post('/', auth, async (req: AuthRequest, res: express.Response) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user?.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task' });
  }
});

// Update a task
router.put('/:id', auth, async (req: AuthRequest, res: express.Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.userId },
      req.body,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req: AuthRequest, res: express.Response) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.userId
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router; 
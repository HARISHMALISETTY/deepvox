import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
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
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { userId: user._id.toString() };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

// Get current user profile
router.get('/me', auth, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

export default router; 
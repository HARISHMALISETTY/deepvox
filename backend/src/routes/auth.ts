import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { SignUpData, SignInData, AuthResponse } from '../types/index.js';

const router = express.Router();

// Sign up route
router.post('/signup', async (req: Request<{}, {}, SignUpData>, res: Response<AuthResponse>) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        token: '',
        user: {
          id: '',
          name: '',
          email: ''
        }
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Error creating user',
      token: '',
      user: {
        id: '',
        name: '',
        email: ''
      }
    });
  }
});

// Sign in route
router.post('/signin', async (req: Request<{}, {}, SignInData>, res: Response<AuthResponse>) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        token: '',
        user: {
          id: '',
          name: '',
          email: ''
        }
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
        token: '',
        user: {
          id: '',
          name: '',
          email: ''
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      message: 'Error signing in',
      token: '',
      user: {
        id: '',
        name: '',
        email: ''
      }
    });
  }
});

export default router; 
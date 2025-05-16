import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export type Priority = 'low' | 'medium' | 'high';

export interface ITask extends Document {
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
  completed: boolean;
  user: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
  cookies: {
    token?: string;
  };
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
} 
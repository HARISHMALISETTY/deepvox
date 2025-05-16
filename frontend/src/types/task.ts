export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  completed?: boolean;
} 
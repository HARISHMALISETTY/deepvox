import { useState, useEffect } from 'react';
import taskService from '../services/task';
import type { Task, CreateTaskData, UpdateTaskData, Priority } from '../types/task';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const task = await taskService.createTask(newTask);
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: new Date().toISOString().split('T')[0] });
      setError('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (id: string, data: UpdateTaskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      setEditingTask(null);
      setError('');
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    await handleUpdateTask(task._id, { completed: !task.completed });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
    dueToday: tasks.filter(task => {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate.split('T')[0] === today;
    }).length
  };

  if (loading) {
    return <div className="text-white text-center">Loading tasks...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Tasks</h2>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Tasks</h3>
          <p className="text-white text-2xl font-bold">{taskStats.total}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Completed</h3>
          <p className="text-green-500 text-2xl font-bold">{taskStats.completed}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Pending</h3>
          <p className="text-yellow-500 text-2xl font-bold">{taskStats.pending}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">High Priority</h3>
          <p className="text-red-500 text-2xl font-bold">{taskStats.highPriority}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">Due Today</h3>
          <p className="text-indigo-500 text-2xl font-bold">{taskStats.dueToday}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Create Task Form */}
      <form onSubmit={handleCreateTask} className="mb-8 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Task</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Task
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task._id}
            className="bg-gray-800 p-4 rounded-lg flex items-start justify-between"
          >
            <div className="flex-1">
              {editingTask?._id === task._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateTask(task._id, {
                      title: editingTask.title,
                      description: editingTask.description,
                      priority: editingTask.priority,
                      dueDate: editingTask.dueDate
                    });
                  }}
                  className="space-y-2"
                >
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <input
                      type="date"
                      value={editingTask.dueDate.split('T')[0]}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTask(null)}
                      className="bg-gray-600 text-white py-1 px-3 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 rounded"
                    />
                    <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className={`mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-300'}`}>
                    {task.description}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Due: {formatDate(task.dueDate)}
                  </p>
                </div>
              )}
            </div>
            {!editingTask && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setEditingTask(task)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
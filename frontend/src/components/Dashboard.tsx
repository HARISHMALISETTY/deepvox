import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user';
import Tasks from './Tasks';
import type { User } from '../services/user';
import authService from '../services/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch user data');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/signin');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <Tasks />
      </main>
    </div>
  );
} 
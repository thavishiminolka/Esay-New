import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../utils/types';
import Sidebar from '@/components/sidebar';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<User[]>('http://localhost:5000/api/user', {
          withCredentials: true // Send JWT cookie
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleActivation = async (index: number, userId: string) => {
    const updatedUsers = [...users];
    const newStatus = !updatedUsers[index].isActive;
    updatedUsers[index].isActive = newStatus;

    try {
      setUsers(updatedUsers);
      const response = await axios.patch(`http://localhost:5000/api/user/${userId}/activate`, {
        isActive: newStatus
      }, {
        withCredentials: true
      });
      console.log('toggleActivation response:', response.data); // Debug log
    } catch (err: any) {
      updatedUsers[index].isActive = !newStatus;
      setUsers(updatedUsers);
      const errorMessage = err.response?.data?.message || 'Failed to update activation status.';
      setError(errorMessage);
      console.error('toggleActivation error:', err.response?.data || err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main>
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-900">Users Activation Status</h1>
          <div className="flex items-center">
            <span className="mr-2">Admin Name</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 text-left">Student ID</th>
                <th className="py-3 px-4 text-left">User Name</th>
                <th className="py-3 px-4 text-left">Activation</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-t ${index === 5 ? 'border-2 border-blue-500' : ''}`}
                >
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActivation(index, user.id)}
                      className={`px-4 py-1 rounded text-white ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button>
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default UserList;
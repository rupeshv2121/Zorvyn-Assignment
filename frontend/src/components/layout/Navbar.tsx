import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Finance Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-700 hover:text-primary-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

import { LayoutDashboard, ReceiptPoundSterling, TrendingUpDown } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />, roles: ['viewer', 'analyst', 'admin'] },
    { to: '/records', label: 'Records', icon: <ReceiptPoundSterling className="w-6 h-6 text-green-600" />, roles: ['analyst', 'admin'] },
    { to: '/admin', label: 'User Management', icon: <TrendingUpDown className="w-6 h-6 text-blue-600" />, roles: ['admin'] },
  ];

  const filteredLinks = links.filter((link) => link.roles.includes(user?.role || ''));

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="p-4">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Wrench,
  ClipboardList,
  BarChart3,
  Calendar,
  User,
  LogOut,
  List
} from 'lucide-react';
import { logout } from '../store/authSlice';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = {
    ADMIN: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'departments', label: 'Departments', icon: Wrench },
      { id: 'teams', label: 'Teams', icon: Wrench },
      { id: 'equipment', label: 'Equipment', icon: Wrench },
      { id: 'requests', label: 'Requests', icon: ClipboardList },
      { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
    TECHNICIAN: [
      { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
      { id: 'my-requests', label: 'My Requests', icon: List },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    MANAGER: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
      { id: 'my-requests', label: 'My Requests', icon: List },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'equipment', label: 'Equipment', icon: Wrench },
      { id: 'teams', label: 'Teams', icon: Wrench },
      { id: 'requests', label: 'Requests', icon: ClipboardList },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    USER: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'requests', label: 'My Requests', icon: List },
      { id: 'equipment', label: 'Equipment', icon: Wrench },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  };

  const currentMenuItems = menuItems[user?.role] || menuItems.USER;

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col z-50">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-indigo-600">GearGuard</h2>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
          {user?.role} PANEL
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {currentMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <p className="text-sm font-bold text-gray-900 leading-tight truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-semibold text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

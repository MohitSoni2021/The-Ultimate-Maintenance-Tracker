import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const UserProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  if (!user) return null;

  const roleColors = {
    GENERAL: 'bg-blue-100 text-blue-800',
    TECHNICIAN: 'bg-green-100 text-green-800',
    MANAGER: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 ${roleColors[user.role] || roleColors.GENERAL}`}>
              {user.role}
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-1">Email</p>
              <p className="text-sm text-gray-900 break-all">{user.email}</p>
            </div>

            {user.teamId && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-1">Team</p>
                <p className="text-sm text-gray-900">{user.team?.name || 'Not assigned'}</p>
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-1">User ID</p>
              <p className="text-sm text-gray-900 font-mono">{user.id}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

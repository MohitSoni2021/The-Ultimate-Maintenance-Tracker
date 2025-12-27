import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import AdminUsersManagement from './AdminUsersManagement';
import AdminTeamsManagement from './AdminTeamsManagement';
import AdminDepartmentsManagement from './AdminDepartmentsManagement';
import AdminEquipmentManagement from './AdminEquipmentManagement';
import AdminRequestsManagement from './AdminRequestsManagement';
import AdminKanban from './AdminKanban';
import AdminAnalytics from './AdminAnalytics';
import Sidebar from './Sidebar';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Users' },
    { id: 'teams', label: 'Teams' },
    { id: 'departments', label: 'Departments' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'requests', label: 'Requests' },
    { id: 'kanban', label: 'Kanban' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminOverview />;
      case 'users':
        return <AdminUsersManagement />;
      case 'teams':
        return <AdminTeamsManagement />;
      case 'departments':
        return <AdminDepartmentsManagement />;
      case 'equipment':
        return <AdminEquipmentManagement />;
      case 'requests':
        return <AdminRequestsManagement />;
      case 'kanban':
        return <AdminKanban />;
      case 'analytics':
        return <AdminAnalytics />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 capitalize">
              {navItems.find((item) => item.id === activeTab)?.label || activeTab}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium hidden sm:block">
                Welcome back, {user?.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Total Users" value={stats?.totalUsers ?? '--'} color="bg-blue-50" textColor="text-blue-600" />
        <StatCard label="Teams" value={stats?.totalTeams ?? '--'} color="bg-purple-50" textColor="text-purple-600" />
        <StatCard label="Equipment" value={stats?.totalEquipment ?? '--'} color="bg-green-50" textColor="text-green-600" />
        <StatCard label="Requests" value={stats?.totalRequests ?? '--'} color="bg-orange-50" textColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Active Equipment" value={stats?.activeEquipment ?? '--'} color="bg-emerald-50" textColor="text-emerald-600" />
        <StatCard label="Pending Requests" value={stats?.pendingRequests ?? '--'} color="bg-red-50" textColor="text-red-600" />
        <StatCard label="Completed" value={stats?.requestsByStage?.find(s => s.stage === 'COMPLETED')?._count || 0} color="bg-cyan-50" textColor="text-cyan-600" />
        <StatCard label="In Progress" value={stats?.requestsByStage?.find(s => s.stage === 'IN_PROGRESS')?._count || 0} color="bg-yellow-50" textColor="text-yellow-600" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status Breakdown</h3>
          <div className="space-y-3">
            {stats?.requestsByStage?.map((item) => (
              <div key={item.stage} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.stage}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, textColor }) => (
  <div className={`${color} rounded-lg shadow-sm border border-gray-200 p-6`}>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
    <p className={`text-4xl font-bold ${textColor} mt-2`}>{value}</p>
  </div>
);

export default AdminDashboard;

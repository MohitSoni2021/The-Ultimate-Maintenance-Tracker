import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import UsersManagement from './UsersManagement';
import CreateRequestForm from '../components/CreateRequestForm';
import MyRequestsList from '../components/MyRequestsList';
import EquipmentSearch from '../components/EquipmentSearch';
import UserProfile from '../components/UserProfile';
import Sidebar from '../components/Sidebar';
import CalendarView from '../components/CalendarView';
import TechnicianDashboardComponent from '../components/TechnicianDashboard';
import NewAdminDashboard from '../components/AdminDashboard';
import KanbanBoard from '../components/KanbanBoard';
import ManagerAnalytics from '../components/ManagerAnalytics';
import { getTeamRequests, getAllRequests } from '../store/requestSlice';
import { useDispatch } from 'react-redux';
import AdminTeamsManagement from '../components/AdminTeamsManagement';
import AdminEquipmentManagement from '../components/AdminEquipmentManagement';

const GeneralDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [requestsTab, setRequestsTab] = useState('active');
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useSelector((state) => state.auth);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Hello, {user?.name}! 👋</h3>
              <p className="text-indigo-100 mb-4">Need to report a maintenance issue or schedule preventive maintenance?</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                + Report a Problem
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="p-6">
                    <MyRequestsList activeTab="active" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">-</p>
                      <p className="text-sm text-gray-600 mt-1">Active Requests</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">-</p>
                      <p className="text-sm text-gray-600 mt-1">Completed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
                  >
                    Create Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'requests':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <div className="flex gap-4 px-6">
                <button
                  onClick={() => setRequestsTab('active')}
                  className={`py-4 px-2 font-medium border-b-2 transition ${
                    requestsTab === 'active'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Active Requests
                </button>
                <button
                  onClick={() => setRequestsTab('all')}
                  className={`py-4 px-2 font-medium border-b-2 transition ${
                    requestsTab === 'all'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Requests
                </button>
              </div>
            </div>
            <div className="p-6">
              <MyRequestsList activeTab={requestsTab} />
            </div>
          </div>
        );

      case 'equipment':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Equipment Inventory</h3>
              <p className="text-sm text-gray-600 mt-1">Browse and search available equipment to report issues</p>
            </div>
            <div className="p-6">
              <EquipmentSearch />
            </div>
          </div>
        );

      case 'calendar':
        return <CalendarView />;

      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <UserProfile onClose={() => {}} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 h-20 flex items-center justify-between gap-4">
            {/* Left: Title */}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'requests' && 'My Requests'}
                {activeTab === 'equipment' && 'Equipment Search'}
                {activeTab === 'calendar' && 'Calendar'}
                {activeTab === 'profile' && 'Profile'}
              </h1>
            </div>

            {/* Right: Actions and User Info */}
            <div className="flex items-center gap-6">
              {activeTab !== 'profile' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition text-sm whitespace-nowrap shadow-sm"
                >
                  + New Request
                </button>
              )}
              
              {/* Divider */}
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  <span className="text-xs text-gray-500 uppercase font-semibold">{user?.role}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {renderContent()}
        </main>
      </div>

      {showCreateForm && (
        <CreateRequestForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export { GeneralDashboard };

export const TechnicianDashboard = () => <TechnicianDashboardComponent />;

export const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useSelector((state) => state.auth);
  const { list: requests, loading } = useSelector((state) => state.requests);
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await api.get('/requests/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'kanban') {
      dispatch(getAllRequests());
    }
    
    // Only fetch stats on dashboard tab
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [dispatch, activeTab, fetchStats]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Manager Dashboard Overview</h3>
              <p className="text-blue-100">Welcome back, {user?.name}. You are overseeing maintenance activities.</p>
            </div>
            
            {/* Stats Overview */}
            {!statsLoading && stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.byStage?.map((s) => (
                  <StatCard key={s.name} label={s.name} value={s.count ?? '--'} color="bg-gray-50" textColor="text-gray-700" />
                ))}
              </div>
            )}
            
            <ManagerAnalytics />
          </div>
        );
      case 'kanban':
        return (
          <div className="h-[calc(100vh-200px)] overflow-hidden">
            <KanbanBoard requests={requests} />
          </div>
        );
      case 'calendar':
        return <CalendarView />;
      case 'equipment':
        return <AdminEquipmentManagement />;
      case 'teams':
        return <AdminTeamsManagement />;
      case 'requests':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <MyRequestsList activeTab="all" />
          </div>
        );
      case 'analytics':
        return <ManagerAnalytics />;
      case 'profile':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <UserProfile onClose={() => setActiveTab('dashboard')} />
          </div>
        );
      case 'my-requests':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">My Requests</h3>
                  <p className="text-blue-100">View and manage requests you've created</p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition whitespace-nowrap"
                >
                  + Create Request
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <div className="flex gap-4 px-6">
                  <button className="py-4 px-2 font-medium border-b-2 border-indigo-600 text-indigo-600">
                    All Requests
                  </button>
                </div>
              </div>
              <div className="p-6">
                <MyRequestsList activeTab="all" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 h-20 flex items-center justify-between gap-4">
            {/* Left: Title */}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 capitalize truncate">
                {activeTab === 'dashboard' ? 'Overview' : activeTab === 'my-requests' ? 'My Requests' : activeTab}
              </h1>
            </div>

            {/* Right: Actions and User Info */}
            <div className="flex items-center gap-6">
              {(activeTab === 'dashboard' || activeTab === 'my-requests') && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition text-sm whitespace-nowrap shadow-sm"
                >
                  + Create Request
                </button>
              )}
              
              {/* Divider */}
              <div className="h-6 w-px bg-gray-300"></div>
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  <span className="text-xs text-gray-500 uppercase font-semibold">{user?.role}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {loading && activeTab !== 'dashboard' && activeTab !== 'analytics' ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {showCreateForm && (
        <CreateRequestForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export const AdminDashboard = () => <NewAdminDashboard />;

const StatCard = ({ label, value, color, textColor }) => (
  <div className={`${color} rounded-lg shadow-sm border border-gray-200 p-6`}>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
    <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
  </div>
);

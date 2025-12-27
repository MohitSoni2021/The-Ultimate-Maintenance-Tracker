import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeamRequests } from '../store/requestSlice';
import KanbanBoard from './KanbanBoard';
import CalendarView from './CalendarView';
import UserProfile from './UserProfile';
import Sidebar from './Sidebar';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: IconComponent, label, value, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
      <IconComponent size={24} className={color} />
    </div>
  </div>
);

const TechnicianDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: requests, loading } = useSelector((state) => state.requests);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('kanban');

  useEffect(() => {
    dispatch(getTeamRequests()).catch(() => {
      toast.error('Failed to load team requests');
    });
  }, [dispatch]);

  useEffect(() => {
    if (requests && requests.length > 0) {
      const members = requests
        .filter((r) => r.assignedTo)
        .map((r) => r.assignedTo)
        .filter((member, index, self) => self.findIndex((m) => m.id === member.id) === index);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeamMembers(members);
    }
  }, [requests]);

  const openRequests = requests.filter((r) => ['OPEN', 'ASSIGNED'].includes(r.stage));
  const inProgressRequests = requests.filter((r) => r.stage === 'IN_PROGRESS');
  const overdueRequests = requests.filter((r) => {
    if (!r.scheduledDate || ['COMPLETED', 'CANCELLED'].includes(r.stage)) return false;
    return new Date(r.scheduledDate) < new Date();
  });

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'kanban':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={AlertCircle}
                  label="Open Requests"
                  value={openRequests.length}
                  color="text-blue-600"
                />
                <StatCard
                  icon={Clock}
                  label="In Progress"
                  value={inProgressRequests.length}
                  color="text-orange-600"
                />
                <StatCard
                  icon={AlertCircle}
                  label="Overdue"
                  value={overdueRequests.length}
                  color="text-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Maintenance Requests</h2>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No maintenance requests assigned to your team yet.</p>
                </div>
              ) : (
                <KanbanBoard requests={requests} teamMembers={teamMembers} />
              )}
            </div>
          </div>
        );
      case 'calendar':
        return <CalendarView />;
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <UserProfile onClose={() => setActiveTab('kanban')} />
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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 h-16 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Welcome, {user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default TechnicianDashboard;

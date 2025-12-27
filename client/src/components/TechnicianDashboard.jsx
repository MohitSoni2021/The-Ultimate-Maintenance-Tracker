import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeamRequests } from '../store/requestSlice';
import KanbanBoard from './KanbanBoard';
import CalendarView from './CalendarView';
import UserProfile from './UserProfile';
import Sidebar from './Sidebar';
import RequestModal from './RequestModal';
import CreateRequestForm from './CreateRequestForm';
import MyRequestsList from './MyRequestsList';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

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
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    dispatch(getTeamRequests()).catch(() => {
      toast.error('Failed to load team requests');
    });
  }, [dispatch]);

  // Fetch team members from the team API endpoint
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (user?.teamId) {
        try {
          const response = await api.get(`/teams/${user.teamId}`);
          console.log('Team members response:', response.data);
          setTeamMembers(response.data.members || []);
        } catch (error) {
          console.error('Failed to fetch team members:', error);
          // Fallback to getting members from requests if API fails
          if (requests && requests.length > 0) {
            const members = requests
              .filter((r) => r.assignedTo)
              .map((r) => r.assignedTo)
              .filter((member, index, self) => self.findIndex((m) => m.id === member.id) === index);
            setTeamMembers(members);
          }
        }
      }
    };
    
    fetchTeamMembers();
  }, [user?.teamId, requests]);

  const openRequests = requests.filter((r) => ['OPEN', 'ASSIGNED'].includes(r.stage));
  const inProgressRequests = requests.filter((r) => r.stage === 'IN_PROGRESS');
  const overdueRequests = requests.filter((r) => {
    if (!r.scheduledDate || ['COMPLETED', 'CANCELLED'].includes(r.stage)) return false;
    return new Date(r.scheduledDate) < new Date();
  });

  // Filter requests for technician: show unassigned tasks matching their department and tasks assigned to this user only
  const technicianRequests = requests.filter((r) => {
    // Show tasks already assigned to this user
    if (r.assignedToId === user?.id) {
      return true;
    }
    
    // Show unassigned tasks only if equipment category matches user's department
    if (!r.assignedToId && r.equipment?.category === user?.department?.name) {
      return true;
    }
    
    return false;
  });

  // Filter for unassigned requests only (show all unassigned requests in the system)
  const unassignedRequests = requests.filter((r) => {
    return !r.assignedToId;
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
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  + Create Request
                </button>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No maintenance requests assigned to your team yet.</p>
                </div>
              ) : (
                <KanbanBoard requests={technicianRequests} teamMembers={teamMembers} unassignedRequests={unassignedRequests} />
              )}
            </div>
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 h-20 flex items-center justify-between gap-4">
            {/* Left: Title */}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 capitalize truncate">
                {activeTab === 'kanban' ? 'Tasks' : activeTab === 'my-requests' ? 'My Requests' : activeTab}
              </h1>
            </div>

            {/* Right: User Info */}
            <div className="flex items-center gap-6">
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

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          teamMembers={teamMembers}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {/* Create Request Form Modal */}
      {showCreateForm && (
        <CreateRequestForm
          onClose={() => {
            setShowCreateForm(false);
            dispatch(getTeamRequests());
          }}
        />
      )}
    </div>
  );
};

export default TechnicianDashboard;

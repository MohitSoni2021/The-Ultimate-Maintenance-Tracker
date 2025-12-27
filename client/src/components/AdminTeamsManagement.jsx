import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Search, Users } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import CreateTeamModal from './CreateTeamModal';
import EditTeamModal from './EditTeamModal';

const AdminTeamsManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to fetch teams');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;

    try {
      await api.delete(`/teams/${teamId}`);
      setTeams(teams.filter((t) => t.id !== teamId));
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error('Failed to delete team');
      console.error(error);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading teams...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Create Button */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          Create Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-600">
            No teams found
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                    <Users size={16} />
                    <span>{team.members?.length || 0} members</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTeam(team)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all"
                    title="Edit team"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-all"
                    title="Delete team"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {team.members && team.members.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Team Members:</p>
                  <div className="flex flex-wrap gap-2">
                    {team.members.slice(0, 3).map((member) => (
                      <span key={member.id} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {member.name}
                      </span>
                    ))}
                    {team.members.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        +{team.members.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onTeamCreated={() => {
            fetchTeams();
            setShowCreateModal(false);
          }}
        />
      )}

      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onTeamUpdated={() => {
            fetchTeams();
            setEditingTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminTeamsManagement;

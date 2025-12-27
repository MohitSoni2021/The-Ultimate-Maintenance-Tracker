import React, { useState, useEffect } from 'react';
import KanbanBoard from './KanbanBoard';
import { useSelector, useDispatch } from 'react-redux';
import { getTeamRequests } from '../store/requestSlice';
import api from '../api/axios';

const AdminKanban = () => {
  const dispatch = useDispatch();
  const { list: requests } = useSelector((state) => state.requests);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    dispatch(getTeamRequests());
    fetchTeamMembers();
  }, [dispatch]);

  const fetchTeamMembers = async () => {
    try {
      // Get the user's current team first
      const userResponse = await api.get('/users/me');
      if (userResponse.data?.teamId) {
        const teamResponse = await api.get(`/teams/${userResponse.data.teamId}`);
        setTeamMembers(teamResponse.data.members || []);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Requests Kanban Board</h3>
        <KanbanBoard requests={requests} teamMembers={teamMembers} />
      </div>
    </div>
  );
};

export default AdminKanban;

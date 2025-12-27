import React from 'react';
import KanbanBoard from './KanbanBoard';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getTeamRequests } from '../store/requestSlice';

const AdminKanban = () => {
  const dispatch = useDispatch();
  const { list: requests } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(getTeamRequests());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Requests Kanban Board</h3>
        <KanbanBoard requests={requests} teamMembers={[]} />
      </div>
    </div>
  );
};

export default AdminKanban;

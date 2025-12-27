import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyRequests, getRequestById } from '../store/requestSlice';
import RequestDetailsModal from './RequestDetailsModal';

const StatusBadge = ({ stage }) => {
  const statusConfig = {
    OPEN: { bg: 'bg-blue-100', text: 'text-blue-800' },
    ASSIGNED: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    IN_PROGRESS: { bg: 'bg-orange-100', text: 'text-orange-800' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-800' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const config = statusConfig[stage] || statusConfig.OPEN;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {stage}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    LOW: { bg: 'bg-green-100', text: 'text-green-800' },
    MEDIUM: { bg: 'bg-blue-100', text: 'text-blue-800' },
    HIGH: { bg: 'bg-orange-100', text: 'text-orange-800' },
    CRITICAL: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {priority}
    </span>
  );
};

const MyRequestsList = ({ activeTab }) => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.requests);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    dispatch(getMyRequests());
  }, [dispatch]);

  const handleViewDetails = (requestId) => {
    dispatch(getRequestById(requestId));
    setSelectedRequestId(requestId);
  };

  const handleCloseDetails = () => {
    setSelectedRequestId(null);
  };

  const filteredRequests = list.filter((request) => {
    if (activeTab === 'active') {
      return ['OPEN', 'ASSIGNED', 'IN_PROGRESS'].includes(request.stage);
    }
    return true;
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading your requests...</div>;
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {activeTab === 'active' ? 'active' : ''} requests yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer" onClick={() => handleViewDetails(request.id)}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{request.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{request.equipment?.name}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge stage={request.stage} />
                <PriorityBadge priority={request.priority} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mt-3 mb-2">
              <div>
                <span className="text-gray-600">Type:</span>
                <p className="text-gray-900">{request.type}</p>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <p className="text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {request.assignedTo && (
              <div className="text-sm border-t pt-2 mt-2">
                <span className="text-gray-600">Assigned to:</span>
                <p className="text-gray-900">{request.assignedTo.name}</p>
              </div>
            )}

            {request.scheduledDate && (
              <div className="text-sm text-gray-600 mt-2">
                Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedRequestId && (
        <RequestDetailsModal
          requestId={selectedRequestId}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default MyRequestsList;

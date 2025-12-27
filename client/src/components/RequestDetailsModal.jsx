import React from 'react';
import { useSelector } from 'react-redux';

const RequestDetailsModal = ({ onClose }) => {
  const { selectedRequest, loading } = useSelector((state) => state.requests);

  if (!selectedRequest) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDurationText = () => {
    if (!selectedRequest.completedDate) return null;
    const created = new Date(selectedRequest.createdAt);
    const completed = new Date(selectedRequest.completedDate);
    const diffMs = completed - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedRequest.title}
              </h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedRequest.stage === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  selectedRequest.stage === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' :
                  selectedRequest.stage === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedRequest.stage}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedRequest.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                  selectedRequest.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  selectedRequest.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedRequest.priority}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Request Type</p>
                <p className="font-medium text-gray-900">{selectedRequest.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Equipment</p>
                <p className="font-medium text-gray-900">{selectedRequest.equipment?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Serial Number</p>
                <p className="font-medium text-gray-900">{selectedRequest.equipment?.serialNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-medium text-gray-900">{selectedRequest.equipment?.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-medium text-gray-900">{selectedRequest.equipment?.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="font-medium text-gray-900">{selectedRequest.equipment?.department}</p>
              </div>
            </div>

            {selectedRequest.description && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                <p className="text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedRequest.description}
                </p>
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created By</p>
                  <p className="font-medium text-gray-900">{selectedRequest.createdBy?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created On</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              {selectedRequest.assignedTo && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                    <p className="font-medium text-gray-900">{selectedRequest.assignedTo?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Team</p>
                    <p className="font-medium text-gray-900">{selectedRequest.team?.name}</p>
                  </div>
                </div>
              )}

              {selectedRequest.scheduledDate && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Scheduled Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedRequest.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedRequest.completedDate && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedRequest.completedDate)} ({getDurationText()})
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailsModal;

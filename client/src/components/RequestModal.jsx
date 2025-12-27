import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRequest } from '../store/requestSlice';
import { X, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import EquipmentDetailsModal from './EquipmentDetailsModal';

const STAGES = [
  { value: 'OPEN', label: 'New' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REPAIRED', label: 'Repaired' },
  { value: 'SCRAP', label: 'Scrap' },
];

const RequestModal = ({ request, teamMembers, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(() => ({
    stage: request?.stage || 'OPEN',
    assignedToId: request?.assignedToId || '',
    description: request?.description || '',
    duration: request?.duration || '',
    scheduledDate: request?.scheduledDate ? new Date(request.scheduledDate).toISOString().split('T')[0] : '',
    priority: request?.priority || 'MEDIUM',
  }));
  const [showEquipmentDetails, setShowEquipmentDetails] = useState(false);
  const { loading } = useSelector((state) => state.requests);

  useEffect(() => {
    setFormData({
      stage: request?.stage || 'OPEN',
      assignedToId: request?.assignedToId || '',
      description: request?.description || '',
      duration: request?.duration || '',
      scheduledDate: request?.scheduledDate ? new Date(request.scheduledDate).toISOString().split('T')[0] : '',
      priority: request?.priority || 'MEDIUM',
    });
  }, [request?.id]);

  const { stage, assignedToId, description, duration, scheduledDate, priority } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updates = {};
      if (stage !== request.stage) updates.stage = stage;
      if (assignedToId !== request.assignedToId) updates.assignedToId = assignedToId || null;
      if (description !== request.description) updates.description = description;
      if (duration !== request.duration) updates.duration = duration ? parseFloat(duration) : null;
      if (scheduledDate !== (request.scheduledDate ? new Date(request.scheduledDate).toISOString().split('T')[0] : '')) updates.scheduledDate = scheduledDate || null;
      if (priority !== request.priority) updates.priority = priority;

      if (Object.keys(updates).length === 0) {
        toast.success('No changes made');
        return;
      }

      await dispatch(updateRequest({ id: request.id, data: updates })).unwrap();
      toast.success('Request updated successfully');
      onClose();
    } catch (error) {
      toast.error(error?.error || 'Failed to update request');
    }
  };

  const handleAssignToMe = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      setAssignedToId(currentUser.id);
    }
  };

  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{request.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Equipment</label>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{request.equipment?.name}</p>
              <button
                onClick={() => setShowEquipmentDetails(true)}
                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition"
                title="View equipment details"
              >
                <Info size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Type</label>
            <p className="text-sm">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                request.type === 'CORRECTIVE'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {request.type === 'CORRECTIVE' ? 'Corrective' : 'Preventive'}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Stage</label>
            <select
              name="stage"
              value={stage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
            <select
              name="priority"
              value={priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Assigned To</label>
            <div className="flex gap-2">
              <select
                name="assignedToId"
                value={assignedToId}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">Unassigned</option>
                {teamMembers?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAssignToMe}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition whitespace-nowrap"
              >
                Assign to Me
              </button>
            </div>
          </div>

          {(stage === 'REPAIRED' || stage === 'SCRAP' || stage === 'COMPLETED') && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Duration (hours)</label>
              <input
                type="number"
                name="duration"
                step="0.5"
                min="0"
                value={duration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter hours spent on repair"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Scheduled Date</label>
            <input
              type="date"
              name="scheduledDate"
              value={scheduledDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Add notes or description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <label className="block text-gray-600 mb-1">Created</label>
              <p className="text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
            </div>
            {request.updatedAt && (
              <div>
                <label className="block text-gray-600 mb-1">Updated</label>
                <p className="text-gray-900">{new Date(request.updatedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {showEquipmentDetails && (
        <EquipmentDetailsModal
          equipment={request.equipment}
          onClose={() => setShowEquipmentDetails(false)}
        />
      )}
    </div>
  );
};

export default RequestModal;

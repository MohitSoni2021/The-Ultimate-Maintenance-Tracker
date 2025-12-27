import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRequest } from '../store/requestSlice';
import { getAllEquipment } from '../store/equipmentSlice';

const CreateRequestForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { createLoading, createError } = useSelector((state) => state.requests);
  const { list: equipment } = useSelector((state) => state.equipment);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CORRECTIVE',
    equipmentId: '',
    scheduledDate: '',
    priority: 'MEDIUM',
  });

  useEffect(() => {
    dispatch(getAllEquipment());
  }, [dispatch]);

  const selectedEquipment = formData.equipmentId
    ? equipment.find((e) => e.id === formData.equipmentId)
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.equipmentId && formData.title && formData.type) {
      dispatch(createRequest(formData)).then(() => {
        onClose();
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Report a Problem</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {createError && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
              {createError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment *
            </label>
            <select
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Equipment</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.serialNo})
                </option>
              ))}
            </select>
          </div>

          {selectedEquipment && (
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <p className="text-sm text-gray-600">{selectedEquipment.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Location:</span>
                <p className="text-sm text-gray-600">{selectedEquipment.location}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Department:</span>
                <p className="text-sm text-gray-600">{selectedEquipment.department}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Assigned Team:</span>
                <p className="text-sm text-gray-600">{selectedEquipment.team?.name}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's wrong?"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CORRECTIVE">Corrective (Fix a problem)</option>
              <option value="PREVENTIVE">Preventive (Scheduled maintenance)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {formData.type === 'PREVENTIVE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the issue..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={createLoading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 font-medium"
            >
              {createLoading ? 'Creating...' : 'Report Problem'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;

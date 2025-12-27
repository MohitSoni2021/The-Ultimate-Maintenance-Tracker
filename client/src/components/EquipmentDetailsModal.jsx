import React from 'react';
import { X } from 'lucide-react';

const EquipmentDetailsModal = ({ equipment, onClose }) => {
  if (!equipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Equipment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Equipment Name</label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{equipment.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Serial Number</label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{equipment.serialNo}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{equipment.category}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Location</label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{equipment.location}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Department</label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{equipment.department}</p>
          </div>

          {equipment.team && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Maintenance Team</label>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{equipment.team.name}</p>
            </div>
          )}

          {equipment.createdAt && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Created Date</label>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {new Date(equipment.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsModal;

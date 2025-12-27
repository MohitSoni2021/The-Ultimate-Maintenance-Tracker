import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const CreateEquipmentModal = ({ onClose, onEquipmentCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNo: '',
    location: '',
    department: '',
    category: '',
    teamId: '',
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to fetch teams');
      console.error(error);
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.serialNo || !formData.location || !formData.department || !formData.category || !formData.teamId) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/equipment', formData);
      toast.success('Equipment created successfully');
      onEquipmentCreated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create equipment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Create Equipment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Equipment Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Hydraulic Press"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Serial Number *</label>
              <input
                type="text"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
                placeholder="e.g., SN-12345"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">Select Category</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Hydraulic">Hydraulic</option>
                <option value="Pneumatic">Pneumatic</option>
                <option value="HVAC">HVAC</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Safety">Safety Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">Select Department</option>
                <option value="Production">Production</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Operations">Operations</option>
                <option value="Facilities">Facilities</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Building A, Floor 2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Team */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Maintenance Team *</label>
              <select
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                disabled={teamsLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
              >
                <option value="">{teamsLoading ? 'Loading teams...' : 'Select Team'}</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEquipmentModal;

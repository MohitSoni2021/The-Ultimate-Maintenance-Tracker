import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Search } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import CreateEquipmentModal from './CreateEquipmentModal';

const AdminEquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await api.get('/equipment');
      setEquipment(response.data);
    } catch (error) {
      toast.error('Failed to fetch equipment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;

    setDeletingId(equipmentId);
    try {
      await api.delete(`/equipment/${equipmentId}`);
      setEquipment(equipment.filter((item) => item.id !== equipmentId));
      toast.success('Equipment deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete equipment');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading equipment...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Create Button */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or serial number..."
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
          Add Equipment
        </button>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Serial No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Team</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-600">
                    No equipment found
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.serialNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.team?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.department || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.location || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toast.success('Edit functionality coming soon')}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-all"
                          title="Edit equipment"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete equipment"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEquipmentModal
          onClose={() => setShowCreateModal(false)}
          onEquipmentCreated={() => {
            fetchEquipment();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminEquipmentManagement;

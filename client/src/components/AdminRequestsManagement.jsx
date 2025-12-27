import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AdminRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests/team/requests');
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !stageFilter || request.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const stages = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  const getStageColor = (stage) => {
    switch (stage) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'CORRECTIVE'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Equipment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Scheduled</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-600">
                    No requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{request.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.equipment?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(request.type)}`}>
                        {request.type === 'CORRECTIVE' ? 'Corrective' : 'Preventive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStageColor(request.stage)}`}>
                        {request.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.scheduledDate
                        ? new Date(request.scheduledDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRequestsManagement;

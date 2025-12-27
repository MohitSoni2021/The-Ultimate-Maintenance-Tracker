import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AdminAnalytics = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests/team/requests');
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const stageStats = {
    OPEN: requests.filter((r) => r.stage === 'OPEN').length,
    ASSIGNED: requests.filter((r) => r.stage === 'ASSIGNED').length,
    IN_PROGRESS: requests.filter((r) => r.stage === 'IN_PROGRESS').length,
    COMPLETED: requests.filter((r) => r.stage === 'COMPLETED').length,
    CANCELLED: requests.filter((r) => r.stage === 'CANCELLED').length,
  };

  const typeStats = {
    CORRECTIVE: requests.filter((r) => r.type === 'CORRECTIVE').length,
    PREVENTIVE: requests.filter((r) => r.type === 'PREVENTIVE').length,
  };

  const overdueRequests = requests.filter(
    (r) =>
      r.scheduledDate &&
      new Date(r.scheduledDate) < new Date() &&
      !['COMPLETED', 'CANCELLED'].includes(r.stage)
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Total Requests" value={requests.length} color="bg-blue-50 text-blue-600" />
        <StatCard label="Overdue" value={overdueRequests.length} color="bg-red-50 text-red-600" />
        <StatCard label="Preventive" value={typeStats.PREVENTIVE} color="bg-green-50 text-green-600" />
        <StatCard label="Corrective" value={typeStats.CORRECTIVE} color="bg-orange-50 text-orange-600" />
      </div>

      {/* Stage Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Requests by Stage</h3>
          <div className="space-y-3">
            {Object.entries(stageStats).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stage}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(count / requests.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 min-w-[30px]">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Types</h3>
          <div className="space-y-3">
            {Object.entries(typeStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(count / requests.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 min-w-[30px]">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue Requests */}
      {overdueRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Requests</h3>
          <div className="space-y-2">
            {overdueRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{request.title}</p>
                  <p className="text-xs text-gray-600">Due: {new Date(request.scheduledDate).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-semibold text-red-600">{request.stage}</span>
              </div>
            ))}
            {overdueRequests.length > 5 && (
              <p className="text-sm text-gray-600 text-center mt-2">
                +{overdueRequests.length - 5} more overdue requests
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className={`${color} rounded-lg shadow-sm border border-gray-200 p-6`}>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
    <p className={`text-4xl font-bold mt-2`}>{value}</p>
  </div>
);

export default AdminAnalytics;

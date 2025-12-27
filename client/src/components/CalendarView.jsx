import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTeamRequests } from '../store/requestSlice';

const CalendarView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: requests } = useSelector((state) => state.requests);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (user?.role === 'TECHNICIAN') {
      dispatch(getTeamRequests());
    }
  }, [dispatch, user?.role]);

  const scheduledRequests = React.useMemo(() => {
    const scheduled = {};
    requests.forEach((request) => {
      if (request.scheduledDate && request.type === 'PREVENTIVE') {
        const dateKey = new Date(request.scheduledDate).toISOString().split('T')[0];
        if (!scheduled[dateKey]) {
          scheduled[dateKey] = [];
        }
        scheduled[dateKey].push(request);
      }
    });
    return scheduled;
  }, [requests]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDateKey = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getStatusColor = (stage) => {
    switch (stage) {
      case 'OPEN':
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Calendar View</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ← Previous
            </button>
            <span className="px-4 py-2 font-medium text-gray-900 min-w-40 text-center">
              {monthName}
            </span>
            <button
              onClick={handleNextMonth}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg p-2 ${
                  day === null
                    ? 'bg-white'
                    : isToday(day)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 hover:border-indigo-300'
                }`}
              >
                {day && (
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-semibold ${isToday(day) ? 'text-white' : 'text-gray-900'}`}>
                      {day}
                    </span>
                    <div className="flex-1 overflow-hidden mt-1">
                      {scheduledRequests[getDateKey(day)] && (
                        <div className="space-y-1">
                          {scheduledRequests[getDateKey(day)].slice(0, 2).map((req) => (
                            <div
                              key={req.id}
                              className={`text-xs px-1 py-0.5 rounded ${getStatusColor(req.stage)}`}
                              title={req.title}
                            >
                              {req.title.substring(0, 8)}...
                            </div>
                          ))}
                          {scheduledRequests[getDateKey(day)].length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{scheduledRequests[getDateKey(day)].length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            New
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            {requests.filter((r) => ['OPEN', 'ASSIGNED'].includes(r.stage) && r.type === 'PREVENTIVE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            In Progress
          </h4>
          <p className="text-2xl font-bold text-orange-600">
            {requests.filter((r) => r.stage === 'IN_PROGRESS' && r.type === 'PREVENTIVE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Repaired
          </h4>
          <p className="text-2xl font-bold text-green-600">
            {requests.filter((r) => r.stage === 'COMPLETED' && r.type === 'PREVENTIVE').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

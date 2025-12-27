import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Zap, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRequest } from '../store/requestSlice';
import { toast } from 'react-hot-toast';

const TypeBadge = ({ type }) => {
  const config = {
    CORRECTIVE: { bg: 'bg-red-100', text: 'text-red-800', label: 'Corrective' },
    PREVENTIVE: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Preventive' },
  };

  const style = config[type] || config.CORRECTIVE;

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};

const RequestCard = ({ request, onClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: request.id,
    data: { stage: request.stage },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = request.scheduledDate && new Date(request.scheduledDate) < new Date() && ['OPEN', 'ASSIGNED', 'IN_PROGRESS'].includes(request.stage);

  const handleAssignToMe = (e) => {
    e.stopPropagation();
    if (!user?.id) {
      toast.error('You must be logged in to assign requests');
      return;
    }
    dispatch(updateRequest({ id: request.id, data: { assignedToId: user.id, stage: 'IN_PROGRESS' } }))
      .then(() => toast.success('Request assigned to you'))
      .catch(() => toast.error('Failed to assign request'));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`bg-white rounded-lg border cursor-pointer transition-all hover:shadow-md p-3 ${
        isOverdue ? 'border-red-300 border-l-4 border-l-red-500' : 'border-gray-200'
      }`}
    >
      <div className="flex gap-2 items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{request.title}</h4>
          <p className="text-xs text-gray-600 mt-1 truncate">{request.equipment?.name}</p>
        </div>
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <TypeBadge type={request.type} />
        {isOverdue && <Zap size={14} className="text-red-500" />}
      </div>

      {request.assignedTo && (
        <div className="mt-2 flex items-center gap-2">
          {request.assignedTo.avatar ? (
            <img
              src={request.assignedTo.avatar}
              alt={request.assignedTo.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-medium">
              {request.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-600 truncate">{request.assignedTo.name}</span>
        </div>
      )}

      {!request.assignedTo && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400 italic">Unassigned</span>
          {['OPEN', 'ASSIGNED'].includes(request.stage) && (
            <button
              onClick={handleAssignToMe}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-100 transition"
            >
              <UserPlus size={12} />
              Assign to Me
            </button>
          )}
        </div>
      )}

      {request.scheduledDate && (
        <div className="mt-2">
          <p className="text-xs text-gray-600">
            Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {isOverdue && (
        <div className="mt-2">
          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
            OVERDUE
          </span>
        </div>
      )}
    </div>
  );
};

export default RequestCard;

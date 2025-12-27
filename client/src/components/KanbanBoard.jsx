import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDispatch } from 'react-redux';
import { updateRequest } from '../store/requestSlice';
import RequestCard from './RequestCard';
import RequestModal from './RequestModal';
import { toast } from 'react-hot-toast';

const STAGES = [
  { value: 'OPEN', label: 'New', color: 'bg-blue-50', borderColor: 'border-blue-200' },
  { value: 'ASSIGNED', label: 'Assigned', color: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-orange-50', borderColor: 'border-orange-200' },
  { value: 'REPAIRED', label: 'Repaired', color: 'bg-green-50', borderColor: 'border-green-200' },
  { value: 'SCRAP', label: 'Scrap', color: 'bg-red-50', borderColor: 'border-red-200' },
];

const KanbanColumn = ({ stage, requests, onCardClick }) => {
  const { setNodeRef } = useDroppable({
    id: stage.value,
  });

  return (
    <div ref={setNodeRef} className={`flex-shrink-0 w-80 rounded-lg border-2 ${stage.borderColor} ${stage.color} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{stage.label}</h3>
        <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
          {requests.length}
        </span>
      </div>

      <SortableContext id={stage.value} items={requests.map((r) => r.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[400px]">
          {requests.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <p className="text-sm">No requests</p>
            </div>
          ) : (
            requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => onCardClick(request)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanBoard = ({ requests, teamMembers = [], unassignedRequests = [] }) => {
  const dispatch = useDispatch();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const groupedRequests = STAGES.reduce((acc, stage) => {
    acc[stage.value] = requests.filter((r) => r.stage === stage.value);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    // We handle the actual update in handleDragEnd to avoid multiple API calls
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const request = requests.find((r) => r.id === active.id);
    if (!request) return;

    // over.id could be the stage value (from SortableContext id) 
    // or an item id (if dropped on another card)
    const overId = over.id;
    const overStageValue = over.data?.current?.sortable?.containerId || overId;

    if (overStageValue && overStageValue !== request.stage && STAGES.find(s => s.value === overStageValue)) {
      if (['REPAIRED', 'SCRAP'].includes(overStageValue)) {
        setSelectedRequest({ ...request, stage: overStageValue });
        return;
      }
      dispatch(updateRequest({ id: request.id, data: { stage: overStageValue } }))
        .then(() => {
          toast.success('Request moved successfully');
        })
        .catch(() => {
          toast.error('Failed to move request');
        });
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* Unassigned Requests Column */}
          {unassignedRequests && unassignedRequests.length > 0 && (
            <KanbanColumn
              stage={{ value: 'UNASSIGNED', label: 'Available', color: 'bg-purple-50', borderColor: 'border-purple-200' }}
              requests={unassignedRequests}
              onCardClick={setSelectedRequest}
              dragOverId={activeId}
            />
          )}
          
          {/* Regular Stages */}
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.value}
              stage={stage}
              requests={groupedRequests[stage.value] || []}
              onCardClick={setSelectedRequest}
              dragOverId={activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-70">
              <RequestCard
                request={requests.find((r) => r.id === activeId) || {}}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          teamMembers={teamMembers}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
};

export default KanbanBoard;

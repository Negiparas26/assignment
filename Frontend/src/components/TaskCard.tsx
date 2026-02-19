"use client";
import { Draggable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { Calendar, Trash2, ArrowUpCircle, MinusCircle, ArrowDownCircle } from 'lucide-react';
import { Task } from '@/types';

interface TaskCardProps {
    task: Task;
    index: number;
    onDelete: (id: number) => void;
    canDelete: boolean;
}

const priorityConfig = {
    low: { color: 'text-gray-500 bg-gray-100', icon: ArrowDownCircle },
    medium: { color: 'text-amber-600 bg-amber-50', icon: MinusCircle },
    high: { color: 'text-red-600 bg-red-50', icon: ArrowUpCircle },
};

export default function TaskCard({ task, index, onDelete, canDelete }: TaskCardProps) {
    const PriorityIcon = priorityConfig[task.priority]?.icon || MinusCircle;

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={clsx(
                        "group relative mb-3 rounded-xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200",
                        snapshot.isDragging && "shadow-xl ring-2 ring-primary-500 rotate-2 opacity-90"
                    )}
                >
                    <div className="flex justify-between items-start mb-3">
                        <span
                            className={clsx(
                                'flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                                priorityConfig[task.priority]?.color
                            )}
                        >
                            <PriorityIcon size={12} />
                            {task.priority}
                        </span>
                        {canDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent drag start when clicking delete
                                    onDelete(task.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1 hover:bg-red-50 rounded"
                                title="Delete Task"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 leading-tight">{task.title}</h3>

                    {task.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                    )}

                    {task.deadline && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 border-t border-gray-50 pt-3">
                            <Calendar size={12} />
                            <span>
                                {new Date(task.deadline).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}

"use client";
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { io } from 'socket.io-client';
import { Task } from '@/types';
import { motion } from 'framer-motion';

const socket = io('https://assignment-jlkw.onrender.com');

interface BoardProps {
    refreshTrigger: number;
}

export default function Board({ refreshTrigger }: BoardProps) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const columns = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'done': 'Done'
    };

    const columnConfig = {
        'todo': { color: 'border-t-4 border-t-gray-400', bg: 'bg-gray-50/80' },
        'in-progress': { color: 'border-t-4 border-t-blue-500', bg: 'bg-blue-50/50' },
        'done': { color: 'border-t-4 border-t-green-500', bg: 'bg-green-50/50' }
    }

    const fetchTasks = async () => {
        try {
            const res = await axios.get('https://assignment-jlkw.onrender.com/api/tasks?limit=100');
            setTasks(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchTasks();

        socket.on('taskCreated', (newTask: Task) => {
            setTasks(prev => [newTask, ...prev]);
        });

        socket.on('taskUpdated', (updatedTask: Task) => {
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        });

        socket.on('taskDeleted', (deletedId: number) => {
            setTasks(prev => prev.filter(t => t.id !== Number(deletedId)));
        });

        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        };
    }, [refreshTrigger]);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Optimistic Update
        const newStatus = destination.droppableId as Task['status'];
        const newTasks = tasks.map(t =>
            t.id.toString() === draggableId ? { ...t, status: newStatus } : t
        );
        setTasks(newTasks);

        try {
            await axios.put(`https://assignment-jlkw.onrender.com/api/tasks/${draggableId}`, { status: newStatus });
        } catch (err) {
            console.error('Failed to update task status', err);
            fetchTasks();
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this task?')) return;
        try {
            await axios.delete(`https://assignment-jlkw.onrender.com/api/tasks/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    if (!isMounted) return null;

    const getTasksByStatus = (status: string) => tasks.filter(task => task.status === status);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 overflow-x-auto pb-4">
                {Object.entries(columns).map(([columnId, columnTitle], colIndex) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: colIndex * 0.1 + 0.3 }}
                        key={columnId}
                        className={`flex h-full min-w-[340px] flex-col rounded-xl border border-gray-100 shadow-sm ${columnConfig[columnId as keyof typeof columnConfig].bg} backdrop-blur-sm`}
                    >
                        <div className={`p-4 rounded-t-xl bg-white/50 ${columnConfig[columnId as keyof typeof columnConfig].color}`}>
                            <h2 className="flex items-center justify-between text-sm font-bold text-gray-800 uppercase tracking-wide">
                                <span>{columnTitle}</span>
                                <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-gray-600 shadow-sm border border-gray-100">
                                    {getTasksByStatus(columnId).length}
                                </span>
                            </h2>
                        </div>

                        <Droppable droppableId={columnId}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 overflow-y-auto p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-primary-50/30' : ''}`}
                                >
                                    <div className="space-y-3">
                                        {getTasksByStatus(columnId).map((task, index) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                index={index}
                                                onDelete={handleDelete}
                                                canDelete={user?.role === 'admin' || user?.role === 'manager'}
                                            />
                                        ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </motion.div>
                ))}
            </div>
        </DragDropContext>
    );
}

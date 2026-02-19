"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import { X } from 'lucide-react';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
    deadline: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateTaskModal({ isOpen, onClose, onSuccess }: CreateTaskModalProps) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: 'medium'
        }
    });

    if (!isOpen) return null;

    const onSubmit = async (data: TaskFormData) => {
        try {
            await axios.post('https://assignment-jlkw.onrender.com/api/tasks', { ...data, status: 'todo' });
            reset();
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl transform transition-all scale-100 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">New Task</h2>
                        <p className="text-sm text-gray-500">Add a new item to your board</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Task Title"
                        placeholder="e.g., Redesign Homepage"
                        {...register('title')}
                        error={errors.title?.message}
                        autoFocus
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description')}
                            placeholder="Add details about this task..."
                            className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <div className="relative">
                                <select
                                    {...register('priority')}
                                    className="block w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <Input
                            label="Due Date"
                            type="date"
                            {...register('deadline')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>Create Task</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Board from '@/components/Board';
import { Button } from '@/components/ui/Button';
import CreateTaskModal from '@/components/CreateTaskModal';
import { LogOut, Plus, LayoutGrid, Bell, Settings, Search, Menu, ChevronDown, CheckCircle2, Clock, AlertCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminUserManagement from '@/components/AdminUserManagement';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState<'board' | 'users'>('board');

    // Mock stats - in a real app, calculate these from tasks data
    const stats = [
        { label: "Total Tasks", value: "12", icon: LayoutGrid, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "In Progress", value: "4", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Completed", value: "8", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        { label: "Urgent", value: "2", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen flex bg-gray-50/50 font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-gray-200/60 bg-white lg:block shadow-sm">
                <div className="flex h-20 items-center px-8 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            T
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">TaskFlow</span>
                    </div>
                </div>

                <div className="p-6 space-y-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                    <button
                        onClick={() => setActiveTab('board')}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeTab === 'board' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <LayoutGrid size={20} />
                        Dashboard
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                        <CheckCircle2 size={20} />
                        My Tasks
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                        <Bell size={20} />
                        Notifications
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">3</span>
                    </button>

                    {user.role === 'admin' && (
                        <>
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-2">Admin</div>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <Users size={20} />
                                User Management
                            </button>
                            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                                <Settings size={20} />
                                System Settings
                            </button>
                        </>
                    )}

                    {user.role !== 'admin' && (
                        <>
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-2">Settings</div>
                            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                                <Settings size={20} />
                                Preferences
                            </button>
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-semibold shadow-md">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{user.username}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium truncate">{user.role}</div>
                        </div>
                    </div>
                    <Button variant="outline" onClick={logout} className="w-full justify-center text-red-500 hover:bg-red-50 hover:text-red-700 border-red-100 hover:border-red-200 text-xs h-9">
                        <LogOut size={14} className="mr-2" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200/60 bg-white/80 backdrop-blur-xl px-8 transition-all">
                    <div className="flex items-center gap-4 lg:hidden">
                        <Button variant="ghost" size="sm"><Menu size={20} /></Button>
                        <span className="font-bold text-lg">TaskFlow</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 text-gray-400 bg-gray-100 rounded-lg px-3 py-2 w-96 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100 focus-within:text-gray-600">
                        <Search size={18} />
                        <input type="text" placeholder="Search tasks, projects..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700" />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary-600 to-primary-500 border-none"
                        >
                            <Plus size={18} className="mr-2" />
                            Create Task
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-x-auto p-8 space-y-8">
                    {activeTab === 'board' ? (
                        <>
                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={stat.label}
                                        className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                                            </div>
                                            <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                                                <stat.icon size={24} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Board Area */}
                            <div className="h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Project Board</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Filter by:</span>
                                        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm hover:bg-gray-50">
                                            All Members <ChevronDown size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-white/40 p-1 rounded-3xl">
                                    <Board refreshTrigger={refreshTrigger} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage user access and roles</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                                <AdminUserManagement />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />
        </div>
    );
}

"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { Trash2, Shield, RefreshCw, User as UserIcon, Check } from 'lucide-react';
import * as Select from '@radix-ui/react-select';

export default function AdminUserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://assignment-jlkw.onrender.com/api/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`https://assignment-jlkw.onrender.com/api/auth/users/${id}`);
            setUsers(prev => prev.filter(u => u.userId !== id));
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    const updateUserRole = async (id: number, newRole: string) => {
        try {
            await axios.put(`https://assignment-jlkw.onrender.com/api/auth/users/${id}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u.userId === id ? { ...u, role: newRole as any } : u));
        } catch (err) {
            console.error('Failed to update role', err);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const roleColors = {
        'admin': 'bg-purple-100 text-purple-700 border-purple-200',
        'manager': 'bg-blue-100 text-blue-700 border-blue-200',
        'user': 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">System Users</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage access control and user roles</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchUsers} isLoading={loading} className="bg-white hover:bg-gray-50">
                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assign Role</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.userId} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                ID: <span className="font-mono">{user.userId}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                                        {user.role === 'admin' && <Shield size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.role !== 'admin' || user.userId !== 1 ? ( // Ideally check if it's NOT the current super admin
                                        <div className="relative w-40">
                                            <select
                                                value={user.role}
                                                onChange={(e) => updateUserRole(user.userId, e.target.value)}
                                                className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all cursor-pointer hover:border-gray-300"
                                            >
                                                <option value="user">User</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Locked</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {user.role !== 'admin' && ( // Prevent deleting admins roughly
                                        <button
                                            onClick={() => deleteUser(user.userId)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg group"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} className="group-hover:stroke-red-600" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <UserIcon size={48} className="text-gray-200 mb-4" />
                                        <p>No users found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

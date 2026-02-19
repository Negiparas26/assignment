export interface User {
    userId: number;
    username: string;
    role: 'admin' | 'manager' | 'user';
}

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'done';
    deadline: string;
    assignedTo?: number;
}


export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'todo' | 'completed' | 'pending'
    createdAt: string;
    updatedAt: string;
}

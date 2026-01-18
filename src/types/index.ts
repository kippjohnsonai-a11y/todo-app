export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: Priority;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type TaskUpdate = Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>;

export const priorityColors: Record<Priority, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  high: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};

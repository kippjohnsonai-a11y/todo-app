import { useState } from 'react';
import type { Task, Priority } from '../types';
import { priorityColors } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<{ success: boolean; error?: string }>;
  onUpdate: (id: string, updates: { title?: string; description?: string; priority?: Priority }) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await onToggle(task.id);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setLoading(true);
    const result = await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
    });
    if (result.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    await onDelete(task.id);
    setLoading(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const priorities: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const colors = priorityColors[task.priority];

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-3"
        />
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-sm text-gray-500">Priority:</span>
          {priorities.map(({ value, label }) => {
            const pColors = priorityColors[value];
            const isSelected = editPriority === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setEditPriority(value)}
                className={`px-3 py-1 text-sm rounded-full border transition-all ${
                  isSelected
                    ? `${pColors.bg} ${pColors.text} ${pColors.border} border-2`
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !editTitle.trim()}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-opacity ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text}`}>
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className={`mt-1 text-sm text-gray-500 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

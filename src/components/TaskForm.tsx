import { useState } from 'react';
import type { Priority } from '../types';
import { priorityColors } from '../types';

interface TaskFormProps {
  onSubmit: (title: string, priority: Priority, description?: string) => Promise<{ success: boolean; error?: string }>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const result = await onSubmit(title.trim(), priority, description.trim() || undefined);

    if (result.success) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowDescription(false);
    } else {
      setError(result.error || 'Failed to add task');
    }

    setLoading(false);
  };

  const priorities: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-500">Priority:</span>
        <div className="flex gap-2">
          {priorities.map(({ value, label }) => {
            const colors = priorityColors[value];
            const isSelected = priority === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setPriority(value)}
                className={`px-3 py-1 text-sm rounded-full border transition-all ${
                  isSelected
                    ? `${colors.bg} ${colors.text} ${colors.border} border-2`
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        {!showDescription ? (
          <button
            type="button"
            onClick={() => setShowDescription(true)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            + Add description
          </button>
        ) : (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        )}
      </div>
    </form>
  );
}

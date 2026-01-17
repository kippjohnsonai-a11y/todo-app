import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import type { User } from '@supabase/supabase-js';

function TaskManager({ user }: { user: User }) {
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleComplete } = useTasks(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={user.email || 'User'} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <TaskForm onSubmit={addTask} />
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onToggle={toggleComplete}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <TaskManager user={user} />;
}

export default App;

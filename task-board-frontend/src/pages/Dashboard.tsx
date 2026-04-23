import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTaskStatus } from '../api/tasks';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, LayoutDashboard, Plus } from 'lucide-react';
import { TaskForm } from '../components/TaskForm';


export const Dashboard = () => {
  const { logout, user } = useAuthStore();

  const queryClient = useQueryClient();
  
  // TanStack Query handles the "Loading" and "Error" states for us automatically
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const updateMutation = useMutation({
  mutationFn: updateTaskStatus,

  onMutate: async (updatedTask) => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });

    const previousTasks = queryClient.getQueryData(['tasks']);

    queryClient.setQueryData(['tasks'], (old: any) =>
      (old as any[] ?? []).map(...) =>
        t.id === updatedTask.id
          ? { ...t, status: updatedTask.status }
          : t
      )
    );

    return { previousTasks };
  },

  onError: (_err, _updatedTask, context: any) => {
    queryClient.setQueryData(['tasks'], context.previousTasks);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});


  const toggleTaskStatus = (task: any) => {
  updateMutation.mutate({
    id: task.id,
    status: task.status === 'done' ? 'pending' : 'done',
  });
};
const [showForm, setShowForm] = useState(false);
const isUpdating = updateMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-blue-500" /> TaskBoard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Welcome, {user?.email}</span>
          <button 
            onClick={logout} 
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Your Tasks</h2>
     <button onClick={() => setShowForm(true)}
         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> New Task
     </button>
        </header>
        {showForm && <TaskForm onSuccess={() => setShowForm(false)} />}

        {isLoading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading board...</div>
        ) : error ? (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-900">
            Error loading tasks. Please try refreshing.
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks?.map((task) => (
              <div key={task.id} onClick={() => toggleTaskStatus(task)}  className={`bg-slate-800 p-4 rounded-xl border transition-colors cursor-pointer ${
    isUpdating ? 'opacity-50' : 'hover:border-slate-600'
  }`}>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                <div className="mt-4">
                  <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                    task.status === 'done' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
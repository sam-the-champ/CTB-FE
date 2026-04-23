import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTaskStatus } from '../api/tasks';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, LayoutDashboard, Plus } from 'lucide-react';
import { TaskForm } from '../components/TaskForm';

type Filter = 'all' | 'pending' | 'done';

export const Dashboard = () => {
  const { logout, user } = useAuthStore();
  const [filter, setFilter] = useState<Filter>('all');

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

      queryClient.setQueryData(['tasks'], (old: any[] = []) =>
        old.map((t) =>
          t.id === updatedTask.id
            ? { ...t, ...updatedTask }
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

  // — UI-only derived values —
  const totalCount = tasks?.length ?? 0;
  const doneCount = tasks?.filter((t: any) => t.status === 'done').length ?? 0;
  const progressPct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const allDone = totalCount > 0 && doneCount === totalCount;

  const filteredTasks = tasks?.filter((t: any) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const TABS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0e0d',
      color: '#f0ebe2',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', top: -140, left: -140, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(210,140,40,0.09) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: -100, right: -100, width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(210,140,40,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,14,13,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(210,140,40,0.15)',
        padding: '0 clamp(1rem, 4vw, 2rem)',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h1 style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(16px, 4vw, 20px)',
          color: '#f0ebe2', margin: 0, whiteSpace: 'nowrap',
        }}>
          <LayoutDashboard size={18} style={{ color: '#d28c28', flexShrink: 0 }} />
          TaskBoard
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)', minWidth: 0 }}>
          <span style={{
            fontSize: 'clamp(11px, 2.5vw, 13px)', color: '#7a7468',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 'clamp(80px, 30vw, 220px)',
          }}>
            {user?.email}
          </span>
          <button
            onClick={logout}
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'transparent', border: '0.5px solid #2e2c28',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#7a7468',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(210,140,40,0.5)';
              (e.currentTarget as HTMLButtonElement).style.color = '#d28c28';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2c28';
              (e.currentTarget as HTMLButtonElement).style.color = '#7a7468';
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </nav>

      {/* Page body */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 720, margin: '0 auto',
        padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 1.5rem)',
        boxSizing: 'border-box', width: '100%',
      }}>

        {/* Section header */}
        <header style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(22px, 5vw, 30px)',
              color: '#f0ebe2', margin: '0 0 2px', letterSpacing: '-0.3px',
            }}>
              Your Tasks
            </h2>
            <p style={{ fontSize: 12.5, color: '#5a5448', margin: 0 }}>
              {doneCount} of {totalCount} completed
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#d28c28', border: 'none',
              borderRadius: 9, color: '#0f0e0d',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 500,
              padding: '8px 16px', cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ba7a1e'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#d28c28'; }}
          >
            <Plus size={15} /> New Task
          </button>
        </header>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              height: 4, borderRadius: 99,
              background: '#2a2824', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: allDone
                  ? 'linear-gradient(90deg, #d28c28, #f0b84a)'
                  : '#d28c28',
                width: `${progressPct}%`,
                transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 6, fontSize: 11.5, color: '#4a4740',
            }}>
              <span>{allDone ? '🎉 All tasks complete!' : `${progressPct}% done`}</span>
              <span>{totalCount} task{totalCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {totalCount > 0 && (
          <div style={{
            display: 'flex', gap: 6,
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}>
            {TABS.map(tab => {
              const count = tab.key === 'all'
                ? totalCount
                : tasks?.filter((t: any) => t.status === tab.key).length ?? 0;
              const isActive = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    background: isActive ? 'rgba(210,140,40,0.12)' : 'transparent',
                    border: isActive ? '0.5px solid rgba(210,140,40,0.4)' : '0.5px solid #2e2c28',
                    borderRadius: 8,
                    color: isActive ? '#d28c28' : '#5a5448',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12.5, fontWeight: 500,
                    padding: '5px 12px', cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontSize: 10.5,
                    background: isActive ? 'rgba(210,140,40,0.2)' : '#2a2824',
                    color: isActive ? '#d28c28' : '#4a4740',
                    borderRadius: 4, padding: '1px 6px',
                    transition: 'all 0.15s',
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Task form */}
        {showForm && <TaskForm onSuccess={() => setShowForm(false)} />}

        {/* States */}
        {isLoading ? (
          <div style={{
            textAlign: 'center', padding: '5rem 1rem',
            color: '#5a5448', fontSize: 14,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '2px solid #2e2c28', borderTopColor: '#d28c28',
              margin: '0 auto 1rem',
              animation: 'db-spin 0.8s linear infinite',
            }} />
            Loading board...
          </div>
        ) : error ? (
          <div style={{
            background: 'rgba(227,76,60,0.08)',
            border: '0.5px solid rgba(227,76,60,0.3)',
            borderRadius: 10, padding: '14px 16px',
            fontSize: 13.5, color: '#e34c3c',
          }}>
            Error loading tasks. Please try refreshing.
          </div>
        ) : filteredTasks?.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 1rem', color: '#3a3830',
          }}>
            <div style={{ fontSize: 32, marginBottom: '0.75rem', opacity: 0.35 }}>◻</div>
            <p style={{ fontSize: 14, margin: 0 }}>
              {filter === 'all'
                ? 'No tasks yet. Create one to get started.'
                : `No ${filter} tasks.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredTasks?.map((task: any, index: number) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task)}
                style={{
                  background: '#1a1916',
                  border: task.status === 'done'
                    ? '0.5px solid rgba(210,140,40,0.25)'
                    : '0.5px solid #2e2c28',
                  borderLeft: task.status === 'done'
                    ? '2px solid #d28c28'
                    : '2px solid #2e2c28',
                  borderRadius: 12,
                  padding: 'clamp(14px, 3vw, 18px) clamp(14px, 3vw, 20px)',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  opacity: isUpdating ? 0.5 : 1,
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  boxSizing: 'border-box', width: '100%', overflow: 'hidden',
                  // staggered entrance
                  animation: `card-in 0.3s cubic-bezier(0.16,1,0.3,1) both`,
                  animationDelay: `${index * 55}ms`,
                  transition: 'border-color 0.2s, opacity 0.2s, border-left-color 0.3s',
                }}
                onMouseEnter={e => {
                  if (!isUpdating) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(210,140,40,0.4)';
                }}
                onMouseLeave={e => {
                  if (!isUpdating) (e.currentTarget as HTMLDivElement).style.borderColor =
                    task.status === 'done' ? 'rgba(210,140,40,0.25)' : '#2e2c28';
                }}
              >
                {/* Checkbox */}
                <div style={{
                  flexShrink: 0, marginTop: 3,
                  width: 18, height: 18, borderRadius: '50%',
                  border: task.status === 'done' ? '2px solid #d28c28' : '1.5px solid #3a3830',
                  background: task.status === 'done' ? 'rgba(210,140,40,0.15)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {task.status === 'done' && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#d28c28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{
                    fontSize: 'clamp(14px, 3vw, 15px)', fontWeight: 500,
                    color: task.status === 'done' ? '#5a5448' : '#f0ebe2',
                    margin: '0 0 4px',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                  }}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={{
                      fontSize: 'clamp(12px, 2.5vw, 13px)', color: '#4a4740',
                      margin: '0 0 10px', lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {task.description}
                    </p>
                  )}
                  <span style={{
                    display: 'inline-block',
                    fontSize: 10.5, fontWeight: 500,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                    padding: '3px 9px', borderRadius: 5,
                    background: task.status === 'done'
                      ? 'rgba(210,140,40,0.1)' : 'rgba(255,255,255,0.04)',
                    color: task.status === 'done' ? '#d28c28' : '#5a5448',
                    border: task.status === 'done'
                      ? '0.5px solid rgba(210,140,40,0.3)' : '0.5px solid #2e2c28',
                    transition: 'all 0.2s',
                  }}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes db-spin { to { transform: rotate(360deg); } }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
};
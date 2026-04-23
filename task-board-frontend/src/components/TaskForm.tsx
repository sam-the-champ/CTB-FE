// src/components/TaskForm.tsx

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/tasks";

export const TaskForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      // invalidate tasks cache → triggers refetch automatically
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      onSuccess(); // optional UI reset (close modal, clear form, etc.)
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    mutation.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    });

    e.currentTarget.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#1a1916',
        border: '0.5px solid rgba(210,140,40,0.3)',
        borderRadius: 14,
        padding: 'clamp(1.25rem, 4vw, 1.75rem)',
        marginBottom: '1.5rem',
        animation: 'tf-slidein 0.22s cubic-bezier(0.16,1,0.3,1)',
        boxSizing: 'border-box',
      }}
    >
      <h3 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 18, color: '#f0ebe2',
        margin: '0 0 1.25rem', letterSpacing: '-0.2px',
      }}>
        New Task
      </h3>

      {/* Title */}
      <div style={{ marginBottom: 10 }}>
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 500,
          color: '#a09880', letterSpacing: '0.07em',
          textTransform: 'uppercase', marginBottom: 5,
        }}>
          Title <span style={{ color: '#d28c28' }}>*</span>
        </label>
        <input
          name="title"
          placeholder="What needs to be done?"
          required
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#111009',
            border: '0.5px solid #2e2c28',
            borderRadius: 9, color: '#f0ebe2',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, padding: '10px 14px',
            outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(210,140,40,0.5)';
            e.target.style.boxShadow = '0 0 0 3px rgba(210,140,40,0.08)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#2e2c28';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 500,
          color: '#a09880', letterSpacing: '0.07em',
          textTransform: 'uppercase', marginBottom: 5,
        }}>
          Description
        </label>
        <textarea
          name="description"
          placeholder="Add some details..."
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#111009',
            border: '0.5px solid #2e2c28',
            borderRadius: 9, color: '#f0ebe2',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, padding: '10px 14px',
            outline: 'none', resize: 'vertical',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            lineHeight: 1.6,
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(210,140,40,0.5)';
            e.target.style.boxShadow = '0 0 0 3px rgba(210,140,40,0.08)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#2e2c28';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onSuccess}
          style={{
            background: 'transparent',
            border: '0.5px solid #2e2c28',
            borderRadius: 9, color: '#7a7468',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 500,
            padding: '8px 16px', cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#5a5448';
            (e.currentTarget as HTMLButtonElement).style.color = '#a09880';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2c28';
            (e.currentTarget as HTMLButtonElement).style.color = '#7a7468';
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={mutation.isPending}
          style={{
            background: mutation.isPending ? '#8a5c18' : '#d28c28',
            border: 'none', borderRadius: 9,
            color: '#0f0e0d',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 500,
            padding: '8px 20px', cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            opacity: mutation.isPending ? 0.6 : 1,
            transition: 'background 0.2s, opacity 0.2s',
            display: 'flex', alignItems: 'center', gap: 7,
          }}
          onMouseEnter={e => {
            if (!mutation.isPending) (e.currentTarget as HTMLButtonElement).style.background = '#ba7a1e';
          }}
          onMouseLeave={e => {
            if (!mutation.isPending) (e.currentTarget as HTMLButtonElement).style.background = '#d28c28';
          }}
        >
          {mutation.isPending && (
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              border: '2px solid rgba(15,14,13,0.3)',
              borderTopColor: '#0f0e0d',
              display: 'inline-block',
              animation: 'db-spin 0.8s linear infinite',
            }} />
          )}
          {mutation.isPending ? 'Creating...' : 'Create Task'}
        </button>
      </div>

      <style>{`
        @keyframes tf-slidein {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </form>
  );
};
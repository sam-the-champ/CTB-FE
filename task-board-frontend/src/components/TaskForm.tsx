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
      className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8"
    >
      <input
        name="title"
        placeholder="Task Title"
        className="w-full bg-slate-900 p-2 rounded mb-2"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full bg-slate-900 p-2 rounded mb-4"
      />

      <button
        disabled={mutation.isPending}
        className="bg-blue-600 px-4 py-2 rounded font-bold disabled:opacity-50"
      >
        {mutation.isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
};
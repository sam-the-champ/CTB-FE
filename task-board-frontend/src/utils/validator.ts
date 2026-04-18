import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

// We can also create a specific schema for Tasks while we are here
export const TaskSchema = z.object({
  title: z.string().min(3, { message: "Title is too short" }).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type TaskInput = z.infer<typeof TaskSchema>;
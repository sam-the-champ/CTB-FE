export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  user_id: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}
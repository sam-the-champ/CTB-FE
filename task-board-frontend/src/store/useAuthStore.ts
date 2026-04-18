import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User | null, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => {
    // Update the global window variable for the Axios interceptor
    window.accessToken = accessToken; 
    set({ user, accessToken });
  },
  logout: () => {
    window.accessToken = null;
    set({ user: null, accessToken: null });
  },
}));
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  // If there's no user and no token, kick them back to login
  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the "protected" children (the Dashboard)
  return <Outlet />;
};
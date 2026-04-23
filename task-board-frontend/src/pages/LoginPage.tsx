import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { RegisterSchema } from '../utils/validator'; // Re-use your Zod schema!
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken } = response.data;
      
      // Update global state
      setAuth(user, accessToken);
      
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0f0e0d', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Ambient glow top-left */}
      <div style={{
        position: 'fixed', top: -120, left: -120, width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(210,140,40,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Ambient glow bottom-right */}
      <div style={{
        position: 'fixed', bottom: -80, right: -80, width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(210,140,40,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div className="max-w-md w-full relative z-10" style={{
        background: '#1a1916',
        border: '0.5px solid rgba(210,140,40,0.22)',
        borderRadius: 18,
        padding: '2.5rem 2.25rem',
      }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{
            width: 46, height: 46, borderRadius: 12, margin: '0 auto 1.25rem',
            background: 'rgba(210,140,40,0.12)',
            border: '0.5px solid rgba(210,140,40,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogIn size={22} style={{ color: '#d28c28' }} />
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 26, letterSpacing: '-0.3px',
            color: '#f0ebe2', margin: '0 0 4px',
          }}>Welcome Back</h1>
          <p style={{ fontSize: 13.5, color: '#7a7468', margin: 0 }}>
            Sign in to manage your Task Board
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {error && (
            <div style={{
              background: 'rgba(227,76,60,0.1)',
              border: '0.5px solid rgba(227,76,60,0.3)',
              borderRadius: 8, padding: '10px 12px',
              fontSize: 13, color: '#e34c3c',
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: 11.5, fontWeight: 500,
              color: '#a09880', letterSpacing: '0.06em',
              textTransform: 'uppercase', marginBottom: 6,
            }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: '#5a5448',
              }} />
              <input
                {...register('email')}
                placeholder="you@company.com"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#111009',
                  border: errors.email ? '0.5px solid rgba(227,76,60,0.5)' : '0.5px solid #2e2c28',
                  borderRadius: 9, color: '#f0ebe2',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14, padding: '10px 14px 10px 38px', outline: 'none',
                }}
              />
            </div>
            {errors.email && (
              <p style={{ fontSize: 12, color: '#e34c3c', marginTop: 4 }}>
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: 11.5, fontWeight: 500,
              color: '#a09880', letterSpacing: '0.06em',
              textTransform: 'uppercase', marginBottom: 6,
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', color: '#5a5448',
              }} />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#111009',
                  border: errors.password ? '0.5px solid rgba(227,76,60,0.5)' : '0.5px solid #2e2c28',
                  borderRadius: 9, color: '#f0ebe2',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14, padding: '10px 14px 10px 38px', outline: 'none',
                }}
              />
            </div>
            {errors.password && (
              <p style={{ fontSize: 12, color: '#e34c3c', marginTop: 4 }}>
                {errors.password.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', background: isLoading ? '#8a5c18' : '#d28c28',
              border: 'none', borderRadius: 9, color: '#0f0e0d',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 500, padding: '11px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.02em', marginTop: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: isLoading ? 0.6 : 1,
              transition: 'background 0.2s, opacity 0.2s',
            }}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div style={{ height: '0.5px', background: '#2a2824', margin: '1.6rem 0 1.25rem' }} />
        <p style={{ textAlign: 'center', fontSize: 12.5, color: '#4a4740', margin: 0 }}>
          No account yet?{' '}
          <a href="/RegisterPage" style={{ color: '#d28c28', textDecoration: 'none' }}>Create one free</a>
        </p>
      </div>

      {/* Google Font import — add to your index.html or global CSS instead */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
    </div>
  );
};
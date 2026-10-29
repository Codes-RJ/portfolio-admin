import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, session, signIn, usingSupabaseAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (session) {
      const requested = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from;
      const destination = requested?.pathname?.startsWith('/admin')
        ? `${requested.pathname}${requested.search || ''}`
        : '/admin';
      navigate(destination, { replace: true });
    }
  }, [location.state, navigate, session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard bot attempt

    if (!email.trim() || !password) {
      setError('Please provide your admin email and security password.');
      return;
    }

    setAuthSubmitting(true);
    setError('');

    try {
      const result = await signIn(email, password);
      if (result.error) setError(result.error);
    } catch {
      setError('Sign-in failed. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-primary)]/15 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md px-4 relative z-10 space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-[var(--color-primary)] to-brand-600 p-0.5 shadow-xl">
            <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center font-bold text-white text-2xl">
              R<span className="text-[var(--color-primary-light)]">OS</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to manage your portfolio content and settings
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-2xl space-y-6">
          {error && (
            <div role="alert" className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="admin_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={usingSupabaseAuth ? 'you@example.com' : 'admin@rohanos.local'}
                  disabled={loading || authSubmitting}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5">
                <label htmlFor="admin-password" className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={loading || authSubmitting}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || authSubmitting}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[var(--color-primary)] to-brand-600 hover:from-[var(--color-primary-strong)] hover:to-brand-700 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {authSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => void signIn('demo@rohanos.local', 'demo')}
              className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Studio as Recruiter (Demo Sandbox)</span>
            </button>
          </form>
        </div>

        {/* Security & Protection Notice */}
        <div className="p-4 rounded-2xl glass-panel text-center space-y-1 border border-gray-200/60 dark:border-gray-800/60">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>Secure Admin Portal · Authorized Access Only</span>
          </p>
        </div>
      </div>
    </div>
  );
};

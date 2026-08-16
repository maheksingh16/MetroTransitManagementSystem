import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, TrainFront } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { parseApiError, getErrorStatus } from '../../lib/api';

export function Login() {
  const navigate = useNavigate();
  const { login, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation is handled by App routing once role is set; but we can push directly.
      // We'll let the effect in App handle it, but for safety navigate after a tick.
      setTimeout(() => {
        if (role === 'ADMIN') navigate('/admin', { replace: true });
        else if (role === 'OFFICE_STAFF') navigate('/staff', { replace: true });
        else navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      const status = getErrorStatus(err);
      const msg = parseApiError(err);
      if (status === 401 || status === 403) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(msg || 'Unable to sign in. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-metro-blue-50/30 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-metro-blue-700 to-metro-blue-900 flex items-center justify-center shadow-xl shadow-metro-blue-700/25 border border-gold-400/50">
              <TrainFront className="w-7 h-7 text-gold-300" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-metro-blue-900">METRO</h1>
              <p className="text-xs font-semibold tracking-[0.25em] text-gold-600 uppercase">Transit</p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl shadow-slate-200/60 border-slate-200/80">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to book tickets and manage your journeys</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-metro-blue-700 hover:text-metro-blue-800">
              Create one
            </Link>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Metro Transit. All rights reserved.
        </p>
      </div>
    </div>
  );
}

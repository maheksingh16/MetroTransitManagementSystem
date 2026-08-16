import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Phone, TrainFront } from 'lucide-react';
import { register as apiRegister } from '../../lib/api';
import type { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { parseApiError } from '../../lib/api';

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await apiRegister({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        role: 'PASSENGER',
      } as User);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      console.error('Registration error:', err);
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-metro-blue-50/30 to-slate-100 p-4">
      <div className="w-full max-w-lg">
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
            <p className="text-sm text-slate-500">Start booking metro tickets seamlessly</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                placeholder="John"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                required
                leftIcon={<UserIcon className="w-4 h-4" />}
              />
              <Input
                label="Last name"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                required
                leftIcon={<UserIcon className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone number"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phoneNumber}
              onChange={(e) => update('phoneNumber', e.target.value)}
              required
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
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
              <Input
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-metro-blue-700 hover:text-metro-blue-800">
              Sign in
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

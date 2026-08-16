import { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Loading } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { updateUser, parseApiError } from '../../lib/api';
import { getInitials } from '../../lib/utils';
import { Toast } from '../../components/common/Toast';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setError('');
    try {
      await updateUser(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        role: user.role,
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading profile..." />;
  }

  if (!user) {
    return <ErrorDisplay title="Not signed in" message="Please sign in to view your profile." />;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {success && <Toast type="success" message="Profile updated successfully" onClose={() => setSuccess(false)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your personal information.</p>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-metro-blue-100 to-gold-100 flex items-center justify-center text-metro-blue-800 font-bold text-xl border border-gold-200/60">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div>
              <CardTitle>{user.firstName} {user.lastName}</CardTitle>
              <CardDescription>Passenger account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                required
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Last name"
                value={form.lastName}
                onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                required
                leftIcon={<User className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Email address"
              type="email"
              value={user.email}
              disabled
              helper="Email cannot be changed."
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Phone number"
              value={form.phoneNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              required
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Role"
              value={user.role}
              disabled
              helper="Contact admin to change your role."
              leftIcon={<Shield className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-5">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Password changes are not supported by the backend. Please contact support if you
            need to reset your password.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

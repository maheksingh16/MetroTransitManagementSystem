import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { getAllUsers, createUser, updateUser, deleteUser, parseApiError } from '../../lib/api';
import type { User } from '../../types';
import { getRoleColor } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';

const roleOptions = [
  { value: 'PASSENGER', label: 'Passenger' },
  { value: 'OFFICE_STAFF', label: 'Office Staff' },
  { value: 'ADMIN', label: 'Admin' },
];

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'PASSENGER' as User['role'],
  });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setError('Unable to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', role: 'PASSENGER' });
    setEditingUser(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: '',
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          role: form.role,
        });
        setToast({ message: 'User updated successfully', type: 'success' });
      } else {
        await createUser({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          role: form.role,
        } as User);
        setToast({ message: 'User created successfully', type: 'success' });
      }
      setIsModalOpen(false);
      resetForm();
      await load();
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      setToast({ message: 'User deleted successfully', type: 'success' });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500">Manage passenger, staff, and admin accounts.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add User
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'firstName', header: 'Name', render: (u) => `${u.firstName} ${u.lastName}` },
          { key: 'email', header: 'Email' },
          { key: 'phoneNumber', header: 'Phone' },
          {
            key: 'role',
            header: 'Role',
            render: (u) => (
              <span className={getRoleColor(u.role)}>
                <Badge variant="default">{u.role.replace('_', ' ')}</Badge>
              </span>
            ),
          },
        ]}
        data={users}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(u) => u.id}
        emptyTitle="No users found"
        emptyDescription="Get started by adding a new user."
        emptyAction={{ label: 'Add User', onClick: openCreate }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add User'}
        description={editingUser ? 'Update user details.' : 'Create a new user account.'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              value={form.firstName}
              onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              required
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={form.email}
            disabled={!!editingUser}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={form.phoneNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            required
          />
          {!editingUser && (
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required={!editingUser}
            />
          )}
          <Select
            label="Role"
            options={roleOptions}
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as User['role'] }))}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

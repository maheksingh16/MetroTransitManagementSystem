import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { getAllRoutes, createRoute, updateRoute, deleteRoute, parseApiError } from '../../lib/api';
import type { Route } from '../../types';

const activeOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export function AdminRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Route | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({ routeName: '', estimatedTimeMinutes: '', active: 'true' });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllRoutes();
      setRoutes(data);
    } catch {
      setError('Unable to load routes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ routeName: '', estimatedTimeMinutes: '', active: 'true' });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (route: Route) => {
    setEditing(route);
    setForm({
      routeName: route.routeName,
      estimatedTimeMinutes: String(route.estimatedTimeMinutes),
      active: String(route.active),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        routeName: form.routeName,
        estimatedTimeMinutes: Number(form.estimatedTimeMinutes),
        active: form.active === 'true',
      };
      if (editing) {
        await updateRoute(editing.id, payload);
        setToast({ message: 'Route updated successfully', type: 'success' });
      } else {
        await createRoute({ ...payload, routeStations: [] });
        setToast({ message: 'Route created successfully', type: 'success' });
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
      await deleteRoute(deleteTarget.id);
      setToast({ message: 'Route deleted successfully', type: 'success' });
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
          <h1 className="text-2xl font-bold text-slate-900">Routes</h1>
          <p className="text-slate-500">Manage metro routes and estimated travel times.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Route
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'routeName', header: 'Route Name' },
          { key: 'estimatedTimeMinutes', header: 'Est. Time (min)' },
          {
            key: 'active',
            header: 'Status',
            render: (r) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${r.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {r.active ? 'Active' : 'Inactive'}
              </span>
            ),
          },
        ]}
        data={routes}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(r) => r.id}
        emptyTitle="No routes found"
        emptyDescription="Create your first route."
        emptyAction={{ label: 'Add Route', onClick: openCreate }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Route' : 'Add Route'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Route Name"
            value={form.routeName}
            onChange={(e) => setForm((prev) => ({ ...prev, routeName: e.target.value }))}
            required
          />
          <Input
            label="Estimated Time (minutes)"
            type="number"
            min={1}
            value={form.estimatedTimeMinutes}
            onChange={(e) => setForm((prev) => ({ ...prev, estimatedTimeMinutes: e.target.value }))}
            required
          />
          <Select
            label="Status"
            options={activeOptions}
            value={form.active}
            onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.value }))}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editing ? 'Save Changes' : 'Create Route'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Route"
        message={`Are you sure you want to delete ${deleteTarget?.routeName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { getAllSchedules, getAllRoutes, getAllTrains, createSchedule, updateSchedule, deleteSchedule, parseApiError } from '../../lib/api';
import type { Schedule, Route, Train } from '../../types';
import { formatDateTime } from '../../lib/utils';

const activeOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export function AdminSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    routeId: '',
    trainId: '',
    departureTime: '',
    arrivalTime: '',
    fare: '',
    active: 'true',
  });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [sch, r, t] = await Promise.all([getAllSchedules(), getAllRoutes(), getAllTrains()]);
      setSchedules(sch);
      setRoutes(r);
      setTrains(t);
    } catch {
      setError('Unable to load schedules.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ routeId: '', trainId: '', departureTime: '', arrivalTime: '', fare: '', active: 'true' });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (schedule: Schedule) => {
    setEditing(schedule);
    setForm({
      routeId: String(schedule.route.id),
      trainId: String(schedule.train.id),
      departureTime: schedule.departureTime.slice(0, 16),
      arrivalTime: schedule.arrivalTime.slice(0, 16),
      fare: String(schedule.fare),
      active: String(schedule.active),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const route = routes.find((r) => r.id === Number(form.routeId));
      const train = trains.find((t) => t.id === Number(form.trainId));
      if (!route || !train) throw new Error('Route or train not found');

      const payload = {
        route,
        train,
        departureTime: new Date(form.departureTime).toISOString(),
        arrivalTime: new Date(form.arrivalTime).toISOString(),
        fare: Number(form.fare),
        active: form.active === 'true',
      };

      if (editing) {
        await updateSchedule(editing.id, payload);
        setToast({ message: 'Schedule updated successfully', type: 'success' });
      } else {
        await createSchedule(payload);
        setToast({ message: 'Schedule created successfully', type: 'success' });
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
      await deleteSchedule(deleteTarget.id);
      setToast({ message: 'Schedule deleted successfully', type: 'success' });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const routeOptions = routes.map((r) => ({ value: String(r.id), label: r.routeName }));
  const trainOptions = trains.map((t) => ({ value: String(t.id), label: t.trainNumber }));

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedules</h1>
          <p className="text-slate-500">Manage train schedules, timings, and fares.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Schedule
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'route', header: 'Route', render: (s) => s.route.routeName },
          { key: 'train', header: 'Train', render: (s) => s.train.trainNumber },
          { key: 'departureTime', header: 'Departure', render: (s) => formatDateTime(s.departureTime) },
          { key: 'arrivalTime', header: 'Arrival', render: (s) => formatDateTime(s.arrivalTime) },
          { key: 'fare', header: 'Fare', render: (s) => `₹${s.fare.toFixed(2)}` },
          {
            key: 'active',
            header: 'Status',
            render: (s) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {s.active ? 'Active' : 'Inactive'}
              </span>
            ),
          },
        ]}
        data={schedules}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(s) => s.id}
        emptyTitle="No schedules found"
        emptyDescription="Create your first schedule."
        emptyAction={{ label: 'Add Schedule', onClick: openCreate }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Schedule' : 'Add Schedule'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Route"
            options={routeOptions}
            value={form.routeId}
            onChange={(e) => setForm((prev) => ({ ...prev, routeId: e.target.value }))}
            required
          />
          <Select
            label="Train"
            options={trainOptions}
            value={form.trainId}
            onChange={(e) => setForm((prev) => ({ ...prev, trainId: e.target.value }))}
            required
          />
          <Input
            label="Departure Time"
            type="datetime-local"
            value={form.departureTime}
            onChange={(e) => setForm((prev) => ({ ...prev, departureTime: e.target.value }))}
            required
          />
          <Input
            label="Arrival Time"
            type="datetime-local"
            value={form.arrivalTime}
            onChange={(e) => setForm((prev) => ({ ...prev, arrivalTime: e.target.value }))}
            required
          />
          <Input
            label="Fare (₹)"
            type="number"
            step="0.01"
            min={0}
            value={form.fare}
            onChange={(e) => setForm((prev) => ({ ...prev, fare: e.target.value }))}
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
              {editing ? 'Save Changes' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Schedule"
        message={`Delete schedule for ${deleteTarget?.route.routeName} / ${deleteTarget?.train.trainNumber}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

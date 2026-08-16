import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { getAllBookings, getAllSchedules, updateBooking, deleteBooking, parseApiError } from '../../lib/api';
import type { Booking, Schedule } from '../../types';
import { formatDate } from '../../lib/utils';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'CHECKED_IN', label: 'Checked In' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'EXPIRED', label: 'Expired' },
];

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    scheduleId: '',
    journeyDate: '',
    totalPassengers: '',
    totalFare: '',
    status: 'ACTIVE',
  });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [b, s] = await Promise.all([getAllBookings(), getAllSchedules()]);
      setBookings(b);
      setSchedules(s);
    } catch {
      setError('Unable to load bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ scheduleId: '', journeyDate: '', totalPassengers: '', totalFare: '', status: 'ACTIVE' });
    setEditing(null);
  };

  const openEdit = (booking: Booking) => {
    setEditing(booking);
    setForm({
      scheduleId: String(booking.schedule.id),
      journeyDate: booking.journeyDate,
      totalPassengers: String(booking.totalPassengers),
      totalFare: String(booking.totalFare),
      status: booking.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    try {
      const schedule = schedules.find((s) => s.id === Number(form.scheduleId));
      if (!schedule) throw new Error('Schedule not found');

      await updateBooking(editing.id, {
        schedule,
        journeyDate: form.journeyDate,
        totalPassengers: Number(form.totalPassengers),
        totalFare: Number(form.totalFare),
        status: form.status as Booking['status'],
      });
      setToast({ message: 'Booking updated successfully', type: 'success' });
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
      await deleteBooking(deleteTarget.id);
      setToast({ message: 'Booking deleted successfully', type: 'success' });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const scheduleOptions = schedules.map((s) => ({ value: String(s.id), label: `${s.route.routeName} - ${s.train.trainNumber}` }));

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-500">View and manage all passenger bookings.</p>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'user', header: 'Passenger', render: (b) => `${b.user.firstName} ${b.user.lastName}` },
          { key: 'route', header: 'Route', render: (b) => b.schedule.route.routeName },
          { key: 'journeyDate', header: 'Journey Date', render: (b) => formatDate(b.journeyDate) },
          { key: 'totalPassengers', header: 'Passengers' },
          { key: 'totalFare', header: 'Fare', render: (b) => `₹${b.totalFare.toFixed(2)}` },
          {
            key: 'status',
            header: 'Status',
            render: (b) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${b.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : b.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-700 border-blue-200' : b.status === 'COMPLETED' ? 'bg-metro-blue-100 text-metro-blue-700 border-metro-blue-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {b.status.replace('_', ' ')}
              </span>
            ),
          },
        ]}
        data={bookings}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(b) => b.id}
        emptyTitle="No bookings found"
        emptyDescription="Bookings will appear when passengers make reservations."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Booking">
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Schedule"
            options={scheduleOptions}
            value={form.scheduleId}
            onChange={(e) => setForm((prev) => ({ ...prev, scheduleId: e.target.value }))}
            required
          />
          <Input
            label="Journey Date"
            type="date"
            value={form.journeyDate}
            onChange={(e) => setForm((prev) => ({ ...prev, journeyDate: e.target.value }))}
            required
          />
          <Input
            label="Passengers"
            type="number"
            min={1}
            value={form.totalPassengers}
            onChange={(e) => setForm((prev) => ({ ...prev, totalPassengers: e.target.value }))}
            required
          />
          <Input
            label="Total Fare (₹)"
            type="number"
            step="0.01"
            min={0}
            value={form.totalFare}
            onChange={(e) => setForm((prev) => ({ ...prev, totalFare: e.target.value }))}
            required
          />
          <Select
            label="Status"
            options={statusOptions}
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Booking"
        message={`Delete booking #${deleteTarget?.id} for ${deleteTarget?.user.firstName} ${deleteTarget?.user.lastName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

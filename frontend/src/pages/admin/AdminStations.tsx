import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { getAllStations, createStation, updateStation, deleteStation, parseApiError } from '../../lib/api';
import type { Station } from '../../types';

const activeOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export function AdminStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Station | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Station | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({ stationCode: '', stationName: '', city: '', active: 'true' });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllStations();
      setStations(data);
    } catch {
      setError('Unable to load stations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ stationCode: '', stationName: '', city: '', active: 'true' });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (station: Station) => {
    setEditing(station);
    setForm({
      stationCode: station.stationCode,
      stationName: station.stationName,
      city: station.city,
      active: String(station.active),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        stationCode: form.stationCode,
        stationName: form.stationName,
        city: form.city,
        active: form.active === 'true',
      };
      if (editing) {
        await updateStation(editing.id, payload);
        setToast({ message: 'Station updated successfully', type: 'success' });
      } else {
        await createStation(payload);
        setToast({ message: 'Station created successfully', type: 'success' });
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
      await deleteStation(deleteTarget.id);
      setToast({ message: 'Station deleted successfully', type: 'success' });
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
          <h1 className="text-2xl font-bold text-slate-900">Stations</h1>
          <p className="text-slate-500">Manage metro stations and their status.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Station
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'stationCode', header: 'Code' },
          { key: 'stationName', header: 'Station Name' },
          { key: 'city', header: 'City' },
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
        data={stations}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(s) => s.id}
        emptyTitle="No stations found"
        emptyDescription="Add your first metro station."
        emptyAction={{ label: 'Add Station', onClick: openCreate }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit Station' : 'Add Station'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Station Code"
            value={form.stationCode}
            onChange={(e) => setForm((prev) => ({ ...prev, stationCode: e.target.value }))}
            required
          />
          <Input
            label="Station Name"
            value={form.stationName}
            onChange={(e) => setForm((prev) => ({ ...prev, stationName: e.target.value }))}
            required
          />
          <Input
            label="City"
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
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
              {editing ? 'Save Changes' : 'Create Station'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Station"
        message={`Are you sure you want to delete ${deleteTarget?.stationName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

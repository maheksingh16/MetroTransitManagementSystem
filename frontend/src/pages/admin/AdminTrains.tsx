import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { getAllTrains, createTrain, updateTrain, deleteTrain, parseApiError } from '../../lib/api';
import type { Train } from '../../types';

const activeOptions = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export function AdminTrains() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Train | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Train | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({ trainNumber: '', coachCount: '', active: 'true' });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllTrains();
      setTrains(data);
    } catch {
      setError('Unable to load trains.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ trainNumber: '', coachCount: '', active: 'true' });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (train: Train) => {
    setEditing(train);
    setForm({ trainNumber: train.trainNumber, coachCount: String(train.coachCount), active: String(train.active) });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        trainNumber: form.trainNumber,
        coachCount: Number(form.coachCount),
        active: form.active === 'true',
      };
      if (editing) {
        await updateTrain(editing.id, payload);
        setToast({ message: 'Train updated successfully', type: 'success' });
      } else {
        await createTrain(payload);
        setToast({ message: 'Train created successfully', type: 'success' });
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
      await deleteTrain(deleteTarget.id);
      setToast({ message: 'Train deleted successfully', type: 'success' });
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
          <h1 className="text-2xl font-bold text-slate-900">Trains</h1>
          <p className="text-slate-500">Manage metro trains and coach counts.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Train
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'trainNumber', header: 'Train Number' },
          { key: 'coachCount', header: 'Coaches' },
          {
            key: 'active',
            header: 'Status',
            render: (t) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${t.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {t.active ? 'Active' : 'Inactive'}
              </span>
            ),
          },
        ]}
        data={trains}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(t) => t.id}
        emptyTitle="No trains found"
        emptyDescription="Add your first train."
        emptyAction={{ label: 'Add Train', onClick: openCreate }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Train' : 'Add Train'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Train Number"
            value={form.trainNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, trainNumber: e.target.value }))}
            required
          />
          <Input
            label="Coach Count"
            type="number"
            min={1}
            value={form.coachCount}
            onChange={(e) => setForm((prev) => ({ ...prev, coachCount: e.target.value }))}
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
              {editing ? 'Save Changes' : 'Create Train'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Train"
        message={`Are you sure you want to delete train ${deleteTarget?.trainNumber}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

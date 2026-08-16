import { useEffect, useState } from 'react';
import { Plus, Link as LinkIcon, Unlink } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import {
  getAllLines,
  getAllStations,
  createLine,
  updateLine,
  deleteLine,
  addStationToLine,
  removeStationFromLine,
  parseApiError,
} from '../../lib/api';
import type { Line, Station } from '../../types';

export function AdminLines() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Line | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Line | null>(null);
  const [managingLine, setManagingLine] = useState<Line | null>(null);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({ lineName: '', lineColor: '' });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [l, s] = await Promise.all([getAllLines(), getAllStations()]);
      setLines(l);
      setStations(s);
    } catch {
      setError('Unable to load lines.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ lineName: '', lineColor: '' });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (line: Line) => {
    setEditing(line);
    setForm({ lineName: line.lineName, lineColor: line.lineColor });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editing) {
        await updateLine(editing.id, form);
        setToast({ message: 'Line updated successfully', type: 'success' });
      } else {
        await createLine({ lineName: form.lineName, lineColor: form.lineColor, stations: [] });
        setToast({ message: 'Line created successfully', type: 'success' });
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
      await deleteLine(deleteTarget.id);
      setToast({ message: 'Line deleted successfully', type: 'success' });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingLine || !selectedStationId) return;
    setIsLinking(true);
    try {
      await addStationToLine(managingLine.id, Number(selectedStationId));
      setToast({ message: 'Station added to line', type: 'success' });
      setSelectedStationId('');
      await load();
      const updated = lines.find((l) => l.id === managingLine.id);
      if (updated) setManagingLine(updated);
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setIsLinking(false);
    }
  };

  const handleRemoveStation = async (stationId: number) => {
    if (!managingLine) return;
    try {
      await removeStationFromLine(managingLine.id, stationId);
      setToast({ message: 'Station removed from line', type: 'success' });
      await load();
      const updated = lines.find((l) => l.id === managingLine.id);
      if (updated) setManagingLine(updated);
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    }
  };

  const availableStations = stations.filter(
    (s) => !managingLine?.stations?.some((ms) => ms.id === s.id)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lines</h1>
          <p className="text-slate-500">Manage metro lines and their stations.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Line
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'lineName', header: 'Line Name' },
          {
            key: 'lineColor',
            header: 'Color',
            render: (l) => (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: l.lineColor }}></div>
                <span className="text-xs text-slate-500">{l.lineColor}</span>
              </div>
            ),
          },
          {
            key: 'stations',
            header: 'Stations',
            render: (l) => (
              <button
                onClick={() => setManagingLine(l)}
                className="text-sm text-metro-blue-700 hover:text-metro-blue-800 font-medium hover:underline"
              >
                {l.stations?.length ?? 0} station{(l.stations?.length ?? 0) !== 1 ? 's' : ''}
              </button>
            ),
          },
        ]}
        data={lines}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(l) => l.id}
        emptyTitle="No lines found"
        emptyDescription="Create your first metro line."
        emptyAction={{ label: 'Add Line', onClick: openCreate }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Line' : 'Add Line'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Line Name"
            value={form.lineName}
            onChange={(e) => setForm((prev) => ({ ...prev, lineName: e.target.value }))}
            required
          />
          <Input
            label="Line Color (hex or name)"
            value={form.lineColor}
            onChange={(e) => setForm((prev) => ({ ...prev, lineColor: e.target.value }))}
            required
            placeholder="#2563eb"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editing ? 'Save Changes' : 'Create Line'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Line"
        message={`Are you sure you want to delete ${deleteTarget?.lineName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />

      <Modal
        isOpen={!!managingLine}
        onClose={() => setManagingLine(null)}
        title={`Manage Stations: ${managingLine?.lineName}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6">
          <form onSubmit={handleAddStation} className="flex gap-3 items-end">
            <div className="flex-1">
              <Select
                label="Station to add"
                placeholder="Select station"
                options={availableStations.map((s) => ({ value: String(s.id), label: `${s.stationName} (${s.stationCode})` }))}
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" isLoading={isLinking} leftIcon={<LinkIcon className="w-4 h-4" />}>
              Add
            </Button>
          </form>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {managingLine?.stations?.length === 0 && (
              <p className="text-sm text-slate-500 italic">No stations assigned to this line.</p>
            )}
            {managingLine?.stations?.map((station) => (
              <div
                key={station.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <span className="font-medium text-slate-900">{station.stationName}</span>
                <button
                  onClick={() => handleRemoveStation(station.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove station"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

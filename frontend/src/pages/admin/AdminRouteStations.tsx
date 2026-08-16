import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Toast } from '../../components/common/Toast';
import { getAllRouteStations, getAllRoutes, getAllStations, createRouteStation, updateRouteStation, deleteRouteStation, parseApiError } from '../../lib/api';
import type { RouteStation, Route, Station } from '../../types';

export function AdminRouteStations() {
  const [routeStations, setRouteStations] = useState<RouteStation[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RouteStation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RouteStation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    routeId: '',
    stationId: '',
    stationOrder: '',
    distanceFromPrevious: '',
    timeFromPrevious: '',
  });

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [rs, r, s] = await Promise.all([getAllRouteStations(), getAllRoutes(), getAllStations()]);
      setRouteStations(rs);
      setRoutes(r);
      setStations(s);
    } catch {
      setError('Unable to load route stops.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ routeId: '', stationId: '', stationOrder: '', distanceFromPrevious: '', timeFromPrevious: '' });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (rs: RouteStation) => {
    setEditing(rs);
    setForm({
      routeId: String(rs.route.id),
      stationId: String(rs.station.id),
      stationOrder: String(rs.stationOrder),
      distanceFromPrevious: String(rs.distanceFromPrevious),
      timeFromPrevious: String(rs.timeFromPrevious),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const route = routes.find((r) => r.id === Number(form.routeId));
      const station = stations.find((s) => s.id === Number(form.stationId));
      if (!route || !station) throw new Error('Route or station not found');

      const payload = {
        route,
        station,
        stationOrder: Number(form.stationOrder),
        distanceFromPrevious: Number(form.distanceFromPrevious),
        timeFromPrevious: Number(form.timeFromPrevious),
      };

      if (editing) {
        await updateRouteStation(editing.id, payload);
        setToast({ message: 'Route stop updated successfully', type: 'success' });
      } else {
        await createRouteStation(payload);
        setToast({ message: 'Route stop created successfully', type: 'success' });
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
      await deleteRouteStation(deleteTarget.id);
      setToast({ message: 'Route stop deleted successfully', type: 'success' });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const routeOptions = routes.map((r) => ({ value: String(r.id), label: r.routeName }));
  const stationOptions = stations.map((s) => ({ value: String(s.id), label: `${s.stationName} (${s.stationCode})` }));

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Route Stops</h1>
          <p className="text-slate-500">Manage station sequences for each route.</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Route Stop
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', width: '60px' },
          { key: 'route', header: 'Route', render: (rs) => rs.route.routeName },
          { key: 'station', header: 'Station', render: (rs) => `${rs.station.stationName} (${rs.station.stationCode})` },
          { key: 'stationOrder', header: 'Order' },
          { key: 'distanceFromPrevious', header: 'Distance (km)' },
          { key: 'timeFromPrevious', header: 'Time (min)' },
        ]}
        data={routeStations}
        isLoading={isLoading}
        error={error}
        onRetry={load}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        getItemKey={(rs) => rs.id}
        emptyTitle="No route stops found"
        emptyDescription="Create your first route stop."
        emptyAction={{ label: 'Add Route Stop', onClick: openCreate }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Route Stop' : 'Add Route Stop'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Route"
            options={routeOptions}
            value={form.routeId}
            onChange={(e) => setForm((prev) => ({ ...prev, routeId: e.target.value }))}
            required
          />
          <Select
            label="Station"
            options={stationOptions}
            value={form.stationId}
            onChange={(e) => setForm((prev) => ({ ...prev, stationId: e.target.value }))}
            required
          />
          <Input
            label="Station Order"
            type="number"
            min={1}
            value={form.stationOrder}
            onChange={(e) => setForm((prev) => ({ ...prev, stationOrder: e.target.value }))}
            required
          />
          <Input
            label="Distance from Previous (km)"
            type="number"
            step="0.1"
            min={0}
            value={form.distanceFromPrevious}
            onChange={(e) => setForm((prev) => ({ ...prev, distanceFromPrevious: e.target.value }))}
            required
          />
          <Input
            label="Time from Previous (min)"
            type="number"
            min={0}
            value={form.timeFromPrevious}
            onChange={(e) => setForm((prev) => ({ ...prev, timeFromPrevious: e.target.value }))}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editing ? 'Save Changes' : 'Create Route Stop'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Route Stop"
        message={`Remove ${deleteTarget?.station.stationName} from ${deleteTarget?.route.routeName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

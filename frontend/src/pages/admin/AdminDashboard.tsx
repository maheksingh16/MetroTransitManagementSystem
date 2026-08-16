import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Route, TrainFront, CalendarDays, Ticket, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { SkeletonCard } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { getAllUsers, getAllStations, getAllRoutes, getAllTrains, getAllSchedules, getAllBookings } from '../../lib/api';

interface Stats {
  users: number;
  stations: number;
  routes: number;
  trains: number;
  schedules: number;
  bookings: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getAllUsers(),
      getAllStations(),
      getAllRoutes(),
      getAllTrains(),
      getAllSchedules(),
      getAllBookings(),
    ])
      .then(([users, stations, routes, trains, schedules, bookings]) => {
        setStats({ users: users.length, stations: stations.length, routes: routes.length, trains: trains.length, schedules: schedules.length, bookings: bookings.length });
      })
      .catch(() => setError('Unable to load dashboard statistics.'))
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    { label: 'Users', value: stats?.users ?? 0, icon: Users, path: '/admin/users', color: 'bg-purple-100 text-purple-700' },
    { label: 'Stations', value: stats?.stations ?? 0, icon: MapPin, path: '/admin/stations', color: 'bg-metro-blue-100 text-metro-blue-700' },
    { label: 'Routes', value: stats?.routes ?? 0, icon: Route, path: '/admin/routes', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Trains', value: stats?.trains ?? 0, icon: TrainFront, path: '/admin/trains', color: 'bg-amber-100 text-amber-700' },
    { label: 'Schedules', value: stats?.schedules ?? 0, icon: CalendarDays, path: '/admin/schedules', color: 'bg-gold-100 text-gold-700' },
    { label: 'Bookings', value: stats?.bookings ?? 0, icon: Ticket, path: '/admin/bookings', color: 'bg-rose-100 text-rose-700' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl bg-gradient-to-br from-metro-blue-800 via-metro-blue-700 to-metro-blue-900 text-white p-8 lg:p-10 shadow-2xl shadow-metro-blue-900/25">
        <h1 className="text-3xl font-bold font-display mb-3">Admin Dashboard</h1>
        <p className="text-metro-blue-100 max-w-xl">
          Manage users, stations, lines, routes, trains, schedules, and bookings across the Metro Transit network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.path}>
            <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction to="/admin/stations" label="Add Station" />
          <QuickAction to="/admin/routes" label="Create Route" />
          <QuickAction to="/admin/schedules" label="Add Schedule" />
          <QuickAction to="/admin/trains" label="Register Train" />
          <QuickAction to="/admin/users" label="Manage Users" />
          <QuickAction to="/staff" label="Staff Console" />
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-metro-blue-50 border border-slate-100 transition-colors group"
    >
      <span className="font-medium text-slate-900">{label}</span>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-metro-blue-600 transition-colors" />
    </Link>
  );
}

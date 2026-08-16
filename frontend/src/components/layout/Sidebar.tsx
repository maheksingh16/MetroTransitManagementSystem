import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';
import {
  LayoutDashboard,
  MapPin,
  Route,
  CalendarDays,
  TrainFront,
  Ticket,
  UserCircle,
  Users,
  ShieldCheck,
  ScanLine,
  LogOut,
  Clock,
  Map,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['PASSENGER'] },
  { label: 'Plan Journey', path: '/journey', icon: <MapPin className="w-5 h-5" />, roles: ['PASSENGER'] },
  { label: 'My Bookings', path: '/bookings', icon: <Ticket className="w-5 h-5" />, roles: ['PASSENGER'] },
  { label: 'Stations', path: '/stations', icon: <Map className="w-5 h-5" />, roles: ['PASSENGER'] },
  { label: 'Routes', path: '/routes', icon: <Route className="w-5 h-5" />, roles: ['PASSENGER'] },
  { label: 'Schedules', path: '/schedules', icon: <Clock className="w-5 h-5" />, roles: ['PASSENGER'] },
  { label: 'Profile', path: '/profile', icon: <UserCircle className="w-5 h-5" />, roles: ['PASSENGER'] },

  { label: 'Staff Console', path: '/staff', icon: <ScanLine className="w-5 h-5" />, roles: ['OFFICE_STAFF', 'ADMIN'] },

  { label: 'Admin Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Stations', path: '/admin/stations', icon: <MapPin className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Lines', path: '/admin/lines', icon: <ShieldCheck className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Routes', path: '/admin/routes', icon: <Route className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Route Stops', path: '/admin/route-stations', icon: <Map className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Trains', path: '/admin/trains', icon: <TrainFront className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Schedules', path: '/admin/schedules', icon: <CalendarDays className="w-5 h-5" />, roles: ['ADMIN'] },
  { label: 'Bookings', path: '/admin/bookings', icon: <Ticket className="w-5 h-5" />, roles: ['ADMIN'] },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const filteredItems = navItems.filter((item) => role && item.roles.includes(role));

  return (
    <aside className="w-72 h-full bg-white border-r border-slate-200/70 flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <Logo size="md" />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-metro-blue-700 text-white shadow-md shadow-metro-blue-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-metro-blue-700'
              )}
            >
              {item.icon}
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-metro-blue-100 to-gold-100 flex items-center justify-center text-metro-blue-800 font-semibold text-sm border border-gold-200/60">
            {getInitials(user?.firstName, user?.lastName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">{role?.toLowerCase().replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

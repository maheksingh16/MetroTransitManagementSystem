import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, hasRole } from './context/AuthContext';
import { Loading } from './components/common/Loading';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { PassengerDashboard } from './pages/passenger/PassengerDashboard';
import { JourneyPlanner } from './pages/passenger/JourneyPlanner';
import { MyBookings } from './pages/passenger/MyBookings';
import { BookingDetails } from './pages/passenger/BookingDetails';
import { TicketPage } from './pages/passenger/TicketPage';
import { Profile } from './pages/passenger/Profile';
import { StationsPage } from './pages/passenger/StationsPage';
import { RoutesPage } from './pages/passenger/RoutesPage';
import { SchedulesPage } from './pages/passenger/SchedulesPage';
import { StaffConsole } from './pages/staff/StaffConsole';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminStations } from './pages/admin/AdminStations';
import { AdminLines } from './pages/admin/AdminLines';
import { AdminRoutes } from './pages/admin/AdminRoutes';
import { AdminRouteStations } from './pages/admin/AdminRouteStations';
import { AdminTrains } from './pages/admin/AdminTrains';
import { AdminSchedules } from './pages/admin/AdminSchedules';
import { AdminBookings } from './pages/admin/AdminBookings';

function ProtectedRoute({ allowedRoles, redirectTo = '/login' }: { allowedRoles: ('PASSENGER' | 'OFFICE_STAFF' | 'ADMIN')[]; redirectTo?: string }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated || !hasRole(role, allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }

  if (isAuthenticated) {
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'OFFICE_STAFF') return <Navigate to="/staff" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function RoleRedirect() {
  const { role, isLoading } = useAuth();
  if (isLoading) return <Loading fullScreen message="Redirecting..." />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (role === 'OFFICE_STAFF') return <Navigate to="/staff" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Passenger routes */}
        <Route element={<ProtectedRoute allowedRoles={['PASSENGER']} redirectTo="/login" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<PassengerDashboard />} />
            <Route path="/journey" element={<JourneyPlanner />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/tickets/:id" element={<TicketPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stations" element={<StationsPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
          </Route>
        </Route>

        {/* Staff routes */}
        <Route element={<ProtectedRoute allowedRoles={['OFFICE_STAFF', 'ADMIN']} redirectTo="/login" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/staff" element={<StaffConsole />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} redirectTo="/login" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/stations" element={<AdminStations />} />
            <Route path="/admin/lines" element={<AdminLines />} />
            <Route path="/admin/routes" element={<AdminRoutes />} />
            <Route path="/admin/route-stations" element={<AdminRouteStations />} />
            <Route path="/admin/trains" element={<AdminTrains />} />
            <Route path="/admin/schedules" element={<AdminSchedules />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

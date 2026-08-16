import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  CalendarDays,
  Clock,
  Ticket,
  ArrowRight,
  TrainFront,
  Route,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { Empty } from '../../components/common/Empty';
import { MumbaiMetroMap } from '../../components/common/MumbaiMetroMap';
import { getBookingsByUser, getAllStations, getAllSchedules, getErrorStatus } from '../../lib/api';
import type { Booking, Station, Schedule } from '../../types';
import { formatDate, formatTime, getInitials } from '../../lib/utils';

export function PassengerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const [b, s, sch] = await Promise.all([
          getBookingsByUser(user.id),
          getAllStations(),
          getAllSchedules(),
        ]);
        setBookings(b);
        setStations(s);
        setSchedules(sch);
        setIsAuthError(false);
      } catch (err) {
        const status = getErrorStatus(err);
        if (status === 401) {
          setIsAuthError(true);
          setError('Your session has expired. Please sign in again.');
        } else {
          setIsAuthError(false);
          setError('Unable to load dashboard data.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const upcoming = bookings
    .filter((b) => b.status === 'ACTIVE' || b.status === 'CHECKED_IN')
    .slice(0, 3);

  const handleSignInAgain = () => {
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard className="h-40" />
          <SkeletonCard className="h-40" />
          <SkeletonCard className="h-40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={() => window.location.reload()}
        onSignIn={isAuthError ? handleSignInAgain : undefined}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-metro-blue-800 via-metro-blue-700 to-metro-blue-900 text-white shadow-2xl shadow-metro-blue-900/25">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 300" fill="none" className="w-full h-full">
            <path d="M-50 250 Q100 200 200 250 T450 250" stroke="white" strokeWidth="2" />
            <path d="M-50 220 Q100 170 200 220 T450 220" stroke="white" strokeWidth="2" />
            <rect x="280" y="80" width="120" height="140" rx="60" stroke="white" strokeWidth="2" />
            <rect x="310" y="110" width="60" height="80" rx="8" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="relative z-10 p-8 lg:p-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-xl">
              <p className="text-gold-300 font-medium text-sm uppercase tracking-wider mb-2">Welcome back</p>
              <h1 className="text-3xl lg:text-4xl font-display font-bold mb-3">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-metro-blue-100 text-base mb-6 max-w-md">
                Book tickets, check routes, and travel seamlessly across the city with Metro Transit.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate('/journey')}
                  variant="secondary"
                  leftIcon={<MapPin className="w-4 h-4" />}
                >
                  Plan Journey
                </Button>
                <Button
                  onClick={() => navigate('/bookings')}
                  variant="ghost"
                  className="text-white hover:bg-white/10 border border-white/20"
                  leftIcon={<Ticket className="w-4 h-4" />}
                >
                  My Bookings
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-metro-blue-900 font-bold text-lg">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div>
                <p className="font-semibold">{user?.email}</p>
                <p className="text-sm text-metro-blue-100">Passenger</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-metro-blue-50 flex items-center justify-center text-metro-blue-700">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{bookings.length}</p>
              <p className="text-sm text-slate-500">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 flex items-center justify-center text-gold-700">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stations.length}</p>
              <p className="text-sm text-slate-500">Metro Stations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{schedules.length}</p>
              <p className="text-sm text-slate-500">Active Schedules</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Journeys</CardTitle>
            <CardDescription>Your next metro trips</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/bookings')} rightIcon={<ChevronRight className="w-4 h-4" />}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <Empty
              title="No upcoming journeys"
              description="Plan a journey and book your first metro ticket."
              actionLabel="Plan Journey"
              onAction={() => navigate('/journey')}
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking) => (
                <Link
                  key={booking.id}
                  to={`/bookings/${booking.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-metro-blue-50/50 border border-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-metro-blue-700 shadow-sm">
                      <TrainFront className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking.schedule.route.routeName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(booking.journeyDate)} · {booking.totalPassengers} passenger
                        {booking.totalPassengers > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={booking.status === 'ACTIVE' ? 'success' : 'info'}>{booking.status}</Badge>
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatTime(booking.schedule.departureTime)}</p>
                      <p className="text-xs text-slate-500">Departure</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-metro-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-metro-blue-700 to-metro-blue-900 text-white border-metro-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Route className="w-6 h-6 text-gold-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Explore Routes</h3>
                <p className="text-sm text-metro-blue-100 mb-4">View all metro routes and station connections.</p>
                <Button onClick={() => navigate('/routes')} variant="secondary" size="sm">
                  Browse Routes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gold-500 to-gold-600 text-white border-gold-600">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">View Schedules</h3>
                <p className="text-sm text-gold-100 mb-4">Check train timings and plan your trip.</p>
                <Button
                  onClick={() => navigate('/schedules')}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  See Schedules
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mumbai Metro Network Map */}
      <MumbaiMetroMap />
    </div>
  );
}

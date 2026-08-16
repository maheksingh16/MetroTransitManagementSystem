import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, ArrowRight, CalendarDays, Users, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SkeletonCard } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { Empty } from '../../components/common/Empty';
import { getBookingsByUser, parseApiError } from '../../lib/api';
import type { Booking } from '../../types';
import { formatDate, formatTime, getStatusColor } from '../../lib/utils';

export function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await getBookingsByUser(user.id);
        setBookings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard className="h-32" />
        <SkeletonCard className="h-32" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500">View and manage your metro tickets.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <Empty
              title="No bookings yet"
              description="You haven't made any bookings. Plan a journey to get started."
              actionLabel="Plan Journey"
              onAction={() => navigate('/journey')}
            />
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-metro-blue-50/50 border border-slate-100 transition-colors gap-4"
                >
                  <Link to={`/bookings/${booking.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-metro-blue-700 shadow-sm">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{booking.schedule.route.routeName}</p>
                      <p className="text-sm text-slate-500">
                        Booking #{booking.id} · {formatDate(booking.journeyDate)}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between sm:justify-end gap-4 flex-wrap">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" /> {formatTime(booking.schedule.departureTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {booking.totalPassengers}
                      </span>
                    </div>
                    <span className={getStatusColor(booking.status)}>
                      <Badge variant="default">{booking.status.replace('_', ' ')}</Badge>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<QrCode className="w-4 h-4" />}
                      onClick={() => navigate(`/tickets/${booking.id}`)}
                    >
                      View Ticket
                    </Button>
                    <Link to={`/bookings/${booking.id}`} className="text-metro-blue-600 hover:text-metro-blue-800">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

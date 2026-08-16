import { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Ticket, QrCode, ArrowLeft, TrainFront, CalendarDays, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { getBookingById, parseApiError } from '../../lib/api';
import type { Booking } from '../../types';
import { formatDate, formatDateTime, formatCurrency, formatTime } from '../../lib/utils';
import { Toast } from '../../components/common/Toast';

export function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(location.state?.justBooked);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBookingById(Number(id));
        setBooking(data);
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return <Loading fullScreen message="Loading booking details..." />;
  }

  if (error || !booking) {
    return <ErrorDisplay title="Booking not found" message={error || "The requested booking doesn't exist."} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {showSuccessToast && (
        <Toast
          type="success"
          message="Booking confirmed successfully!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <div className="flex items-center gap-3">
        <Link to="/bookings" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Booking Details</h1>
          <p className="text-slate-500">Booking #{booking.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Journey Information</CardTitle>
                <CardDescription>{booking.schedule.route.routeName}</CardDescription>
              </div>
              <Badge variant={booking.status === 'ACTIVE' ? 'success' : booking.status === 'COMPLETED' ? 'info' : 'default'}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 sm:gap-8">
                <div>
                  <p className="text-3xl font-bold text-slate-900">{formatTime(booking.schedule.departureTime)}</p>
                  <p className="text-sm text-slate-500 mt-1">{formatDate(booking.schedule.departureTime)}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <span className="text-xs text-slate-500 mb-1">{booking.schedule.route.estimatedTimeMinutes} min</span>
                  <div className="w-full h-0.5 bg-slate-200 relative">
                    <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-metro-blue-500"></div>
                    <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-metro-blue-500"></div>
                  </div>
                  <TrainFront className="w-4 h-4 text-slate-400 mt-1" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{formatTime(booking.schedule.arrivalTime)}</p>
                  <p className="text-sm text-slate-500 mt-1">{formatDate(booking.schedule.arrivalTime)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Train</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <TrainFront className="w-4 h-4 text-metro-blue-600" /> {booking.schedule.train.trainNumber}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Passengers</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-metro-blue-600" /> {booking.totalPassengers}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Journey Date</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-metro-blue-600" /> {formatDate(booking.journeyDate)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Fare</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="text-gold-500">₹</span> {formatCurrency(booking.totalFare)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-900">
                  {booking.user.firstName} {booking.user.lastName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-900">{booking.user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="font-medium text-slate-900">{booking.user.phoneNumber}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Booked on</span>
                <span className="font-medium text-slate-900">{formatDateTime(booking.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-metro-blue-700 to-metro-blue-900 text-white border-metro-blue-800">
            <CardHeader>
              <CardTitle className="text-white">Your Ticket</CardTitle>
              <CardDescription className="text-metro-blue-100">
                Valid until {formatDateTime(booking.validUntil)}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-12 h-12 text-gold-300" />
              </div>
              <p className="text-sm text-metro-blue-100 mb-4">
                Show this QR code at the station gate for verification.
              </p>
              <Button
                onClick={() => navigate(`/tickets/${booking.id}`)}
                variant="secondary"
                className="w-full"
                leftIcon={<Ticket className="w-4 h-4" />}
              >
                View Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

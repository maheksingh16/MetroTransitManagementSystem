import { useState } from 'react';
import { Search, ScanLine, LogIn, LogOut, Ticket, AlertCircle, CheckCircle, User, TrainFront, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { staffVerifyBooking, staffCheckInBooking, staffCheckOutBooking, parseApiError } from '../../lib/api';
import type { Booking } from '../../types';
import { formatDate, formatDateTime, getStatusColor } from '../../lib/utils';
import { Toast } from '../../components/common/Toast';

export function StaffConsole() {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<'check-in' | 'check-out' | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) return;
    setIsLoading(true);
    setError('');
    setBooking(null);
    try {
      const data = await staffVerifyBooking(Number(bookingId));
      setBooking(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    setActionLoading('check-in');
    try {
      const data = await staffCheckInBooking(booking.id);
      setBooking(data);
      setToast({ message: 'Passenger checked in successfully', type: 'success' });
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;
    setActionLoading('check-out');
    try {
      const data = await staffCheckOutBooking(booking.id);
      setBooking(data);
      setToast({ message: 'Passenger checked out successfully', type: 'success' });
    } catch (err) {
      setToast({ message: parseApiError(err), type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Console</h1>
        <p className="text-slate-500">Verify tickets and manage passenger check-in / check-out.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-metro-blue-600" /> Verify Booking
          </CardTitle>
          <CardDescription>Enter the booking ID to retrieve ticket details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="flex gap-3">
            <Input
              placeholder="Enter booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              type="number"
              min={1}
              required
              className="max-w-sm"
              leftIcon={<Search className="w-4 h-4" />}
            />
            <Button type="submit" isLoading={isLoading} leftIcon={<ScanLine className="w-4 h-4" />}>
              Verify
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Verification failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {booking && (
        <Card className="border-metro-blue-200 shadow-lg shadow-metro-blue-900/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
            <div>
              <CardTitle>Booking #{booking.id}</CardTitle>
              <CardDescription>Verified successfully</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700">Valid</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className={getStatusColor(booking.status)}>
                <Badge variant="default">{booking.status.replace('_', ' ')}</Badge>
              </span>
              <span className="text-sm text-slate-500">
                Valid until {formatDateTime(booking.validUntil)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Passenger</p>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-metro-blue-600" />
                  {booking.user.firstName} {booking.user.lastName}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Route</p>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-metro-blue-600" />
                  {booking.schedule.route.routeName}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Train</p>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <TrainFront className="w-4 h-4 text-metro-blue-600" />
                  {booking.schedule.train.trainNumber}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Journey Date</p>
                <p className="font-semibold text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-metro-blue-600" />
                  {formatDate(booking.journeyDate)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {booking.status === 'ACTIVE' && (
                <Button
                  onClick={handleCheckIn}
                  isLoading={actionLoading === 'check-in'}
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Check In
                </Button>
              )}
              {booking.status === 'CHECKED_IN' && (
                <Button
                  onClick={handleCheckOut}
                  isLoading={actionLoading === 'check-out'}
                  variant="secondary"
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Check Out
                </Button>
              )}
              {booking.status === 'COMPLETED' && (
                <div className="px-4 py-2 rounded-xl bg-metro-blue-50 text-metro-blue-700 text-sm font-medium">
                  Journey completed
                </div>
              )}
              {booking.status === 'EXPIRED' && (
                <div className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
                  Booking expired
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

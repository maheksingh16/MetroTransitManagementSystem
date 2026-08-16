import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, QrCode, TrainFront, Users } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { Toast } from '../../components/common/Toast';
import { getTicketByBookingId, getTicketQrCodeByBookingId, parseApiError } from '../../lib/api';
import type { Ticket } from '../../types';
import { formatDate, formatDateTime, formatCurrency, formatTime, getStatusColor } from '../../lib/utils';

export function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(Boolean(location.state?.justBooked));

  useEffect(() => {
    let objectUrl = '';
    const load = async () => {
      try {
        const bookingId = Number(id);
        const t = await getTicketByBookingId(bookingId);
        setTicket(t);
        const blob = await getTicketQrCodeByBookingId(bookingId);
        objectUrl = URL.createObjectURL(blob);
        setQrUrl(objectUrl);
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  if (isLoading) {
    return <Loading fullScreen message="Loading your ticket..." />;
  }

  if (error || !ticket) {
    return <ErrorDisplay title="Ticket not found" message={error || "The requested ticket doesn't exist."} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {showSuccessToast && (
        <Toast
          type="success"
          message="Booking confirmed! Your ticket and QR code are ready."
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <div className="flex items-center gap-3">
        <Link to={`/bookings/${ticket.booking.id}`} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Ticket</h1>
          <p className="text-slate-500">{ticket.ticketNumber}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden border-2 border-metro-blue-100 shadow-2xl shadow-metro-blue-900/10">
          <div className="bg-gradient-to-r from-metro-blue-800 via-metro-blue-700 to-metro-blue-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-gold-400/40">
                  <TrainFront className="w-6 h-6 text-gold-300" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold">METRO TRANSIT</h2>
                  <p className="text-xs text-metro-blue-100 tracking-wider">OFFICIAL TICKET</p>
                </div>
              </div>
              <span className={getStatusColor(ticket.status)}>
                <Badge variant="default">{ticket.status}</Badge>
              </span>
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-3xl bg-white border-2 border-slate-100 shadow-lg">
                {qrUrl ? (
                  <img src={qrUrl} alt="Ticket QR Code" className="w-56 h-56 object-contain" />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-slate-50 text-slate-400">
                    <QrCode className="w-16 h-16" />
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-slate-500 text-center max-w-sm">
                Scan this QR code at the station gate. Valid from{' '}
                <strong className="text-slate-700">{formatDateTime(ticket.validFrom)}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ticket No.</p>
                <p className="font-semibold text-slate-900">{ticket.ticketNumber}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Passenger</p>
                <p className="font-semibold text-slate-900">{ticket.passengerName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Route</p>
                <p className="font-semibold text-slate-900">{ticket.booking.schedule.route.routeName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Departure</p>
                <p className="font-semibold text-slate-900">
                  {formatTime(ticket.booking.schedule.departureTime)}
                </p>
                <p className="text-xs text-slate-500">{formatDate(ticket.booking.schedule.departureTime)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Passengers</p>
                <p className="font-semibold text-slate-900 flex items-center gap-1">
                  <Users className="w-4 h-4" /> {ticket.booking.totalPassengers}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Fare</p>
                <p className="font-semibold text-metro-blue-700 text-lg">{formatCurrency(ticket.fare)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Journey Date</p>
                <p className="font-semibold text-slate-900">{formatDate(ticket.booking.journeyDate)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valid Until</p>
                <p className="font-semibold text-slate-900">{formatDateTime(ticket.validUntil)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qrUrl;
                  link.download = `ticket-${ticket.ticketNumber}.png`;
                  link.click();
                }}
                variant="outline"
                className="w-full"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download QR Code
              </Button>
              <Link to="/bookings" className="w-full">
                <Button variant="primary" className="w-full">
                  My Bookings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

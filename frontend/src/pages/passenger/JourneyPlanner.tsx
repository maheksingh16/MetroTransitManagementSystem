import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Users, CalendarDays, CheckCircle, Route } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { SkeletonCard } from '../../components/common/Loading';
import { getAllStations, getAllSchedules, getAllRouteStations, createBooking } from '../../lib/api';
import { parseApiError } from '../../lib/api';
import type { Station, Schedule, RouteStation, BookingCreateRequest } from '../../types';
import { formatTime, formatCurrency } from '../../lib/utils';

export function JourneyPlanner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routeStations, setRouteStations] = useState<RouteStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [fromStationId, setFromStationId] = useState<string>('');
  const [toStationId, setToStationId] = useState<string>('');
  const [journeyDate, setJourneyDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState<number>(1);
  const [isSearching, setIsSearching] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, sch, rs] = await Promise.all([
          getAllStations(),
          getAllSchedules(),
          getAllRouteStations(),
        ]);
        setStations(s.filter((st) => st.active));
        setSchedules(sch.filter((sc) => sc.active));
        setRouteStations(rs);
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const stationOptions = useMemo(
    () =>
      stations
        .map((s) => ({ value: String(s.id), label: `${s.stationName} (${s.stationCode})` }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [stations]
  );

  const results = useMemo(() => {
    if (!fromStationId || !toStationId || fromStationId === toStationId) return [];

    const fromId = Number(fromStationId);
    const toId = Number(toStationId);

    const matchingSchedules = schedules.filter((schedule) => {
      const routeId = schedule.route.id;
      const stops = routeStations
        .filter((rs) => rs.route.id === routeId)
        .sort((a, b) => a.stationOrder - b.stationOrder);
      const fromStop = stops.find((rs) => rs.station.id === fromId);
      const toStop = stops.find((rs) => rs.station.id === toId);
      return fromStop && toStop && fromStop.stationOrder < toStop.stationOrder;
    });

    return matchingSchedules.map((schedule) => {
      const routeId = schedule.route.id;
      const stops = routeStations
        .filter((rs) => rs.route.id === routeId)
        .sort((a, b) => a.stationOrder - b.stationOrder);
      const fromStop = stops.find((rs) => rs.station.id === fromId)!;
      const toStop = stops.find((rs) => rs.station.id === toId)!;

      const estimatedMinutes = stops
        .filter((rs) => rs.stationOrder > fromStop.stationOrder && rs.stationOrder <= toStop.stationOrder)
        .reduce((sum, rs) => sum + rs.timeFromPrevious, 0);

      const totalFare = schedule.fare * passengers;

      return {
        schedule,
        fromStop,
        toStop,
        estimatedMinutes: estimatedMinutes || schedule.route.estimatedTimeMinutes,
        totalFare,
      };
    });
  }, [fromStationId, toStationId, schedules, routeStations, passengers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // results are computed synchronously; just show them
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleBook = async (schedule: Schedule, totalFare: number) => {
    if (!user) return;
    setBookingLoading(schedule.id);
    setError('');
    try {
      const booking: BookingCreateRequest = {
        user: { id: user.id },
        schedule: { id: schedule.id },
        journeyDate,
        totalPassengers: passengers,
        totalFare,
      };
      const created = await createBooking(booking);
      navigate(`/tickets/${created.id}`, { state: { justBooked: true } });
    } catch (err) {
      setError(parseApiError(err));
      setBookingLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Plan Your Journey</h1>
        <p className="text-slate-500">Select your origin, destination, and travel date.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
      )}

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Journey Details</CardTitle>
          <CardDescription>Search available metro routes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <Select
                label="From"
                placeholder="Select station"
                options={stationOptions}
                value={fromStationId}
                onChange={(e) => setFromStationId(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-3">
              <Select
                label="To"
                placeholder="Select station"
                options={stationOptions}
                value={toStationId}
                onChange={(e) => setToStationId(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-3">
              <Input
                label="Journey Date"
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                required
                leftIcon={<CalendarDays className="w-4 h-4" />}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Passengers"
                type="number"
                min={1}
                max={20}
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))}
                required
                leftIcon={<Users className="w-4 h-4" />}
              />
            </div>
            <div className="md:col-span-1">
              <Button type="submit" variant="primary" className="w-full" isLoading={isSearching}>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {fromStationId && toStationId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {results.length} route{results.length !== 1 ? 's' : ''} found
            </h2>
          </div>

          {results.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Route className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No routes found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  We couldn't find a direct metro route between the selected stations. Try different stations or
                  travel date.
                </p>
              </CardContent>
            </Card>
          ) : (
            results.map(({ schedule, fromStop, toStop, estimatedMinutes, totalFare }) => (
              <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="info">{schedule.route.routeName}</Badge>
                        <span className="text-sm text-slate-500">Train {schedule.train.trainNumber}</span>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-8">
                        <div className="text-center sm:text-left">
                          <p className="text-2xl font-bold text-slate-900">{formatTime(schedule.departureTime)}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1 justify-center sm:justify-start">
                            <MapPin className="w-3 h-3" /> {fromStop.station.stationName}
                          </p>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-2 min-w-[80px]">
                          <span className="text-xs text-slate-500 mb-1">{estimatedMinutes} min</span>
                          <div className="w-full h-0.5 bg-slate-200 relative">
                            <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-metro-blue-500"></div>
                            <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-metro-blue-500"></div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 mt-1" />
                        </div>

                        <div className="text-center sm:text-left">
                          <p className="text-2xl font-bold text-slate-900">{formatTime(schedule.arrivalTime)}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1 justify-center sm:justify-start">
                            <MapPin className="w-3 h-3" /> {toStop.station.stationName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-metro-blue-700">{formatCurrency(totalFare)}</p>
                        <p className="text-xs text-slate-500">for {passengers} passenger{passengers > 1 ? 's' : ''}</p>
                      </div>
                      <Button
                        onClick={() => handleBook(schedule, totalFare)}
                        isLoading={bookingLoading === schedule.id}
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

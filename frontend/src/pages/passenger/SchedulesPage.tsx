import { useEffect, useState } from 'react';
import { Clock, TrainFront, Route } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { getAllSchedules } from '../../lib/api';
import type { Schedule } from '../../types';
import { formatDate, formatTime, formatCurrency } from '../../lib/utils';

export function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllSchedules()
      .then(setSchedules)
      .catch(() => setError('Unable to load schedules.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Train Schedules</h1>
        <p className="text-slate-500">All upcoming metro train schedules.</p>
      </div>

      <div className="space-y-3">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-metro-blue-50 flex items-center justify-center text-metro-blue-700">
                    <TrainFront className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      <Route className="w-4 h-4 text-slate-400" /> {schedule.route.routeName}
                    </p>
                    <p className="text-sm text-slate-500">
                      Train {schedule.train.trainNumber} · {schedule.train.coachCount} coaches
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">{formatTime(schedule.departureTime)}</p>
                    <p className="text-xs text-slate-500">{formatDate(schedule.departureTime)}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="w-4 h-4 text-slate-300" />
                    <div className="w-12 h-0.5 bg-slate-200 my-1"></div>
                    <p className="text-xs text-slate-400">{schedule.route.estimatedTimeMinutes}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900">{formatTime(schedule.arrivalTime)}</p>
                    <p className="text-xs text-slate-500">{formatDate(schedule.arrivalTime)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[140px]">
                  <p className="text-lg font-bold text-metro-blue-700">{formatCurrency(schedule.fare)}</p>
                  <Badge variant={schedule.active ? 'success' : 'default'}>{schedule.active ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

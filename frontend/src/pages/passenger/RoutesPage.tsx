import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { getAllRoutes, getAllRouteStations } from '../../lib/api';
import type { Route as RouteType, RouteStation } from '../../types';

export function RoutesPage() {
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [routeStations, setRouteStations] = useState<RouteStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAllRoutes(), getAllRouteStations()])
      .then(([r, rs]) => {
        setRoutes(r);
        setRouteStations(rs);
      })
      .catch(() => setError('Unable to load routes.'))
      .finally(() => setIsLoading(false));
  }, []);

  const getStopsForRoute = (routeId: number) => {
    return routeStations
      .filter((rs) => rs.route.id === routeId)
      .sort((a, b) => a.stationOrder - b.stationOrder);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} className="h-48" />
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
        <h1 className="text-2xl font-bold text-slate-900">Metro Routes</h1>
        <p className="text-slate-500">Explore available routes and station sequences.</p>
      </div>

      <div className="space-y-4">
        {routes.map((route) => {
          const stops = getStopsForRoute(route.id);
          return (
            <Card key={route.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{route.routeName}</CardTitle>
                  <CardDescription>
                    <span className="flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" /> {route.estimatedTimeMinutes} minutes
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={route.active ? 'success' : 'default'}>{route.active ? 'Active' : 'Inactive'}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {stops.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No stops configured</p>
                  ) : (
                    stops.map((stop, idx) => (
                      <div key={stop.id} className="flex items-center gap-2 shrink-0">
                        <div className="px-3 py-1.5 rounded-lg bg-metro-blue-50 text-metro-blue-800 text-sm font-medium border border-metro-blue-100">
                          {stop.station.stationName}
                        </div>
                        {idx < stops.length - 1 && (
                          <div className="w-4 h-0.5 bg-slate-200 shrink-0"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

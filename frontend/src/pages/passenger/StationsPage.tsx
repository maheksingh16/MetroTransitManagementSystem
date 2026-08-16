import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/common/Loading';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { MumbaiMetroMap } from '../../components/common/MumbaiMetroMap';
import { getAllStations } from '../../lib/api';
import type { Station } from '../../types';

export function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllStations()
      .then(setStations)
      .catch(() => setError('Unable to load stations.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} className="h-40" />
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
        <h1 className="text-2xl font-bold text-slate-900">Metro Stations</h1>
        <p className="text-slate-500">All stations across the metro network.</p>
      </div>

      <MumbaiMetroMap />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <Card key={station.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-metro-blue-50 flex items-center justify-center text-metro-blue-700">
                  <MapPin className="w-6 h-6" />
                </div>
                <Badge variant={station.active ? 'success' : 'default'}>
                  {station.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{station.stationName}</h3>
              <p className="text-sm text-slate-500 mb-3">{station.city}</p>
              <p className="text-xs font-medium text-metro-blue-700 bg-metro-blue-50 inline-block px-2 py-1 rounded-lg">
                {station.stationCode}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

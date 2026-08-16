import { useEffect, useState } from 'react';
import { MapPin, TrainFront } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Loading } from './Loading';
import { ErrorDisplay } from './ErrorDisplay';
import { getAllLines } from '../../lib/api';
import type { Line } from '../../types';

export function MumbaiMetroMap() {
  const [lines, setLines] = useState<Line[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllLines()
      .then(setLines)
      .catch(() => setError('Unable to load metro network.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loading message="Loading Mumbai Metro network..." />;
  if (error) return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrainFront className="w-5 h-5 text-metro-blue-600" /> Mumbai Metro Network
        </CardTitle>
        <CardDescription>Operational lines and interchange stations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {lines.map((line) => (
          <div key={line.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: line.lineColor }}
              ></div>
              <h3 className="font-semibold text-slate-900">{line.lineName}</h3>
              <span className="text-xs text-slate-500">{line.stations?.length} stations</span>
            </div>
            <div className="relative pl-3">
              <div
                className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full"
                style={{ backgroundColor: line.lineColor }}
              ></div>
              <div className="space-y-0">
                {line.stations?.map((station) => {
                  const isInterchange = lines.filter((l) => l.id !== line.id && l.stations?.some((s) => s.id === station.id)).length > 0;
                  return (
                    <div key={`${line.id}-${station.id}`} className="flex items-center gap-3 py-1.5 relative">
                      <div
                        className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 shrink-0 ${isInterchange ? 'ring-2 ring-gold-400' : ''}`}
                        style={{ backgroundColor: line.lineColor }}
                      ></div>
                      <span className="text-sm text-slate-700">{station.stationName}</span>
                      {isInterchange && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-700 border border-gold-200 font-medium">
                          Interchange
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-metro-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-900 mb-1">Key Interchanges</p>
              <p>D N Nagar connects Line 1 (Blue) and Line 2A (Yellow). Dahisar East connects Line 2A (Yellow) and Line 7 (Red).</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

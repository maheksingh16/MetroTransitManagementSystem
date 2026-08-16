import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ message = 'Loading...', className, fullScreen = false }: LoadingProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className="w-8 h-8 text-metro-blue-600 animate-spin" />
      <p className="text-slate-600 text-sm font-medium">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-3xl bg-white border border-slate-200/60 p-6 animate-pulse', className)}>
      <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="h-3 bg-slate-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
    </div>
  );
}

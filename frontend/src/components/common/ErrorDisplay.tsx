import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onSignIn?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'We could not load the requested information. Please try again.',
  onRetry,
  onSignIn,
  className,
}: ErrorDisplayProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Try Again
          </Button>
        )}
        {onSignIn && (
          <Button onClick={onSignIn} variant="primary" leftIcon={<LogIn className="w-4 h-4" />}>
            Sign In Again
          </Button>
        )}
      </div>
    </div>
  );
}

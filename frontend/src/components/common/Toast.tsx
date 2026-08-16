import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
    info: <Info className="w-5 h-5 text-metro-blue-600" />,
  };

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-metro-blue-50 border-metro-blue-200 text-metro-blue-800',
  };

  const progressColors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-metro-blue-500',
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-slate-900/10 min-w-[300px] max-w-md animate-slide-in-right',
        styles[type]
      )}
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1 pr-6">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute right-3 top-3 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
      <div
        className={cn('absolute bottom-0 left-0 h-0.5 rounded-b-2xl transition-all duration-100', progressColors[type])}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }: { toasts: { id: string; message: string; type: ToastType }[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, description, children, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div
        className={cn(
          'relative bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in',
          maxWidth
        )}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between z-10 rounded-t-3xl">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

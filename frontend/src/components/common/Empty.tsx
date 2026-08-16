import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function Empty({
  title = 'Nothing here yet',
  description = 'There are no items to display.',
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && <div className="mb-4 text-slate-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

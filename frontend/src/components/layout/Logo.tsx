import { TrainFront } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'rounded-xl bg-gradient-to-br from-metro-blue-700 to-metro-blue-900 text-white flex items-center justify-center shadow-lg shadow-metro-blue-700/25 border border-gold-400/40',
          s.icon
        )}
      >
        <TrainFront className={cn('text-gold-300', size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6')} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className={cn('font-display font-bold tracking-tight text-metro-blue-900', s.text)}>
          METRO
        </span>
        <span className={cn('font-semibold tracking-[0.2em] text-gold-600 uppercase', s.sub)}>
          Transit
        </span>
      </div>
    </div>
  );
}

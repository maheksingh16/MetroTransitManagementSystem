import { Menu, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from './Logo';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 glass border-b border-slate-200/70">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-2">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

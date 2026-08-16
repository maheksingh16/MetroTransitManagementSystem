import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDate(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0) ?? '';
  const last = lastName?.charAt(0) ?? '';
  return (first + last).toUpperCase() || 'U';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
    case 'BOOKED':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'CHECKED_IN':
    case 'USED':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'COMPLETED':
      return 'bg-metro-blue-100 text-metro-blue-700 border-metro-blue-200';
    case 'EXPIRED':
    case 'CANCELLED':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'OFFICE_STAFF':
      return 'bg-gold-100 text-gold-700 border-gold-200';
    case 'PASSENGER':
      return 'bg-metro-blue-100 text-metro-blue-700 border-metro-blue-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

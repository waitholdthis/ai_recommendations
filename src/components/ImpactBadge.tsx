import { cn } from '@/lib/utils';

interface ImpactBadgeProps {
  label: string;
  variant?: 'severity' | 'impact' | 'effort' | 'priority' | 'complexity';
  className?: string;
}

const severityColors: Record<string, string> = {
  Critical: 'bg-red-500/15 text-red-400 border-red-500/20',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Low: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
};

const impactColors: Record<string, string> = {
  High: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Low: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
};

const priorityColors: Record<string, string> = {
  'Quick Win': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Strategic: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  Transformative: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

function getColor(variant: string, label: string): string {
  if (variant === 'severity') return severityColors[label] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
  if (variant === 'priority') return priorityColors[label] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
  if (variant === 'effort') {
    const map: Record<string, string> = {
      Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      High: 'bg-red-500/15 text-red-400 border-red-500/20',
    };
    return map[label] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
  }
  if (variant === 'complexity') {
    const map: Record<string, string> = {
      Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      High: 'bg-red-500/15 text-red-400 border-red-500/20',
    };
    return map[label] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
  }
  return impactColors[label] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
}

export function ImpactBadge({ label, variant = 'impact', className }: ImpactBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border',
        getColor(variant, label),
        className
      )}
    >
      {label}
    </span>
  );
}

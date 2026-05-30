import { cn } from '@/lib/utils';

interface Props { label: string; variant?: 'severity' | 'impact' | 'effort' | 'priority' | 'complexity'; className?: string; }

const PALETTE: Record<string, Record<string, { bg: string; border: string; color: string }>> = {
  severity: {
    Critical: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   color: '#F87171' },
    High:     { bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)',  color: '#FB923C' },
    Medium:   { bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.25)',   color: '#FACC15' },
    Low:      { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)', color: '#818CF8' },
  },
  priority: {
    'Quick Win':     { bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   color: '#4ADE80' },
    Strategic:       { bg: 'rgba(99,102,241,0.1)',   border: 'rgba(99,102,241,0.25)', color: '#818CF8' },
    Transformative:  { bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.25)',color: '#C084FC' },
  },
  effort: {
    Low:    { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',   color: '#4ADE80' },
    Medium: { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)',   color: '#FACC15' },
    High:   { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)',   color: '#F87171' },
  },
  impact: {
    High:   { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',   color: '#4ADE80' },
    Medium: { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)',   color: '#FACC15' },
    Low:    { bg: 'rgba(144,144,176,0.08)',border: 'rgba(144,144,176,0.2)', color: '#9090B0' },
  },
  complexity: {
    Low:    { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',   color: '#4ADE80' },
    Medium: { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)',   color: '#FACC15' },
    High:   { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)',   color: '#F87171' },
  },
};

const FALLBACK = { bg: 'rgba(144,144,176,0.08)', border: 'rgba(144,144,176,0.2)', color: '#9090B0' };

export function ImpactBadge({ label, variant = 'impact', className }: Props) {
  const style = PALETTE[variant]?.[label] ?? FALLBACK;
  return (
    <span
      className={cn('inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md', className)}
      style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color, letterSpacing: '0.02em' }}
    >
      {label}
    </span>
  );
}

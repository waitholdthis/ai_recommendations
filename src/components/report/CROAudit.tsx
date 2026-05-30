'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CROAudit, CROIssue } from '@/lib/types';
import { ScoreGauge, scoreColor } from '@/components/ScoreGauge';
import { ImpactBadge } from '@/components/ImpactBadge';

const DIMS = [
  { key: 'heroScore' as const,        label: 'Hero Section' },
  { key: 'navigationScore' as const,  label: 'Navigation' },
  { key: 'ctaScore' as const,         label: 'Call-to-Action' },
  { key: 'socialProofScore' as const, label: 'Social Proof' },
  { key: 'mobileScore' as const,      label: 'Mobile UX' },
  { key: 'trustScore' as const,       label: 'Trust Signals' },
  { key: 'contentScore' as const,     label: 'Content Quality' },
];

const SEV_ORDER = ['Critical','High','Medium','Low'];

export function CROAuditSection({ audit }: { audit: CROAudit }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const counts = SEV_ORDER.reduce((acc, s) => {
    acc[s] = audit.issues.filter(i => i.severity === s).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = (filter === 'All' ? audit.issues : audit.issues.filter(i => i.severity === filter))
    .slice()
    .sort((a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity));

  return (
    <div className="space-y-5">

      {/* Top row: big score + dimension bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Overall */}
        <div className="lg:col-span-3 card p-6 flex flex-col items-center justify-center gap-4">
          <ScoreGauge score={audit.overallScore} size="lg" showLabel />
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>Overall Score</p>
            <p className="text-xs mt-0.5" style={{ color: '#45455F' }}>{audit.issues.length} issues identified</p>
          </div>
          {/* Severity summary */}
          <div className="w-full grid grid-cols-4 gap-1 text-center">
            {SEV_ORDER.map(s => {
              const colors: Record<string, string> = { Critical: '#EF4444', High: '#F97316', Medium: '#EAB308', Low: '#818CF8' };
              return (
                <div key={s} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-base font-bold tabular-nums" style={{ color: colors[s] }}>{counts[s] || 0}</p>
                  <p className="text-[10px]" style={{ color: '#45455F' }}>{s.slice(0, 4)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dimension bars */}
        <div className="lg:col-span-9 card p-6">
          <h3 className="text-sm font-semibold mb-6" style={{ color: '#EDEDFA' }}>Score Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {DIMS.map(({ key, label }) => {
              const score = audit[key];
              const color = scoreColor(score);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium" style={{ color: '#9090B0' }}>{label}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color }}>{score}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}CC, ${color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Issues */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>
            Issues
            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#45455F' }}>
              {filtered.length}
            </span>
          </h3>
          <div className="flex gap-1.5 flex-wrap">
            {['All', ...SEV_ORDER].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150"
                style={filter === s
                  ? { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', color: '#818CF8' }
                  : { background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#45455F' }}>
                {s}
                {s !== 'All' && counts[s] > 0 && (
                  <span className="ml-1.5 tabular-nums">{counts[s]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((issue, i) => (
            <IssueRow key={issue.id} issue={issue} index={i}
              isOpen={expanded === issue.id}
              onToggle={() => setExpanded(expanded === issue.id ? null : issue.id)} />
          ))}
          {filtered.length === 0 && (
            <div className="card-flat p-12 text-center">
              <p className="text-sm" style={{ color: '#45455F' }}>No issues in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Strengths */}
      {audit.strengths.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            <h3 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>Strengths</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {audit.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 flex-shrink-0" style={{ color: '#22C55E' }}>✓</span>
                <span style={{ color: '#9090B0' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick wins */}
      {audit.quickWins.length > 0 && (
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <h3 className="text-sm font-semibold" style={{ color: '#4ADE80' }}>Quick Wins</h3>
          </div>
          <ul className="space-y-2">
            {audit.quickWins.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="flex-shrink-0 mt-0.5" style={{ color: '#22C55E' }}>→</span>
                <span style={{ color: '#9090B0' }}>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function IssueRow({ issue, index, isOpen, onToggle }: {
  issue: CROIssue; index: number; isOpen: boolean; onToggle: () => void;
}) {
  const sevDot: Record<string, string> = { Critical: '#EF4444', High: '#F97316', Medium: '#EAB308', Low: '#818CF8' };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: isOpen ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        border: isOpen ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(255,255,255,0.05)',
      }}>
      <button className="w-full text-left px-4 py-4 flex items-start gap-3" onClick={onToggle}>
        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: sevDot[issue.severity] }} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <ImpactBadge label={issue.severity} variant="severity" />
            <span className="text-xs" style={{ color: '#45455F' }}>{issue.category}</span>
          </div>
          <h4 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>{issue.title}</h4>
          {!isOpen && <p className="text-xs mt-1 line-clamp-1" style={{ color: '#45455F' }}>{issue.description}</p>}
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <ImpactBadge label={issue.estimatedImpact} variant="impact" />
          <ImpactBadge label={issue.effort} variant="effort" />
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#45455F" strokeWidth="2"
          className="flex-shrink-0 mt-1 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="pt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#45455F' }}>Problem</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{issue.description}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6366F1' }}>Recommendation</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#EDEDFA' }}>{issue.recommendation}</p>
                </div>
                <div className="flex flex-wrap gap-5">
                  <div>
                    <p className="text-xs mb-1.5" style={{ color: '#45455F' }}>Conversion Lift</p>
                    <p className="text-sm font-semibold" style={{ color: '#22C55E' }}>{issue.conversionLift}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1.5" style={{ color: '#45455F' }}>Impact</p>
                    <ImpactBadge label={issue.estimatedImpact} variant="impact" />
                  </div>
                  <div>
                    <p className="text-xs mb-1.5" style={{ color: '#45455F' }}>Effort</p>
                    <ImpactBadge label={issue.effort} variant="effort" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

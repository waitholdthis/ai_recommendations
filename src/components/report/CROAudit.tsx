'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CROAudit, CROIssue } from '@/lib/types';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ImpactBadge } from '@/components/ImpactBadge';
import { scoreToColor } from '@/lib/utils';

interface CROAuditSectionProps {
  audit: CROAudit;
}

const DIMENSION_SCORES = [
  { key: 'heroScore', label: 'Hero Section' },
  { key: 'navigationScore', label: 'Navigation' },
  { key: 'ctaScore', label: 'Call-to-Action' },
  { key: 'socialProofScore', label: 'Social Proof' },
  { key: 'mobileScore', label: 'Mobile' },
  { key: 'trustScore', label: 'Trust Signals' },
  { key: 'contentScore', label: 'Content' },
] as const;

export function CROAuditSection({ audit }: CROAuditSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const filteredIssues =
    filterSeverity === 'All'
      ? audit.issues
      : audit.issues.filter((i) => i.severity === filterSeverity);

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-8">
      {/* Overall score + dimension grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Big score */}
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
          <ScoreGauge score={audit.overallScore} size="lg" />
          <h2 className="mt-4 text-lg font-bold text-text-primary">Overall CRO Score</h2>
          <p className="text-sm text-text-secondary mt-1">
            {audit.issues.length} issues identified
          </p>
        </div>

        {/* Dimension scores */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-5">Score Breakdown</h3>
          <div className="grid grid-cols-2 gap-3">
            {DIMENSION_SCORES.map(({ key, label }) => {
              const score = audit[key];
              const color = scoreToColor(score);
              const pct = score;
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-text-secondary">{label}</span>
                    <span className="text-xs font-semibold" style={{ color }}>
                      {score}
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Issues list */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-base font-semibold text-text-primary">
            Issues Found ({audit.issues.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            {severities.map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  filterSeverity === s
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'border-border text-text-muted hover:border-primary/30 hover:text-text-secondary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {sortedIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              expanded={expandedId === issue.id}
              onToggle={() =>
                setExpandedId(expandedId === issue.id ? null : issue.id)
              }
            />
          ))}
          {sortedIssues.length === 0 && (
            <p className="text-center text-text-muted py-8">No issues in this category.</p>
          )}
        </div>
      </div>

      {/* Quick wins */}
      {audit.quickWins.length > 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-emerald-400 mb-4">⚡ Quick Wins</h3>
          <ul className="space-y-2">
            {audit.quickWins.map((win, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">→</span>
                <span className="text-text-secondary">{win}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function IssueCard({
  issue,
  expanded,
  onToggle,
}: {
  issue: CROIssue;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden card-hover">
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <ImpactBadge label={issue.severity} variant="severity" />
            <span className="text-xs text-text-muted">{issue.category}</span>
          </div>
          <h4 className="text-sm font-semibold text-text-primary">{issue.title}</h4>
          {!expanded && (
            <p className="text-xs text-text-muted mt-1 line-clamp-1">{issue.description}</p>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-text-muted">Impact:</span>
            <ImpactBadge label={issue.estimatedImpact} variant="impact" />
            <span className="text-xs text-text-muted">Effort:</span>
            <ImpactBadge label={issue.effort} variant="effort" />
          </div>
          <span className="text-text-muted text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Problem</p>
                <p className="text-sm text-text-secondary">{issue.description}</p>
              </div>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-3">
                <p className="text-xs text-primary uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm text-text-primary">{issue.recommendation}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">Conversion Lift</p>
                  <p className="text-sm font-semibold text-success">{issue.conversionLift}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Impact</p>
                  <ImpactBadge label={issue.estimatedImpact} variant="impact" />
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Effort</p>
                  <ImpactBadge label={issue.effort} variant="effort" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AIRoadmap, AIOpportunity } from '@/lib/types';
import { ImpactBadge } from '@/components/ImpactBadge';

interface AIRoadmapSectionProps {
  roadmap: AIRoadmap;
}

const PHASE_COLORS = {
  0: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', badge: 'text-emerald-400', dot: 'bg-emerald-500' },
  1: { border: 'border-indigo-500/20', bg: 'bg-indigo-500/5', badge: 'text-indigo-400', dot: 'bg-indigo-500' },
  2: { border: 'border-purple-500/20', bg: 'bg-purple-500/5', badge: 'text-purple-400', dot: 'bg-purple-500' },
} as const;

const CATEGORY_ICONS: Record<string, string> = {
  'Customer Support': '💬',
  'Sales & Lead Gen': '📈',
  Marketing: '📣',
  Operations: '⚙️',
  Analytics: '📊',
  Content: '✍️',
  Personalization: '🎯',
  Automation: '🤖',
};

export function AIRoadmapSection({ roadmap }: AIRoadmapSectionProps) {
  const phases = [roadmap.phase1, roadmap.phase2, roadmap.phase3];

  return (
    <div className="space-y-8">
      {/* Summary banner */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-text-primary mb-2">AI Solutions Roadmap</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{roadmap.executiveSummary}</p>
          </div>
          <div className="flex-shrink-0 text-center bg-primary/10 border border-primary/20 rounded-xl px-5 py-3">
            <p className="text-xs text-text-muted mb-1">Total Est. ROI</p>
            <p className="text-xl font-bold gradient-text">{roadmap.totalEstimatedROI}</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-primary/5 rounded-xl">
          <p className="text-xs text-text-muted mb-0.5">Top Recommendation</p>
          <p className="text-sm text-text-primary">{roadmap.topRecommendation}</p>
        </div>
      </div>

      {/* Phases */}
      {phases.map((phase, phaseIdx) => {
        const colors = PHASE_COLORS[phaseIdx as 0 | 1 | 2];
        return (
          <div key={phaseIdx} className={`border ${colors.border} ${colors.bg} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
              <div>
                <span className={`text-xs font-medium uppercase tracking-wider ${colors.badge}`}>
                  Phase {phaseIdx + 1} — {phase.duration}
                </span>
                <h3 className="text-base font-bold text-text-primary">{phase.title}</h3>
              </div>
              <span className="ml-auto text-xs text-text-muted bg-surface border border-border rounded-full px-2.5 py-1">
                {phase.opportunities.length} opportunities
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {phase.opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} phaseIdx={phaseIdx} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OpportunityCard({
  opportunity: opp,
  phaseIdx,
}: {
  opportunity: AIOpportunity;
  phaseIdx: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const icon = CATEGORY_ICONS[opp.category] || '🔧';

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden card-hover">
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center text-lg flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <ImpactBadge label={opp.priority} variant="priority" />
              <span className="text-xs text-text-muted">{opp.category}</span>
            </div>
            <h4 className="text-sm font-semibold text-text-primary leading-snug">{opp.title}</h4>
            {!expanded && (
              <p className="text-xs text-text-muted mt-1 line-clamp-2">{opp.description}</p>
            )}
          </div>
          <span className="text-text-muted text-sm flex-shrink-0">{expanded ? '▲' : '▼'}</span>
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
              <p className="text-sm text-text-secondary">{opp.description}</p>

              <div className="grid grid-cols-3 gap-3">
                <MetricBox label="Est. ROI" value={opp.estimatedROI} valueClass="text-success" />
                <MetricBox label="Timeline" value={opp.timeToImplement} valueClass="text-accent" />
                <div>
                  <p className="text-xs text-text-muted mb-1">Complexity</p>
                  <ImpactBadge label={opp.complexity} variant="complexity" />
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Business Impact</p>
                <p className="text-sm text-text-secondary">{opp.businessImpact}</p>
              </div>

              <div className="bg-surface-2 rounded-xl p-3">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Implementation</p>
                <p className="text-sm text-text-secondary">{opp.implementationApproach}</p>
              </div>

              {opp.tools.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Recommended Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {opp.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {opp.successMetrics.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Success Metrics</p>
                  <ul className="space-y-1">
                    {opp.successMetrics.map((metric, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="text-success mt-0.5">✓</span>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricBox({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div>
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className={`text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

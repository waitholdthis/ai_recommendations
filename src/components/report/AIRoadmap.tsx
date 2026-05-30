'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AIRoadmap, AIOpportunity } from '@/lib/types';
import { ImpactBadge } from '@/components/ImpactBadge';

const PHASE_CONFIG = [
  { num: 1, color: '#22C55E', border: 'rgba(34,197,94,0.25)',  bg: 'rgba(34,197,94,0.06)',  dot: '#22C55E', label: 'Quick Wins' },
  { num: 2, color: '#818CF8', border: 'rgba(99,102,241,0.25)', bg: 'rgba(99,102,241,0.06)', dot: '#818CF8', label: 'Strategic' },
  { num: 3, color: '#C084FC', border: 'rgba(192,132,252,0.25)',bg: 'rgba(192,132,252,0.06)',dot: '#C084FC', label: 'Transform' },
] as const;

const CAT_ICONS: Record<string, string> = {
  'Customer Support': '💬',
  'Sales & Lead Gen': '📈',
  Marketing: '📣',
  Operations: '⚙️',
  Analytics: '📊',
  Content: '✍️',
  Personalization: '🎯',
  Automation: '🤖',
};

export function AIRoadmapSection({ roadmap }: { roadmap: AIRoadmap }) {
  const [activePhase, setActivePhase] = useState(0);
  const phases = [roadmap.phase1, roadmap.phase2, roadmap.phase3];
  const cfg = PHASE_CONFIG[activePhase];

  return (
    <div className="space-y-5">

      {/* Summary banner */}
      <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(167,139,250,0.04))' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>AI Solutions Roadmap</p>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: '#9090B0' }}>{roadmap.executiveSummary}</p>
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#45455F' }}>Top Recommendation</p>
              <p className="text-sm font-medium" style={{ color: '#EDEDFA' }}>{roadmap.topRecommendation}</p>
            </div>
          </div>
          {roadmap.totalEstimatedROI && (
            <div className="flex-shrink-0 text-center p-5 rounded-2xl"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', minWidth: 140 }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>Total Est. ROI</p>
              <p className="text-2xl font-black tracking-tight gradient-text-primary">{roadmap.totalEstimatedROI}</p>
            </div>
          )}
        </div>
      </div>

      {/* Phase selector */}
      <div className="grid grid-cols-3 gap-3">
        {PHASE_CONFIG.map((pc, i) => {
          const phase = phases[i];
          const active = activePhase === i;
          return (
            <button key={i} onClick={() => setActivePhase(i)}
              className="p-4 rounded-2xl text-left transition-all duration-200"
              style={{
                background: active ? pc.bg : 'rgba(255,255,255,0.01)',
                border: `1px solid ${active ? pc.border : 'rgba(255,255,255,0.06)'}`,
                transform: active ? 'translateY(-1px)' : 'none',
              }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: pc.color }} />
                  <span className="text-xs font-semibold" style={{ color: pc.color }}>Phase {pc.num}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: '#45455F' }}>
                  {phase?.duration}
                </span>
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: active ? '#EDEDFA' : '#9090B0' }}>{phase?.title}</p>
              <p className="text-xs" style={{ color: '#45455F' }}>{phase?.opportunities?.length ?? 0} opportunities</p>
            </button>
          );
        })}
      </div>

      {/* Opportunities */}
      <AnimatePresence mode="wait">
        <motion.div key={activePhase}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {(phases[activePhase]?.opportunities ?? []).map((opp, i) => (
              <OpportunityCard key={opp.id} opp={opp} index={i} phaseColor={cfg.color} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OpportunityCard({ opp, index, phaseColor }: { opp: AIOpportunity; index: number; phaseColor: string }) {
  const [open, setOpen] = useState(false);
  const icon = CAT_ICONS[opp.category] ?? '🔧';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: open ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
        border: open ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s, background 0.2s',
      }}>

      <button className="w-full text-left p-4" onClick={() => setOpen(!open)}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <ImpactBadge label={opp.priority} variant="priority" />
              <span className="text-xs" style={{ color: '#45455F' }}>{opp.category}</span>
            </div>
            <h4 className="text-sm font-semibold leading-snug" style={{ color: '#EDEDFA' }}>{opp.title}</h4>
            {!open && <p className="text-xs mt-1 line-clamp-2" style={{ color: '#45455F' }}>{opp.description}</p>}
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#45455F" strokeWidth="2" className="flex-shrink-0 mt-1"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="pt-4 space-y-4">

                <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{opp.description}</p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <StatBox label="Est. ROI" value={opp.estimatedROI} color="#22C55E" />
                  <StatBox label="Timeline" value={opp.timeToImplement} color="#818CF8" />
                  <div>
                    <p className="text-xs mb-1.5" style={{ color: '#45455F' }}>Complexity</p>
                    <ImpactBadge label={opp.complexity} variant="complexity" />
                  </div>
                </div>

                {/* Impact */}
                <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#45455F' }}>Business Impact</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{opp.businessImpact}</p>
                </div>

                {/* Implementation */}
                <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6366F1' }}>How to implement</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{opp.implementationApproach}</p>
                </div>

                {/* Tools */}
                {opp.tools.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>Recommended Tools</p>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.tools.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {opp.successMetrics.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>Success Metrics</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {opp.successMetrics.map((m, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="flex-shrink-0 mt-0.5" style={{ color: '#22C55E' }}>✓</span>
                          <span style={{ color: '#9090B0' }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-xs mb-1.5" style={{ color: '#45455F' }}>{label}</p>
      <p className="text-sm font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import type { AnalysisReport } from '@/lib/types';
import { ScoreGauge, scoreColor, scoreLabel } from '@/components/ScoreGauge';

interface Props { report: AnalysisReport; onTabChange: (t: 'summary' | 'cro' | 'roadmap') => void; }

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] },
});

export function ExecutiveSummary({ report, onTabChange }: Props) {
  const { classification: cls, croAudit, aiRoadmap } = report;
  const allOpps = [...(aiRoadmap.phase1?.opportunities ?? []), ...(aiRoadmap.phase2?.opportunities ?? []), ...(aiRoadmap.phase3?.opportunities ?? [])];

  return (
    <div className="space-y-5">

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="CRO Score" value={croAudit.overallScore} suffix="/100"
          color={scoreColor(croAudit.overallScore)} sub={scoreLabel(croAudit.overallScore)}
          onClick={() => onTabChange('cro')} delay={0} />
        <KPICard label="AI Readiness" value={cls.aiReadinessScore} suffix="/100"
          color={scoreColor(cls.aiReadinessScore)} sub={scoreLabel(cls.aiReadinessScore)}
          onClick={() => onTabChange('roadmap')} delay={0.05} />
        <KPICard label="Issues Found" value={croAudit.issues.length} suffix=""
          color="#F97316" sub={`${croAudit.issues.filter(i => i.severity === 'Critical' || i.severity === 'High').length} high priority`}
          onClick={() => onTabChange('cro')} delay={0.1} />
        <KPICard label="AI Opportunities" value={allOpps.length} suffix=""
          color="#818CF8" sub="across 3 phases"
          onClick={() => onTabChange('roadmap')} delay={0.15} />
      </div>

      {/* Main 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Executive summary + scores */}
        <motion.div {...fade(0.1)} className="lg:col-span-2 space-y-4">

          {/* Summary text */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h2 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>Executive Summary</h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{aiRoadmap.executiveSummary}</p>
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#45455F' }}>Top Recommendation</p>
              <p className="text-sm font-medium" style={{ color: '#EDEDFA' }}>{aiRoadmap.topRecommendation}</p>
            </div>
          </div>

          {/* CRO dimension bars */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>CRO Dimensions</h3>
              <button onClick={() => onTabChange('cro')} className="text-xs font-medium hover:underline" style={{ color: '#6366F1' }}>
                Full audit →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                ['Hero Section', croAudit.heroScore],
                ['Navigation', croAudit.navigationScore],
                ['Call-to-Action', croAudit.ctaScore],
                ['Social Proof', croAudit.socialProofScore],
                ['Mobile UX', croAudit.mobileScore],
                ['Trust Signals', croAudit.trustScore],
                ['Content Quality', croAudit.contentScore],
              ].map(([label, score]) => (
                <DimBar key={label as string} label={label as string} score={score as number} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div {...fade(0.2)} className="space-y-4">

          {/* Business profile */}
          <div className="card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#45455F' }}>Business Profile</h3>
            <div className="space-y-3">
              {[
                ['Industry', cls.industry],
                ['Sub-industry', cls.subIndustry],
                ['Model', cls.businessModel],
                ['Audience', cls.primaryAudience],
                ['Stage', cls.maturityStage],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3">
                  <span className="text-xs flex-shrink-0" style={{ color: '#45455F' }}>{k}</span>
                  <span className="text-xs font-medium text-right" style={{ color: '#9090B0' }}>{v}</span>
                </div>
              ))}
            </div>
            {cls.currentTechStack.length > 0 && (
              <>
                <div className="divider my-4" />
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#45455F' }}>Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {cls.currentTechStack.slice(0, 8).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md font-mono"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#9090B0' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Score gauges */}
          <div className="card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#45455F' }}>Scores</h3>
            <div className="flex justify-around">
              <div className="text-center">
                <ScoreGauge score={croAudit.overallScore} size="md" showLabel />
                <p className="text-xs mt-2" style={{ color: '#45455F' }}>CRO</p>
              </div>
              <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="text-center">
                <ScoreGauge score={cls.aiReadinessScore} size="md" showLabel />
                <p className="text-xs mt-2" style={{ color: '#45455F' }}>AI Ready</p>
              </div>
            </div>
          </div>

          {/* Quick wins */}
          {croAudit.quickWins.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#45455F' }}>Quick Wins</h3>
              </div>
              <ul className="space-y-2.5">
                {croAudit.quickWins.map((w, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                    <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#22C55E' }}>→</span>
                    <span style={{ color: '#9090B0' }}>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pain points */}
          <div className="card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#45455F' }}>Key Pain Points</h3>
            <ul className="space-y-2">
              {cls.topPainPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span style={{ color: '#F97316', marginTop: 2 }}>•</span>
                  <span style={{ color: '#9090B0' }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>

        </motion.div>
      </div>

      {/* Roadmap phase preview */}
      <motion.div {...fade(0.3)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>AI Roadmap Preview</h3>
          <button onClick={() => onTabChange('roadmap')} className="text-xs font-medium hover:underline" style={{ color: '#6366F1' }}>
            Full roadmap →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { phase: aiRoadmap.phase1, color: '#22C55E', borderColor: 'rgba(34,197,94,0.2)', bgColor: 'rgba(34,197,94,0.05)', num: 1 },
            { phase: aiRoadmap.phase2, color: '#818CF8', borderColor: 'rgba(99,102,241,0.2)', bgColor: 'rgba(99,102,241,0.05)', num: 2 },
            { phase: aiRoadmap.phase3, color: '#C084FC', borderColor: 'rgba(192,132,252,0.2)', bgColor: 'rgba(192,132,252,0.05)', num: 3 },
          ].map(({ phase, color, borderColor, bgColor, num }) => (
            <button
              key={num}
              onClick={() => onTabChange('roadmap')}
              className="text-left p-5 rounded-2xl transition-all duration-200 group"
              style={{ background: bgColor, border: `1px solid ${borderColor}` }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>Phase {num}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#45455F' }}>{phase?.duration}</span>
              </div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#EDEDFA' }}>{phase?.title}</h4>
              <p className="text-xs mb-3" style={{ color: '#9090B0' }}>{phase?.opportunities?.length ?? 0} opportunities identified</p>
              <div className="flex flex-wrap gap-1.5">
                {phase?.opportunities?.slice(0, 2).map(o => (
                  <span key={o.id} className="text-xs px-2 py-0.5 rounded-md truncate max-w-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#9090B0' }}>
                    {o.title}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {aiRoadmap.totalEstimatedROI && (
          <ROICallout roi={aiRoadmap.totalEstimatedROI} onViewRoadmap={() => onTabChange('roadmap')} />
        )}
      </motion.div>
    </div>
  );
}

function KPICard({ label, value, suffix, color, sub, onClick, delay }: {
  label: string; value: number; suffix: string; color: string; sub: string; onClick: () => void; delay: number;
}) {
  return (
    <motion.button {...fade(delay)} onClick={onClick}
      className="card p-5 text-left group w-full"
      whileHover={{ y: -2 }}>
      <p className="text-xs mb-3" style={{ color: '#45455F' }}>{label}</p>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-black tabular-nums tracking-tight" style={{ color }}>{value}</span>
        {suffix && <span className="text-sm" style={{ color: '#45455F' }}>{suffix}</span>}
      </div>
      <p className="text-xs" style={{ color: '#9090B0' }}>{sub}</p>
    </motion.button>
  );
}

function ROICallout({ roi, onViewRoadmap }: { roi: string; onViewRoadmap: () => void }) {
  // Split on the first colon so we can bold the headline (e.g. "350–700% over 18 months")
  const colonIdx = roi.indexOf(':');
  const headline = colonIdx > -1 ? roi.slice(0, colonIdx).trim() : null;
  const detail   = colonIdx > -1 ? roi.slice(colonIdx + 1).trim() : roi;

  return (
    <div className="mt-4 p-5 rounded-2xl"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(167,139,250,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#45455F' }}>Total Estimated ROI</p>
          </div>
          {headline && (
            <p className="text-base font-black tracking-tight mb-1.5 gradient-text-primary">{headline}</p>
          )}
          <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{detail}</p>
        </div>
        <button onClick={onViewRoadmap} className="btn-primary px-5 py-2.5 text-sm flex-shrink-0">
          View Roadmap →
        </button>
      </div>
    </div>
  );
}

function DimBar({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ color: '#9090B0' }}>{label}</span>
        <span className="text-xs font-semibold tabular-nums" style={{ color }}>{score}</span>
      </div>
      <div className="progress-track">
        <motion.div className="progress-fill h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </div>
  );
}

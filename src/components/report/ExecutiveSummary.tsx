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

          {(aiRoadmap.clientContactBrief || aiRoadmap.tootieServiceFit) && (
            <div className="card p-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(99,102,241,0.04))' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>Tootie Handoff Brief</h2>
                  <p className="text-xs" style={{ color: '#45455F' }}>What this means before contacting Tootie Designs</p>
                </div>
              </div>

              {aiRoadmap.clientContactBrief?.plainEnglishVerdict && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#9090B0' }}>{aiRoadmap.clientContactBrief.plainEnglishVerdict}</p>
              )}

              {aiRoadmap.clientContactBrief?.whyItMatters && (
                <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#45455F' }}>Why It Matters</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{aiRoadmap.clientContactBrief.whyItMatters}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRoadmap.tootieServiceFit && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6366F1' }}>Recommended Tootie Package</p>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#EDEDFA' }}>{aiRoadmap.tootieServiceFit.recommendedTootiePackage}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9090B0' }}>{aiRoadmap.tootieServiceFit.fitRationale}</p>
                  </div>
                )}

                {aiRoadmap.clientContactBrief?.salesConversationStarters?.length ? (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>Sales Conversation Starters</p>
                    <ul className="space-y-2">
                      {aiRoadmap.clientContactBrief.salesConversationStarters.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                          <span style={{ color: '#4ADE80', marginTop: 2 }}>→</span>
                          <span style={{ color: '#9090B0' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {aiRoadmap.clientContactBrief?.whatToAskTootie?.length ? (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>What To Ask Tootie Designs</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {aiRoadmap.clientContactBrief.whatToAskTootie.slice(0, 4).map((item, i) => (
                      <div key={i} className="text-xs leading-relaxed p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', color: '#9090B0' }}>
                        <span style={{ color: '#818CF8', fontWeight: 700 }}>Q{i + 1}.</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {aiRoadmap.tootieServiceFit?.priorityFixSequence?.length ? (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.14)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#B45309' }}>Priority Fix Sequence</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {aiRoadmap.tootieServiceFit.priorityFixSequence.slice(0, 4).map((item, i) => (
                      <div key={i} className="text-xs leading-relaxed p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', color: '#9090B0' }}>
                        <span style={{ color: '#FBBF24', fontWeight: 700 }}>0{i + 1}.</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {(aiRoadmap.tootieServiceFit?.leadQualificationSignals?.length || aiRoadmap.tootieServiceFit?.suggestedNextStep) ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRoadmap.tootieServiceFit?.leadQualificationSignals?.length ? (
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.14)' }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#16A34A' }}>Lead Qualification Signals</p>
                      <ul className="space-y-2">
                        {aiRoadmap.tootieServiceFit.leadQualificationSignals.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                            <span style={{ color: '#4ADE80', marginTop: 2 }}>✓</span>
                            <span style={{ color: '#9090B0' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {aiRoadmap.tootieServiceFit?.suggestedNextStep ? (
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)' }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6366F1' }}>Suggested Next Step</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#9090B0' }}>{aiRoadmap.tootieServiceFit.suggestedNextStep}</p>
                      {aiRoadmap.tootieServiceFit.budgetSensitivity && (
                        <p className="text-xs leading-relaxed mt-3" style={{ color: '#45455F' }}>Budget read: {aiRoadmap.tootieServiceFit.budgetSensitivity}</p>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}

          {/* CRO dimension bars */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold" style={{ color: '#EDEDFA' }}>CRO Dimensions</h3>
              <button onClick={() => onTabChange('cro')} className="text-xs font-medium hover:underline" style={{ color: '#6366F1' }}>
                Full audit →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {([
                ['Value Proposition', croAudit.valuePropositionScore],
                ['Hero Section', croAudit.heroScore],
                ['Call-to-Action', croAudit.ctaScore],
                ['Social Proof', croAudit.socialProofScore],
                ['Copy Quality', croAudit.copyQualityScore],
                ['Trust Signals', croAudit.trustScore],
                ['Content Quality', croAudit.contentScore],
                ['Navigation', croAudit.navigationScore],
                ['Mobile UX', croAudit.mobileScore],
                ['Brand Consistency', croAudit.brandConsistencyScore],
                ['Accessibility', croAudit.accessibilityScore],
                ['SEO Structure', croAudit.seoScore],
              ] as [string, number][]).filter(([, s]) => s != null).map(([label, score]) => (
                <DimBar key={label} label={label} score={score} />
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
              {([
                ['Industry', cls.industry],
                ['Sub-industry', cls.subIndustry],
                ['Model', cls.businessModel],
                cls.revenueModel ? ['Revenue Model', cls.revenueModel] : null,
                ['Audience', cls.primaryAudience],
                cls.secondaryAudience ? ['Secondary', cls.secondaryAudience] : null,
                ['Stage', cls.maturityStage],
                cls.marketPositioning ? ['Positioning', cls.marketPositioning] : null,
              ] as ([string, string] | null)[]).filter((x): x is [string, string] => x !== null).map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3">
                  <span className="text-xs flex-shrink-0" style={{ color: '#45455F' }}>{k}</span>
                  <span className="text-xs font-medium text-right" style={{ color: '#9090B0' }}>{v}</span>
                </div>
              ))}
            </div>

            {cls.brandVoice && (
              <>
                <div className="divider my-4" />
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>Brand Voice</p>
                <p className="text-xs leading-relaxed" style={{ color: '#9090B0' }}>{cls.brandVoice}</p>
              </>
            )}

            {cls.competitiveMoat && (
              <>
                <div className="divider my-4" />
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#45455F' }}>Competitive Moat</p>
                <p className="text-xs leading-relaxed" style={{ color: '#9090B0' }}>{cls.competitiveMoat}</p>
              </>
            )}

            {cls.currentTechStack.length > 0 && (
              <>
                <div className="divider my-4" />
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#45455F' }}>Tech Stack Detected</p>
                <div className="flex flex-wrap gap-1.5">
                  {cls.currentTechStack.slice(0, 10).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md font-mono"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#9090B0' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}

            {cls.missingTechSignals && cls.missingTechSignals.length > 0 && (
              <>
                <div className="divider my-4" />
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#45455F' }}>Tech Gaps</p>
                <div className="flex flex-wrap gap-1.5">
                  {cls.missingTechSignals.slice(0, 6).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md font-mono"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
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
              {cls.digitalMaturityScore != null && (
                <>
                  <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="text-center">
                    <ScoreGauge score={cls.digitalMaturityScore} size="md" showLabel />
                    <p className="text-xs mt-2" style={{ color: '#45455F' }}>Digital</p>
                  </div>
                </>
              )}
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

            {cls.keyConversionBarriers && cls.keyConversionBarriers.length > 0 && (
              <>
                <div className="divider my-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#45455F' }}>Conversion Barriers</h3>
                <ul className="space-y-2">
                  {cls.keyConversionBarriers.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span style={{ color: '#EF4444', marginTop: 2 }}>✕</span>
                      <span style={{ color: '#9090B0' }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {cls.customerJobsToBeDone && cls.customerJobsToBeDone.length > 0 && (
              <>
                <div className="divider my-4" />
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#45455F' }}>Jobs to Be Done</h3>
                <ul className="space-y-2.5">
                  {cls.customerJobsToBeDone.map((j, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                      <span style={{ color: '#818CF8', marginTop: 2 }}>→</span>
                      <span style={{ color: '#9090B0' }}>{j}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
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
          <p className="text-sm leading-relaxed break-words" style={{ color: '#9090B0' }}>{roi}</p>
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

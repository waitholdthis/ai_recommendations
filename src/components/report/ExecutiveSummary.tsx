'use client';

import { motion } from 'framer-motion';
import type { AnalysisReport } from '@/lib/types';
import { ScoreGauge } from '@/components/ScoreGauge';
import { scoreToColor, scoreToLabel } from '@/lib/utils';

interface ExecutiveSummaryProps {
  report: AnalysisReport;
  onTabChange: (tab: 'summary' | 'cro' | 'roadmap') => void;
}

export function ExecutiveSummary({ report, onTabChange }: ExecutiveSummaryProps) {
  const { classification, croAudit, aiRoadmap } = report;

  return (
    <div className="space-y-6">
      {/* AI Roadmap summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg flex-shrink-0">
            🚀
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Executive Summary</h2>
            <p className="text-sm text-text-secondary">{report.businessName}</p>
          </div>
        </div>
        <p className="text-text-secondary leading-relaxed">{aiRoadmap.executiveSummary}</p>

        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Top Recommendation</p>
          <p className="text-sm text-text-primary font-medium">{aiRoadmap.topRecommendation}</p>
        </div>
      </motion.div>

      {/* Score overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard
          title="CRO Score"
          score={croAudit.overallScore}
          description={scoreToLabel(croAudit.overallScore)}
          icon="👁"
          onClick={() => onTabChange('cro')}
        />
        <ScoreCard
          title="AI Readiness"
          score={classification.aiReadinessScore}
          description={scoreToLabel(classification.aiReadinessScore)}
          icon="🤖"
          onClick={() => onTabChange('roadmap')}
        />
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏢</span>
            <span className="text-sm font-semibold text-text-primary">Business Profile</span>
          </div>
          <div className="space-y-2">
            <InfoRow label="Industry" value={classification.industry} />
            <InfoRow label="Model" value={classification.businessModel} />
            <InfoRow label="Audience" value={classification.primaryAudience} />
            <InfoRow label="Stage" value={classification.maturityStage} />
          </div>
        </div>
      </div>

      {/* 2-column: pain points + quick wins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ListCard
          icon="⚠️"
          title="Top Pain Points"
          items={classification.topPainPoints}
          itemColor="text-warning"
        />
        <ListCard
          icon="⚡"
          title="Quick Wins Available"
          items={croAudit.quickWins}
          itemColor="text-success"
        />
      </div>

      {/* Phase overview */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
          <span>📅</span> AI Roadmap Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { phase: aiRoadmap.phase1, color: 'emerald' },
            { phase: aiRoadmap.phase2, color: 'indigo' },
            { phase: aiRoadmap.phase3, color: 'purple' },
          ].map(({ phase, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border rounded-2xl p-4 card-hover cursor-pointer"
              onClick={() => onTabChange('roadmap')}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Phase {i + 1}
                </span>
                <span className="text-xs bg-surface-2 text-text-muted px-2 py-0.5 rounded-full">
                  {phase.duration}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">{phase.title}</h4>
              <p className="text-xs text-text-muted">
                {phase.opportunities.length} opportunities identified
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {phase.opportunities.slice(0, 2).map((opp) => (
                  <span
                    key={opp.id}
                    className="text-xs bg-surface-2 text-text-secondary px-2 py-0.5 rounded-full truncate max-w-full"
                  >
                    {opp.title}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Competitive advantages & strengths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ListCard
          icon="💪"
          title="Competitive Advantages"
          items={classification.competitiveAdvantages}
          itemColor="text-accent"
        />
        <ListCard
          icon="✅"
          title="CRO Strengths"
          items={croAudit.strengths}
          itemColor="text-success"
        />
      </div>

      {/* Total ROI */}
      {aiRoadmap.totalEstimatedROI && (
        <div className="bg-surface border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              Total Estimated ROI
            </p>
            <p className="text-2xl font-bold gradient-text">{aiRoadmap.totalEstimatedROI}</p>
          </div>
          <button
            onClick={() => onTabChange('roadmap')}
            className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            View Full Roadmap →
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreCard({
  title,
  score,
  description,
  icon,
  onClick,
}: {
  title: string;
  score: number;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-5 cursor-pointer card-hover"
      onClick={onClick}
    >
      <ScoreGauge score={score} size="md" />
      <div>
        <p className="text-xs text-text-muted mb-1">{icon} {title}</p>
        <p className="text-2xl font-bold" style={{ color: scoreToColor(score) }}>
          {score}
          <span className="text-sm font-normal text-text-muted">/100</span>
        </p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs text-text-muted flex-shrink-0">{label}</span>
      <span className="text-xs text-text-secondary text-right">{value}</span>
    </div>
  );
}

function ListCard({
  icon,
  title,
  items,
  itemColor,
}: {
  icon: string;
  title: string;
  items: string[];
  itemColor: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h4 className="text-sm font-semibold text-text-primary mb-4">
        {icon} {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={`mt-0.5 text-xs ${itemColor}`}>•</span>
            <span className="text-text-secondary leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

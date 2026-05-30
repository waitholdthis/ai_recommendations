'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { AnalysisReport } from '@/lib/types';
import { formatUrl } from '@/lib/utils';
import { scoreColor } from '@/components/ScoreGauge';
import { ExecutiveSummary } from './ExecutiveSummary';
import { CROAuditSection } from './CROAudit';
import { AIRoadmapSection } from './AIRoadmap';

type Tab = 'summary' | 'cro' | 'roadmap';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'summary',
    label: 'Overview',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    id: 'cro',
    label: 'CRO Audit',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  },
  {
    id: 'roadmap',
    label: 'AI Roadmap',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  },
];

function ScorePill({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <span className="text-xs" style={{ color: '#45455F' }}>{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{score}</span>
        <span className="text-xs" style={{ color: '#45455F' }}>/100</span>
      </div>
    </div>
  );
}

export function ReportViewer({ report, onReset }: { report: AnalysisReport; onReset: () => void }) {
  const [tab, setTab] = useState<Tab>('summary');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const slug = report.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      a.href = url;
      a.download = `tootie-growth-audit-${slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [report]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070F' }}>

      {/* Sticky header */}
      <header className="sticky top-0 z-50 glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Top row */}
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Back */}
              <button onClick={onReset} className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5 flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                New
              </button>
              <div className="w-px h-4 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="min-w-0">
                <h1 className="text-sm font-semibold truncate" style={{ color: '#EDEDFA' }}>{report.businessName} Website Growth Audit</h1>
                <a href={report.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs truncate flex items-center gap-1 hover:underline"
                  style={{ color: '#45455F' }}>
                  {formatUrl(report.url)}
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <ScorePill label="CRO" score={report.croAudit.overallScore} />
              <ScorePill label="AI Readiness" score={report.classification.aiReadinessScore} />
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {new Date(report.analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Building PDF…
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Export Audit PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 -mb-px">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-t-xl"
                style={{ color: tab === t.id ? '#818CF8' : '#45455F' }}
              >
                <span style={{ opacity: tab === t.id ? 1 : 0.7 }}>{t.icon}</span>
                {t.label}
                {tab === t.id && (
                  <motion.div layoutId="tab-line" className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6366F1, #A78BFA)' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === 'summary' && <ExecutiveSummary report={report} onTabChange={setTab} />}
          {tab === 'cro'     && <CROAuditSection audit={report.croAudit} />}
          {tab === 'roadmap' && <AIRoadmapSection roadmap={report.aiRoadmap} />}
        </motion.div>
      </main>
    </div>
  );
}

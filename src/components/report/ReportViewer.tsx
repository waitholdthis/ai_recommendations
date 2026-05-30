'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AnalysisReport } from '@/lib/types';
import { formatUrl, scoreToColor, scoreToLabel } from '@/lib/utils';
import { ExecutiveSummary } from './ExecutiveSummary';
import { CROAuditSection } from './CROAudit';
import { AIRoadmapSection } from './AIRoadmap';

type Tab = 'summary' | 'cro' | 'roadmap';

interface ReportViewerProps {
  report: AnalysisReport;
  onReset: () => void;
}

export function ReportViewer({ report, onReset }: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'summary', label: 'Executive Summary', icon: '📊' },
    { id: 'cro', label: 'CRO Audit', icon: '👁' },
    { id: 'roadmap', label: 'AI Roadmap', icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm">
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-semibold text-text-primary">{report.businessName}</h1>
              <p className="text-xs text-text-muted">{formatUrl(report.url)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Overall score */}
            <div className="hidden sm:flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2">
              <span className="text-xs text-text-muted">CRO Score</span>
              <span
                className="text-sm font-bold"
                style={{ color: scoreToColor(report.croAudit.overallScore) }}
              >
                {report.croAudit.overallScore}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2">
              <span className="text-xs text-text-muted">AI Readiness</span>
              <span
                className="text-sm font-bold"
                style={{ color: scoreToColor(report.classification.aiReadinessScore) }}
              >
                {report.classification.aiReadinessScore}
              </span>
            </div>
            <button
              onClick={onReset}
              className="text-xs bg-surface hover:bg-surface-2 border border-border text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 pb-0">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'summary' && (
            <ExecutiveSummary report={report} onTabChange={setActiveTab} />
          )}
          {activeTab === 'cro' && <CROAuditSection audit={report.croAudit} />}
          {activeTab === 'roadmap' && <AIRoadmapSection roadmap={report.aiRoadmap} />}
        </motion.div>
      </div>
    </div>
  );
}

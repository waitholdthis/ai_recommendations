'use client';

import { motion } from 'framer-motion';
import type { ProgressStage } from '@/lib/types';

const STAGES: { key: ProgressStage; label: string; icon: string }[] = [
  { key: 'scraping', label: 'Crawling Website', icon: '🔍' },
  { key: 'classifying', label: 'Classifying Business', icon: '🧠' },
  { key: 'visual_analysis', label: 'Visual CRO Audit', icon: '👁' },
  { key: 'roadmap', label: 'Building AI Roadmap', icon: '🚀' },
  { key: 'finalizing', label: 'Finalizing Report', icon: '📋' },
];

const STAGE_ORDER: ProgressStage[] = [
  'initializing',
  'scraping',
  'classifying',
  'visual_analysis',
  'roadmap',
  'finalizing',
  'complete',
];

function getStageIndex(stage: ProgressStage): number {
  return STAGE_ORDER.indexOf(stage);
}

interface LoadingStateProps {
  stage: ProgressStage;
  message: string;
  progress: number;
}

export function LoadingState({ stage, message, progress }: LoadingStateProps) {
  const currentIndex = getStageIndex(stage);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Animated logo mark */}
        <div className="flex justify-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-lg">⚡</span>
            </div>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-center text-text-primary mb-2">
          Analyzing your website
        </h2>
        <p className="text-text-secondary text-center text-sm mb-8">{message}</p>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between text-xs text-text-muted mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stage steps */}
        <div className="space-y-3">
          {STAGES.map((s, index) => {
            const stageIdx = getStageIndex(s.key);
            const isDone = stageIdx < currentIndex;
            const isActive = s.key === stage;
            const isPending = stageIdx > currentIndex;

            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary/10 border border-primary/20'
                    : isDone
                    ? 'bg-surface border border-border'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                    isDone
                      ? 'bg-success/20 text-success'
                      : isActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-2'
                  }`}
                >
                  {isDone ? '✓' : s.icon}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-text-primary'
                      : isDone
                      ? 'text-text-secondary'
                      : 'text-text-muted'
                  }`}
                >
                  {s.label}
                </span>
                {isActive && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-auto w-2 h-2 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-text-muted mt-8">
          This analysis typically takes 60–90 seconds
        </p>
      </div>
    </div>
  );
}

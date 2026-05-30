'use client';

import { motion } from 'framer-motion';
import type { ProgressStage } from '@/lib/types';

const STEPS: { key: ProgressStage; label: string; detail: string }[] = [
  { key: 'scraping',        label: 'Crawling website',      detail: 'Screenshot & DOM extraction' },
  { key: 'classifying',     label: 'Classifying business',  detail: 'Industry, model & AI readiness' },
  { key: 'visual_analysis', label: 'Visual CRO audit',      detail: 'Multimodal AI screenshot analysis' },
  { key: 'roadmap',         label: 'Building AI roadmap',   detail: '3-phase implementation plan' },
  { key: 'finalizing',      label: 'Compiling report',      detail: 'Assembling final output' },
];

const ORDER: ProgressStage[] = ['initializing','scraping','classifying','visual_analysis','roadmap','finalizing','complete'];

function idx(s: ProgressStage) { return ORDER.indexOf(s); }

export function LoadingState({ stage, message, progress }: { stage: ProgressStage; message: string; progress: number }) {
  const cur = idx(stage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ background: '#07070F' }}>

      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb-primary" style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Spinner ring */}
        <div className="flex justify-center mb-10">
          <div className="relative w-20 h-20">
            <svg className="absolute inset-0 animate-spin-slow" width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="3" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ring-grad)" strokeWidth="3"
                strokeLinecap="round" strokeDasharray="60 154" />
              <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: '#EDEDFA' }}>Analyzing your website</h2>
          <motion.p key={message} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-sm" style={{ color: '#9090B0' }}>
            {message}
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2" style={{ color: '#45455F' }}>
            <span>Progress</span>
            <span style={{ color: '#6366F1', fontWeight: 600 }}>{Math.round(progress)}%</span>
          </div>
          <div className="progress-track">
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          {STEPS.map((step, i) => {
            const stepIdx = idx(step.key);
            const done = stepIdx < cur;
            const active = step.key === stage;
            const pending = stepIdx > cur;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: pending ? 0.3 : 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                }}
              >
                {/* Icon */}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    background: done ? 'rgba(34,197,94,0.12)' : active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    border: done ? '1px solid rgba(34,197,94,0.3)' : active ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    color: done ? '#22C55E' : active ? '#818CF8' : '#45455F',
                  }}
                >
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: done ? '#9090B0' : active ? '#EDEDFA' : '#45455F' }}>
                    {step.label}
                  </div>
                  <div className="text-xs" style={{ color: '#45455F' }}>{step.detail}</div>
                </div>

                {active && (
                  <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#6366F1' }} />
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: '#45455F' }}>
          Typical analysis: 60–90 seconds
        </p>
      </div>
    </div>
  );
}

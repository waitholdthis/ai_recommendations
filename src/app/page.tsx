'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { URLInput } from '@/components/URLInput';
import { LoadingState } from '@/components/LoadingState';
import { ReportViewer } from '@/components/report/ReportViewer';
import type { AnalysisReport, ProgressUpdate, ProgressStage } from '@/lib/types';
import { normalizeUrl } from '@/lib/utils';

type AppState = 'idle' | 'loading' | 'complete' | 'error';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyze = useCallback(async (rawUrl: string) => {
    const url = normalizeUrl(rawUrl);
    setAppState('loading');
    setProgress({ stage: 'initializing', message: 'Initializing analysis engine...', progress: 5 });
    setReport(null);
    setErrorMessage('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok || !res.body) throw new Error(`Server error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const update = JSON.parse(line.slice(6)) as ProgressUpdate;
            setProgress(update);
            if (update.stage === 'complete' && update.data) {
              setReport(update.data as AnalysisReport);
              setAppState('complete');
            } else if (update.stage === 'error') {
              setErrorMessage(update.error || update.message);
              setAppState('error');
            }
          } catch {}
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unexpected error');
      setAppState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState('idle');
    setProgress(null);
    setReport(null);
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence mode="wait">
      {appState === 'idle' && (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <HeroPage onAnalyze={handleAnalyze} />
        </motion.div>
      )}
      {appState === 'loading' && progress && (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoadingState stage={progress.stage as ProgressStage} message={progress.message} progress={progress.progress} />
        </motion.div>
      )}
      {appState === 'error' && (
        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ErrorPage message={errorMessage} onReset={handleReset} />
        </motion.div>
      )}
      {appState === 'complete' && report && (
        <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ReportViewer report={report} onReset={handleReset} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const EXAMPLES = ['apple.com', 'stripe.com', 'shopify.com', 'linear.app', 'notion.so'];

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Visual CRO Audit',
    desc: 'Multimodal AI analyzes your screenshot for conversion killers with specific fixes and impact scores.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'AI Solutions Roadmap',
    desc: '3-phase implementation plan with named tools, realistic timelines, and estimated ROI for each initiative.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: 'Business Intelligence',
    desc: 'Deep classification of industry, model, audience, pain points, and AI readiness — all from a single URL.',
  },
];

function HeroPage({ onAnalyze }: { onAnalyze: (url: string) => void }) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#07070F' }}>

      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb-primary" style={{ width: 800, height: 800, top: '-200px', left: '50%', transform: 'translateX(-50%)' }} />
        <div className="orb-violet" style={{ width: 500, height: 500, bottom: '10%', right: '-100px' }} />
        <div className="orb-primary" style={{ width: 400, height: 400, bottom: '20%', left: '-100px', opacity: 0.5 }} />
        <div
          className="absolute inset-0 bg-grid-faint"
          style={{ backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)' }}
        />
      </div>

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: '#EDEDFA' }}>AI-BizScout</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse-dot" />
          Powered by Claude Opus 4.7
        </div>
      </header>

      {/* Hero content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div className="max-w-3xl w-full mx-auto text-center" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>

          {/* Eyebrow */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 text-xs font-medium mb-8 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9090B0' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
            Business Intelligence · CRO Audit · AI Roadmap
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            className="font-black mb-6 leading-none tracking-tighter"
            style={{ fontSize: 'clamp(42px, 7vw, 72px)', color: '#EDEDFA' }}
          >
            Turn any website into
            <br />
            <span className="gradient-text">an AI growth engine</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="text-lg mb-12 max-w-xl mx-auto leading-relaxed"
            style={{ color: '#9090B0' }}
          >
            Drop any business URL and get a multimodal AI analysis — visual CRO audit, business classification, and a 3-phase AI solutions roadmap in under 90 seconds.
          </motion.p>

          {/* URL Input */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <URLInput onAnalyze={onAnalyze} />
          </motion.div>

          {/* Examples */}
          <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-xs" style={{ color: '#45455F' }}>Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => onAnalyze(ex)}
                className="text-xs px-2.5 py-1 rounded-md font-mono transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6366F1' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(99,102,241,0.08)'; (e.target as HTMLElement).style.borderColor = 'rgba(99,102,241,0.25)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                {ex}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          className="relative z-10 max-w-4xl w-full mx-auto mt-24 px-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card p-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#EDEDFA' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9090B0' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ErrorPage({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#07070F' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center card p-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-3" style={{ color: '#EDEDFA' }}>Analysis Failed</h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: '#9090B0' }}>{message}</p>
        <button onClick={onReset} className="btn-primary px-6 py-3 text-sm w-full">
          Try Another URL
        </button>
      </motion.div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAnalyze = useCallback(async (rawUrl: string) => {
    const url = normalizeUrl(rawUrl);
    setAppState('loading');
    setProgress({ stage: 'initializing', message: 'Initializing analysis...', progress: 5 });
    setReport(null);
    setErrorMessage('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server error: ${res.status}`);
      }

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
          if (line.startsWith('data: ')) {
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
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAppState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState('idle');
    setProgress(null);
    setReport(null);
    setErrorMessage('');
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {appState === 'idle' && <HeroSection onAnalyze={handleAnalyze} />}
      {appState === 'loading' && progress && (
        <LoadingState stage={progress.stage as ProgressStage} message={progress.message} progress={progress.progress} />
      )}
      {appState === 'error' && (
        <ErrorSection message={errorMessage} onReset={handleReset} />
      )}
      {appState === 'complete' && report && (
        <ReportViewer report={report} onReset={handleReset} />
      )}
    </main>
  );
}

function HeroSection({ onAnalyze }: { onAnalyze: (url: string) => void }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-50"
        style={{ backgroundSize: '40px 40px' }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs text-primary font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Powered by Claude Opus 4.7
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          <span className="text-text-primary">Transform any website into an </span>
          <span className="gradient-text">AI Growth Blueprint</span>
        </h1>

        <p className="text-lg text-text-secondary mb-12 max-w-xl mx-auto leading-relaxed">
          Drop any business URL and get a comprehensive AI Solutions Roadmap + Conversion
          Rate Optimization audit — powered by multimodal AI vision analysis.
        </p>

        <URLInput onAnalyze={onAnalyze} />

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[
            '🔍 Visual CRO Audit',
            '🤖 AI Solutions Roadmap',
            '📊 Business Classification',
            '⚡ Quick Win Actions',
          ].map((feature) => (
            <span
              key={feature}
              className="text-xs bg-surface border border-border rounded-full px-3 py-1.5 text-text-secondary"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorSection({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-3">Analysis Failed</h2>
        <p className="text-text-secondary mb-8 leading-relaxed">{message}</p>
        <button
          onClick={onReset}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          Try Another URL
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, FormEvent } from 'react';
import { motion } from 'framer-motion';

export function URLInput({ onAnalyze }: { onAnalyze: (url: string) => void }) {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (val: string): boolean => {
    const t = val.trim();
    if (!t) { setError('Enter a website URL to analyze'); return false; }
    try { new URL(t.startsWith('http') ? t : `https://${t}`); setError(''); return true; }
    catch { setError('Please enter a valid URL (e.g. shopify.com)'); return false; }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate(url)) onAnalyze(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={focused ? {
            boxShadow: '0 0 0 1px rgba(99,102,241,0.6), 0 0 0 4px rgba(99,102,241,0.12), 0 8px 32px rgba(0,0,0,0.5)'
          } : {
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)'
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center rounded-2xl overflow-hidden"
          style={{ background: 'rgba(13,13,26,0.9)' }}
        >
          {/* Globe icon */}
          <div className="pl-5 flex-shrink-0" style={{ color: focused ? '#6366F1' : '#45455F' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); if (error) setError(''); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter any business website URL..."
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none min-w-0 font-medium"
            style={{ color: '#EDEDFA', caretColor: '#6366F1' }}
            autoComplete="off"
            spellCheck={false}
          />

          <div className="p-2 flex-shrink-0">
            <button type="submit" className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
              Analyze
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </motion.div>
      </form>

      <AnimatedError error={error} />
    </div>
  );
}

function AnimatedError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mt-3 justify-center"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
      <span className="text-xs font-medium" style={{ color: '#EF4444' }}>{error}</span>
    </motion.div>
  );
}

'use client';

import { useState, useRef, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface URLInputProps {
  onAnalyze: (url: string) => void;
}

export function URLInput({ onAnalyze }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please enter a URL');
      return false;
    }
    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    try {
      new URL(normalized);
      setError('');
      return true;
    } catch {
      setError('Please enter a valid URL (e.g. example.com)');
      return false;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate(url)) {
      onAnalyze(url);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{
            boxShadow: focused
              ? '0 0 0 2px rgba(99,102,241,0.5), 0 0 30px rgba(99,102,241,0.15)'
              : '0 0 0 1px rgba(42,42,58,1)',
          }}
          transition={{ duration: 0.2 }}
          className="flex items-center bg-surface rounded-2xl overflow-hidden"
        >
          <div className="flex-shrink-0 pl-5 text-text-muted">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter any business website URL..."
            className="flex-1 bg-transparent px-4 py-4 text-text-primary placeholder-text-muted text-base outline-none min-w-0"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="flex-shrink-0 m-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-glow whitespace-nowrap"
          >
            Analyze Site
          </button>
        </motion.div>
      </form>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-danger text-center"
        >
          {error}
        </motion.p>
      )}

      <p className="mt-4 text-xs text-text-muted text-center">
        Works with any public website — stores, agencies, SaaS products, local businesses
      </p>
    </div>
  );
}

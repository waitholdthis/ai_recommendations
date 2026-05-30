'use client';

import { motion } from 'framer-motion';
import { scoreToColor, scoreToLabel } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const sizes = { sm: 64, md: 96, lg: 128 };
  const dim = sizes[size];
  const radius = (dim / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = scoreToColor(score);
  const strokeWidth = size === 'sm' ? 5 : size === 'md' ? 6 : 8;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="rgba(42,42,58,1)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold"
            style={{
              color,
              fontSize: size === 'sm' ? '14px' : size === 'md' ? '20px' : '28px',
            }}
          >
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-text-muted text-center leading-tight">{label}</span>
      )}
    </div>
  );
}

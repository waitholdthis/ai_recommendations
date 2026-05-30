'use client';

import { motion } from 'framer-motion';

function scoreColor(n: number) {
  if (n >= 80) return '#22C55E';
  if (n >= 65) return '#84CC16';
  if (n >= 50) return '#EAB308';
  if (n >= 35) return '#F97316';
  return '#EF4444';
}

function scoreLabel(n: number) {
  if (n >= 80) return 'Excellent';
  if (n >= 65) return 'Good';
  if (n >= 50) return 'Fair';
  if (n >= 35) return 'Poor';
  return 'Critical';
}

interface Props { score: number; label?: string; size?: 'sm' | 'md' | 'lg'; showLabel?: boolean; }

export function ScoreGauge({ score, label, size = 'md', showLabel = false }: Props) {
  const dim = size === 'sm' ? 60 : size === 'md' ? 88 : 120;
  const sw = size === 'sm' ? 4 : size === 'md' ? 5.5 : 7;
  const r = (dim / 2) - sw - 2;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75; // 270° arc
  const fill = arc * (score / 100);
  const gap = circ - arc;
  const color = scoreColor(score);
  const fontSize = size === 'sm' ? 13 : size === 'md' ? 18 : 26;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} style={{ transform: 'rotate(135deg)' }}>
          {/* Track */}
          <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw}
            strokeLinecap="round" strokeDasharray={`${arc} ${gap}`} />
          {/* Fill */}
          <motion.circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke={color} strokeWidth={sw}
            strokeLinecap="round" strokeDasharray={`${fill} ${circ - fill}`}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${fill} ${circ - fill}` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-black leading-none tabular-nums"
            style={{ fontSize, color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {score}
          </motion.span>
          {showLabel && (
            <span className="text-[10px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              /100
            </span>
          )}
        </div>
      </div>
      {label && <span className="text-xs text-center leading-snug" style={{ color: '#9090B0', maxWidth: dim }}>{label}</span>}
    </div>
  );
}

export { scoreColor, scoreLabel };

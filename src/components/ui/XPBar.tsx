'use client';

import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  title: string;
}

export default function XPBar({ currentXP, maxXP, level, title }: XPBarProps) {
  const pct = Math.min(100, Math.round((currentXP / maxXP) * 100));

  return (
    <div style={{ width: '100%' }}>
      {/* Level + Title row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '10px',
            color: 'var(--accent-gold)',
          }}
        >
          Lv.{level}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: '12px',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '10px',
            color: 'var(--accent-blue)',
          }}
        >
          {currentXP}/{maxXP} XP
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          width: '100%',
          height: '16px',
          background: 'var(--bg-primary)',
          boxShadow: '0 -2px 0 0 #4A5568, 2px 0 0 0 #4A5568, 0 2px 0 0 #4A5568, -2px 0 0 0 #4A5568',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            background: `linear-gradient(90deg, var(--accent-green) 0%, #81C784 100%)`,
            imageRendering: 'pixelated',
          }}
        />

        {/* Segment ticks every 10% */}
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i + 1) * 10}%`,
              top: 0,
              width: '2px',
              height: '100%',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

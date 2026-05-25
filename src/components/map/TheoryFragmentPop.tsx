'use client';

import { motion } from 'framer-motion';
import type { TheoryFragment } from '@/data/map/fragments';

const MODULE_NAMES: Record<number, string> = {
  1: '認知迷霧',
  2: '決策峰頂',
  3: '影響力廊',
  4: '群體引力',
  5: '策略高地',
  6: '組織迷宮',
};

interface Props {
  fragment: TheoryFragment;
  onDismiss: () => void;
}

export default function TheoryFragmentPop({ fragment, onDismiss }: Props) {
  return (
    <>
      {/* Overlay + centered container — click backdrop to dismiss */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 450,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={onDismiss}
      >
      {/* Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(480px, 92vw)',
          maxHeight: '88vh',
          background: '#0D1B2A',
          boxShadow: pixelShadow(fragment.color),
          overflowY: 'auto',
        }}
      >
        {/* Header glow strip */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, transparent, ${fragment.color}, transparent)`,
          opacity: 0.7,
        }} />

        <div style={{ padding: '28px 28px 24px' }}>
          {/* Title label */}
          <p style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 9,
            color: 'var(--accent-gold)',
            letterSpacing: 3,
            margin: '0 0 16px',
          }}>
            📖 理論碎片發現！
          </p>

          {/* Module badge */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 8,
              color: fragment.color,
              letterSpacing: 2,
              padding: '4px 10px',
              background: `rgba(${hexToRgb(fragment.color)}, 0.12)`,
              border: `1px solid ${fragment.color}`,
            }}>
              MODULE {fragment.moduleId} — {MODULE_NAMES[fragment.moduleId] ?? ''}
            </span>
          </div>

          {/* Emoji + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{
              width: 64, height: 64,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40,
              border: `3px solid ${fragment.color}`,
              boxShadow: `0 0 20px 4px ${fragment.color}44`,
              flexShrink: 0,
              background: `rgba(${hexToRgb(fragment.color)}, 0.06)`,
            }}>
              {fragment.emoji}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 12,
              color: fragment.color,
              letterSpacing: 1,
              margin: 0,
              lineHeight: 1.5,
            }}>
              {fragment.title}
            </h2>
          </div>

          {/* Content */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `3px solid ${fragment.color}`,
            marginBottom: 24,
          }}>
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: 13,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              margin: 0,
              opacity: 0.9,
            }}>
              {fragment.content}
            </p>
          </div>

          {/* Dismiss button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onDismiss}
              style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: 9,
                color: '#0D1B2A',
                background: fragment.color,
                border: 'none',
                padding: '10px 22px',
                cursor: 'pointer',
                letterSpacing: 1,
                boxShadow: `4px 4px 0 0 rgba(0,0,0,0.5)`,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              收入典藏 ▶
            </button>
          </div>
        </div>

        {/* Bottom glow strip */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, transparent, ${fragment.color}, transparent)`,
          opacity: 0.4,
        }} />
      </motion.div>
      </motion.div>
    </>
  );
}

function pixelShadow(color: string): string {
  return [
    `0 -6px 0 0 ${color}`, `6px 0 0 0 ${color}`,
    `0 6px 0 0 ${color}`, `-6px 0 0 0 ${color}`,
    `6px -6px 0 0 ${color}`, `6px 6px 0 0 ${color}`,
    `-6px 6px 0 0 ${color}`, `-6px -6px 0 0 ${color}`,
  ].join(', ');
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255, 215, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StoryPage {
  title?: string;
  body: string;
  visual?: string;
  mood?: 'normal' | 'dramatic' | 'warning' | 'success';
}

export interface StoryQuestProps {
  pages: StoryPage[];
  xpReward: number;
  onComplete: (xp: number) => void;
}

const MOOD_CONFIG: Record<
  NonNullable<StoryPage['mood']>,
  { accent: string; luluLabel: string; luluBg: string }
> = {
  normal:    { accent: '#29B6F6', luluLabel: '★',  luluBg: '#29B6F6' },
  dramatic:  { accent: '#FFD700', luluLabel: '!!', luluBg: '#FFD700' },
  warning:   { accent: '#FF6B6B', luluLabel: '⚠',  luluBg: '#FF6B6B' },
  success:   { accent: '#4CAF50', luluLabel: '✓',  luluBg: '#4CAF50' },
};

export default function StoryQuest({ pages, xpReward, onComplete }: StoryQuestProps) {
  const [pageIdx, setPageIdx] = useState(0);
  const [showXP, setShowXP] = useState(false);

  const isLast = pageIdx === pages.length - 1;
  const page = pages[pageIdx];
  const mood = page.mood ?? 'normal';
  const cfg = MOOD_CONFIG[mood];

  function advance() {
    if (isLast) {
      setShowXP(true);
      setTimeout(() => {
        setShowXP(false);
        onComplete(xpReward);
      }, 900);
    } else {
      setPageIdx((i) => i + 1);
    }
  }

  // SPACE key → advance
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); advance(); }
    },
    [pageIdx, isLast], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>

      {/* ── Page content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pageIdx}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
            background: 'var(--bg-secondary)',
            padding: '20px',
            boxShadow: pixelShadow(cfg.accent),
          }}
        >
          {/* Left: Lulu avatar (visual emoji shown inside when provided) */}
          <div
            aria-label="Lulu"
            style={{
              flexShrink: 0,
              width: 56,
              height: 56,
              background: cfg.luluBg,
              boxShadow: [
                `0 -4px 0 0 ${cfg.accent}`,
                `4px 0 0 0 ${cfg.accent}`,
                `0 4px 0 0 ${cfg.accent}`,
                `-4px 0 0 0 ${cfg.accent}`,
              ].join(', '),
              imageRendering: 'pixelated',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: page.visual ? '26px' : '16px',
              color: '#0D1B2A',
              userSelect: 'none',
            }}
          >
            {page.visual ?? cfg.luluLabel}
          </div>

          {/* Right: text content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {page.title && (
              <p style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '9px',
                color: cfg.accent,
                letterSpacing: '2px',
                margin: '0 0 10px',
              }}>
                {page.title}
              </p>
            )}
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '15px',
              lineHeight: 1.75,
              color: 'var(--text-primary)',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {renderBold(page.body)}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Progress dots ── */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {pages.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === pageIdx ? 14 : 8,
              height: 8,
              background: i === pageIdx ? cfg.accent : i < pageIdx ? cfg.accent + '66' : '#2D3748',
              transition: 'width 0.2s ease, background 0.2s ease',
              boxShadow: i === pageIdx ? `0 0 6px 2px ${cfg.accent}55` : undefined,
            }}
          />
        ))}
      </div>

      {/* ── Action row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Page counter */}
        <span style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '9px',
          color: 'rgba(245,240,232,0.35)',
          letterSpacing: '1px',
        }}>
          {pageIdx + 1} / {pages.length}
        </span>

        {/* Next / Complete button */}
        <div style={{ position: 'relative' }}>
          {/* Floating XP */}
          <AnimatePresence>
            {showXP && (
              <motion.div
                key="xp"
                initial={{ opacity: 1, y: 0, x: '-50%' }}
                animate={{ opacity: 0, y: -44 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '13px',
                  color: 'var(--accent-gold)',
                  pointerEvents: 'none',
                  textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap',
                }}
              >
                +{xpReward} XP
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={advance}
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: '9px',
              color: '#0D1B2A',
              background: isLast ? 'var(--accent-gold)' : cfg.accent,
              border: 'none',
              padding: '10px 22px',
              cursor: 'pointer',
              letterSpacing: '1px',
              boxShadow: `4px 4px 0 0 rgba(0,0,0,0.5)`,
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
          >
            {isLast ? '完成 ✓' : '繼續 ▶'}
          </button>
        </div>
      </div>

      {/* Hint */}
      <p style={{
        fontFamily: 'var(--font-pixel), monospace',
        fontSize: '9px',
        color: 'rgba(245,240,232,0.25)',
        textAlign: 'center',
        margin: 0,
        letterSpacing: '1px',
      }}>
        SPACE / 點擊繼續
      </p>
    </div>
  );
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split('**');
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function pixelShadow(color: string): string {
  return [
    `0 -4px 0 0 ${color}`,
    `4px 0 0 0 ${color}`,
    `0 4px 0 0 ${color}`,
    `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`,
    `4px 4px 0 0 ${color}`,
    `-4px 4px 0 0 ${color}`,
    `-4px -4px 0 0 ${color}`,
  ].join(', ');
}

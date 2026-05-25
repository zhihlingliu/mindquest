'use client';

import { ReactNode } from 'react';
import XPBar from '@/components/ui/XPBar';

interface QuestLayoutProps {
  moduleName: string;
  questName: string;
  /** 0‒1 */
  progress: number;
  currentXP: number;
  maxXP: number;
  level: number;
  levelTitle: string;
  children: ReactNode;
}

export default function QuestLayout({
  moduleName,
  questName,
  progress,
  currentXP,
  maxXP,
  level,
  levelTitle,
  children,
}: QuestLayoutProps) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '4px solid var(--accent-blue)',
          padding: '10px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {/* Module / Quest names */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: '9px',
              color: 'var(--accent-blue)',
              letterSpacing: '2px',
              opacity: 0.8,
            }}
          >
            {moduleName}
          </span>
          <span style={{ color: 'var(--accent-blue)', opacity: 0.4, fontSize: '10px' }}>›</span>
          <span
            style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {questName}
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: '9px',
              color: 'var(--text-primary)',
              opacity: 0.5,
            }}
          >
            {pct}%
          </span>
        </div>

        {/* Quest progress bar */}
        <div
          style={{
            height: '4px',
            background: 'var(--bg-primary)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${pct}%`,
              background: 'var(--accent-blue)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </header>

      {/* ── Main content ── */}
      <main
        style={{
          flex: 1,
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          padding: '32px 20px',
        }}
      >
        {children}
      </main>

      {/* ── Footer: XP bar ── */}
      <footer
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '4px solid #4A5568',
          padding: '10px 20px',
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          alignSelf: 'stretch',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <XPBar currentXP={currentXP} maxXP={maxXP} level={level} title={levelTitle} />
        </div>
      </footer>
    </div>
  );
}

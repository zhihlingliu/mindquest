'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LuluDialogue from '@/components/lulu/LuluDialogue';
import { usePlayerStore } from '@/store/playerStore';

const LULU_MESSAGE = '你現在的選擇，是基於資訊，還是基於情緒？';

export default function LandingPage() {
  const router = useRouter();
  const playerType = usePlayerStore((s) => s.playerType);

  useEffect(() => {
    if (playerType) router.replace('/dashboard');
  }, [playerType, router]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Background star-field decoration ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {STARS.map((s) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              background: 'var(--text-primary)',
              opacity: s.opacity,
              imageRendering: 'pixelated',
            }}
          />
        ))}
      </div>

      {/* ── Centre hero ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '9px',
            color: 'var(--accent-blue)',
            letterSpacing: '4px',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Where Theory Becomes Mastery
        </p>

        {/* Main title */}
        <h1
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: 'clamp(22px, 6vw, 48px)',
            color: 'var(--accent-gold)',
            letterSpacing: '4px',
            margin: 0,
            textAlign: 'center',
            textShadow: '0 0 24px rgba(255,215,0,0.5), 4px 4px 0 rgba(0,0,0,0.8)',
            lineHeight: 1.4,
          }}
        >
          MindQuest
        </h1>

        {/* Sub-title */}
        <p
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: 'clamp(14px, 2.5vw, 20px)',
            color: 'var(--text-primary)',
            opacity: 0.75,
            margin: 0,
            letterSpacing: '6px',
            textAlign: 'center',
          }}
        >
          管理者的試煉
        </p>

        {/* Divider */}
        <div
          style={{
            width: '160px',
            height: '4px',
            background: `linear-gradient(90deg, transparent, var(--accent-gold), transparent)`,
          }}
        />

        {/* CTA button */}
        <button
          onClick={() => router.push('/onboarding')}
          className="pixel-cta"
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '12px',
            letterSpacing: '3px',
            color: '#0D1B2A',
            background: 'var(--accent-gold)',
            border: 'none',
            padding: '14px 32px',
            cursor: 'pointer',
            position: 'relative',
            /* pixel border */
            boxShadow: [
              '0 -4px 0 0 #B8860B',
              '4px 0 0 0 #B8860B',
              '0 4px 0 0 #B8860B',
              '-4px 0 0 0 #B8860B',
              '4px -4px 0 0 #B8860B',
              '4px 4px 0 0 #B8860B',
              '-4px 4px 0 0 #B8860B',
              '-4px -4px 0 0 #B8860B',
              '8px 8px 0 0 rgba(0,0,0,0.7)',
            ].join(', '),
            transition: 'box-shadow 0.15s ease, transform 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = [
              '0 -4px 0 0 #FFD700',
              '4px 0 0 0 #FFD700',
              '0 4px 0 0 #FFD700',
              '-4px 0 0 0 #FFD700',
              '4px -4px 0 0 #FFD700',
              '4px 4px 0 0 #FFD700',
              '-4px 4px 0 0 #FFD700',
              '-4px -4px 0 0 #FFD700',
              '8px 8px 0 0 rgba(0,0,0,0.7)',
              '0 0 24px 6px rgba(255,215,0,0.55)',
            ].join(', ');
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = [
              '0 -4px 0 0 #B8860B',
              '4px 0 0 0 #B8860B',
              '0 4px 0 0 #B8860B',
              '-4px 0 0 0 #B8860B',
              '4px -4px 0 0 #B8860B',
              '4px 4px 0 0 #B8860B',
              '-4px 4px 0 0 #B8860B',
              '-4px -4px 0 0 #B8860B',
              '8px 8px 0 0 rgba(0,0,0,0.7)',
            ].join(', ');
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          ▶ 開始你的試煉
        </button>
      </div>

      {/* ── Bottom Lulu Dialogue ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto',
          paddingBottom: '32px',
        }}
      >
        <LuluDialogue message={LULU_MESSAGE} mood="thinking" />
      </div>
    </main>
  );
}

/* ── Static star data (deterministic, no random) ── */
const STARS: { id: number; x: string; y: string; size: string; opacity: number }[] = [
  { id: 0,  x: '5%',   y: '8%',  size: '2px', opacity: 0.4 },
  { id: 1,  x: '12%',  y: '22%', size: '4px', opacity: 0.2 },
  { id: 2,  x: '23%',  y: '5%',  size: '2px', opacity: 0.35 },
  { id: 3,  x: '38%',  y: '15%', size: '2px', opacity: 0.25 },
  { id: 4,  x: '55%',  y: '3%',  size: '4px', opacity: 0.15 },
  { id: 5,  x: '67%',  y: '18%', size: '2px', opacity: 0.4 },
  { id: 6,  x: '80%',  y: '7%',  size: '2px', opacity: 0.3 },
  { id: 7,  x: '91%',  y: '25%', size: '4px', opacity: 0.2 },
  { id: 8,  x: '3%',   y: '45%', size: '2px', opacity: 0.2 },
  { id: 9,  x: '95%',  y: '50%', size: '2px', opacity: 0.25 },
  { id: 10, x: '18%',  y: '70%', size: '4px', opacity: 0.15 },
  { id: 11, x: '75%',  y: '65%', size: '2px', opacity: 0.3 },
  { id: 12, x: '88%',  y: '80%', size: '2px', opacity: 0.2 },
  { id: 13, x: '44%',  y: '88%', size: '4px', opacity: 0.15 },
  { id: 14, x: '60%',  y: '75%', size: '2px', opacity: 0.25 },
];

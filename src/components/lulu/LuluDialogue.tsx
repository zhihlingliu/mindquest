'use client';

import { useEffect, useRef, useState } from 'react';
import { getLuluResponse, type LuluContext } from '@/lib/lulu-intelligence';

type Mood = 'normal' | 'excited' | 'thinking' | 'challenge' | 'warning';

interface LuluDialogueProps {
  message?: string;
  mood?: Mood;
  onComplete?: () => void;
  // Context-aware extensions (all optional — fully backward compatible)
  luluContext?: LuluContext;
  showHint?: boolean;
  showFollowup?: boolean;
}

const MOOD_CONFIG: Record<
  Mood,
  { color: string; border: string; label: string; speed: number }
> = {
  normal:    { color: '#29B6F6', border: '#29B6F6', label: '★',  speed: 40 },
  excited:   { color: '#FFD700', border: '#FFD700', label: '!!', speed: 25 },
  thinking:  { color: '#9E9E9E', border: '#9E9E9E', label: '…',  speed: 60 },
  challenge: { color: '#FF6B6B', border: '#FF6B6B', label: '⚔',  speed: 35 },
  warning:   { color: '#FF9800', border: '#FF9800', label: '!',  speed: 30 },
};

export default function LuluDialogue({
  message: messageProp,
  mood: moodProp = 'normal',
  onComplete,
  luluContext,
  showHint = false,
  showFollowup = false,
}: LuluDialogueProps) {
  // Derive context-aware response when luluContext is supplied
  const ctxResponse = luluContext
    ? getLuluResponse('recap', luluContext)
    : null;

  const message = (messageProp && messageProp.length > 0)
    ? messageProp
    : (ctxResponse?.message ?? '');

  const resolvedMood: Mood = (moodProp !== 'normal')
    ? moodProp
    : ((ctxResponse?.mood as Mood | undefined) ?? 'normal');

  const hint     = ctxResponse?.hint;
  const followup = ctxResponse?.followup;

  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = MOOD_CONFIG[resolvedMood];

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    if (!message) {
      setDone(true);
      onComplete?.();
      return;
    }

    function tick() {
      if (indexRef.current < message.length) {
        indexRef.current += 1;
        setDisplayed(message.slice(0, indexRef.current));
        timerRef.current = setTimeout(tick, config.speed);
      } else {
        setDone(true);
        onComplete?.();
      }
    }

    timerRef.current = setTimeout(tick, config.speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, resolvedMood]); // eslint-disable-line react-hooks/exhaustive-deps

  function skipToEnd() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayed(message);
    setDone(true);
    onComplete?.();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '4px' }}>
        {/* Avatar */}
        <div
          aria-label="Lulu avatar"
          style={{
            flexShrink: 0,
            width: '64px',
            height: '64px',
            background: config.color,
            boxShadow: [
              `0 -4px 0 0 ${config.border}`, `4px 0 0 0 ${config.border}`,
              `0 4px 0 0 ${config.border}`,  `-4px 0 0 0 ${config.border}`,
            ].join(', '),
            imageRendering: 'pixelated',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '18px',
            color: '#0D1B2A',
            userSelect: 'none',
          }}
        >
          {config.label}
        </div>

        {/* Dialogue bubble */}
        <button
          onClick={skipToEnd}
          style={{
            flex: 1,
            textAlign: 'left',
            background: 'var(--bg-secondary)',
            border: 'none',
            cursor: done ? 'default' : 'pointer',
            padding: '12px 14px',
            boxShadow: [
              `0 -4px 0 0 ${config.border}`, `4px 0 0 0 ${config.border}`,
              `0 4px 0 0 ${config.border}`,  `-4px 0 0 0 ${config.border}`,
              `4px -4px 0 0 ${config.border}`, `4px 4px 0 0 ${config.border}`,
              `-4px 4px 0 0 ${config.border}`, `-4px -4px 0 0 ${config.border}`,
            ].join(', '),
            position: 'relative',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: '14px',
            lineHeight: '1.7',
            color: 'var(--text-primary)',
            margin: 0,
            whiteSpace: 'pre-wrap',
            minHeight: '40px',
          }}>
            {displayed}
            {!done && (
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                background: config.color,
                marginLeft: '2px',
                verticalAlign: 'middle',
                animation: 'lulu-blink 0.6s step-end infinite',
              }} />
            )}
          </p>

          {!done && (
            <span style={{
              position: 'absolute', bottom: '6px', right: '10px',
              fontFamily: 'var(--font-pixel), monospace', fontSize: '9px',
              color: config.color, opacity: 0.6, letterSpacing: '1px',
            }}>CLICK TO SKIP</span>
          )}
        </button>
      </div>

      {/* Hint */}
      {done && showHint && hint && (
        <div style={{ padding: '10px 14px', background: 'rgba(255,215,0,0.06)', borderLeft: '3px solid var(--accent-gold)' }}>
          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '13px', color: 'var(--text-primary)', opacity: 0.8, margin: 0, lineHeight: 1.65 }}>
            💡 {hint}
          </p>
        </div>
      )}

      {/* Followup */}
      {done && showFollowup && followup && (
        <div style={{ padding: '10px 14px', background: 'rgba(34,211,238,0.05)', borderLeft: '3px solid #22D3EE' }}>
          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '13px', color: 'var(--text-primary)', opacity: 0.8, margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
            💭 {followup}
          </p>
        </div>
      )}

      <style>{`
        @keyframes lulu-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

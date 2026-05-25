'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MiniEncounter as MiniEncounterType } from '@/data/map/encounters';

interface Props {
  encounter: MiniEncounterType;
  onComplete: (xp: number) => void;
  onSkip: () => void;
}

type Phase = 'choosing' | 'result';

export default function MiniEncounter({ encounter, onComplete, onSkip }: Props) {
  const [phase, setPhase] = useState<Phase>('choosing');
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [showXP, setShowXP] = useState(false);

  const picked = pickedIdx !== null ? encounter.choices[pickedIdx] : null;
  const isCorrect = picked?.isOptimal ?? false;
  const earnedXP = picked?.xpReward ?? 0;

  function choose(idx: number) {
    if (phase !== 'choosing') return;
    setPickedIdx(idx);
    setPhase('result');
    if (encounter.choices[idx].isOptimal) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1400);
    }
  }

  function finish() {
    onComplete(isCorrect ? earnedXP : 0);
  }

  return (
    <>
      {/* Overlay + centered container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 420,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
      {/* Panel */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 360 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(540px, 94vw)',
          maxHeight: '88vh',
          background: '#0D1B2A',
          boxShadow: pixelBorder('#FF4444'),
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'rgba(255,68,68,0.1)',
          borderBottom: '2px solid rgba(255,68,68,0.4)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{encounter.emoji}</span>
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 8,
              color: '#FF4444',
              margin: '0 0 2px',
              letterSpacing: 2,
              animation: 'encounterBlink 1.2s step-start infinite',
            }}>
              &#9876; RANDOM ENCOUNTER
            </p>
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              {encounter.title}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Question */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: '3px solid rgba(255,68,68,0.5)',
          }}>
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: 15,
              color: 'var(--text-primary)',
              lineHeight: 1.65,
              margin: 0,
            }}>
              {encounter.description}
            </p>
          </div>

          {/* Choices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
            {encounter.choices.map((choice, i) => {
              const isChosen = pickedIdx === i;
              const revealed = phase === 'result';

              let borderColor = '#4A5568';
              let bg = 'rgba(255,255,255,0.03)';
              if (revealed && choice.isOptimal) { borderColor = 'var(--accent-green)'; bg = 'rgba(76,175,80,0.1)'; }
              else if (isChosen && !choice.isOptimal) { borderColor = 'var(--accent-red)'; bg = 'rgba(255,68,68,0.1)'; }

              return (
                <motion.button
                  key={i}
                  onClick={() => choose(i)}
                  whileHover={phase === 'choosing' ? { x: 3 } : {}}
                  style={{
                    textAlign: 'left',
                    background: bg,
                    border: 'none',
                    cursor: phase === 'choosing' ? 'pointer' : 'default',
                    padding: '12px 14px',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    boxShadow: pixelBorder(borderColor),
                    transition: 'box-shadow 0.2s, background 0.2s',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: 9,
                    color: borderColor,
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body), sans-serif',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    flex: 1,
                  }}>
                    {choice.text}
                  </span>
                  {revealed && choice.isOptimal && (
                    <span style={{
                      flexShrink: 0,
                      fontFamily: 'var(--font-pixel), monospace',
                      fontSize: 8,
                      color: 'var(--accent-green)',
                      padding: '2px 6px',
                      border: '1px solid var(--accent-green)',
                    }}>
                      &#10003; 正確
                    </span>
                  )}
                  {isChosen && !choice.isOptimal && (
                    <span style={{
                      flexShrink: 0,
                      fontFamily: 'var(--font-pixel), monospace',
                      fontSize: 8,
                      color: 'var(--accent-red)',
                      padding: '2px 6px',
                      border: '1px solid var(--accent-red)',
                    }}>
                      &#10005; 錯誤
                    </span>
                  )}
                </motion.button>
              );
            })}

            {/* Floating XP */}
            <AnimatePresence>
              {showXP && (
                <motion.div
                  key="xp"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -44 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', right: 12, top: 0,
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: 14,
                    color: 'var(--accent-gold)',
                    pointerEvents: 'none',
                    textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
                  }}
                >
                  +{earnedXP} XP
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {phase === 'result' && picked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  padding: '12px 14px',
                  background: isCorrect ? 'rgba(76,175,80,0.07)' : 'rgba(255,68,68,0.07)',
                  borderLeft: `3px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                }}>
                  <p style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: 8,
                    color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)',
                    margin: '0 0 6px',
                    letterSpacing: 1,
                  }}>
                    {isCorrect ? '✎ INSIGHT' : '⚠ DEBRIEF'}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body), sans-serif',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    opacity: 0.85,
                    margin: 0,
                    lineHeight: 1.65,
                  }}>
                    {picked.feedback}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            {/* Skip (only before answering) */}
            {phase === 'choosing' ? (
              <button
                onClick={onSkip}
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 8,
                  color: 'rgba(245,240,232,0.35)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: 1,
                  padding: '4px 0',
                }}
              >
                略過（本次無獎勵）
              </button>
            ) : (
              <div />
            )}

            {/* Continue (after answering) */}
            {phase === 'result' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={finish}
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 9,
                  color: '#0D1B2A',
                  background: isCorrect ? 'var(--accent-green)' : '#4A5568',
                  border: 'none',
                  padding: '10px 22px',
                  cursor: 'pointer',
                  letterSpacing: 1,
                  boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)',
                }}
              >
                {isCorrect ? `✓ +${earnedXP} XP ▶` : '▶ 繼續'}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      </motion.div>

      <style>{`
        @keyframes encounterBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}

function pixelBorder(color: string): string {
  return [
    `0 -3px 0 0 ${color}`, `3px 0 0 0 ${color}`,
    `0 3px 0 0 ${color}`, `-3px 0 0 0 ${color}`,
    `3px -3px 0 0 ${color}`, `3px 3px 0 0 ${color}`,
    `-3px 3px 0 0 ${color}`, `-3px -3px 0 0 ${color}`,
  ].join(', ');
}

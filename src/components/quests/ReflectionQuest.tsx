'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuluDialogue from '@/components/lulu/LuluDialogue';

const MIN_CHARS = 30;

export interface ReflectionQuestProps {
  question: string;
  prompt: string;
  luluComment: string;
  xpReward: number;
  onComplete: (xp: number) => void;
}

type Phase = 'writing' | 'feedback';

export default function ReflectionQuest({
  question,
  prompt,
  luluComment,
  xpReward,
  onComplete,
}: ReflectionQuestProps) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('writing');
  const [luluDone, setLuluDone] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const charCount = text.trim().length;
  const remaining = Math.max(0, MIN_CHARS - charCount);
  const canSubmit = charCount >= MIN_CHARS;

  function submit() {
    if (!canSubmit) return;
    setPhase('feedback');
  }

  function finish() {
    setShowXP(true);
    setTimeout(() => {
      setShowXP(false);
      onComplete(xpReward);
    }, 900);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Question ── */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '20px',
        boxShadow: pixelShadow('var(--accent-gold)'),
      }}>
        <p style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '10px',
          color: 'var(--accent-gold)',
          letterSpacing: '2px',
          margin: '0 0 12px',
        }}>
          REFLECTION
        </p>
        <p style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.65,
          margin: 0,
        }}>
          {question}
        </p>
      </div>

      {/* ── Writing phase ── */}
      <AnimatePresence mode="wait">
        {phase === 'writing' && (
          <motion.div
            key="writing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {/* Textarea */}
            <div style={{ position: 'relative' }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={prompt}
                rows={5}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'var(--bg-primary)',
                  border: 'none',
                  boxShadow: pixelShadow(canSubmit ? 'var(--accent-green)' : '#4A5568'),
                  padding: '14px 16px',
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.7,
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'box-shadow 0.2s ease',
                  display: 'block',
                }}
              />
            </div>

            {/* Char count row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '9px',
                letterSpacing: '1px',
                color: canSubmit ? 'var(--accent-green)' : 'rgba(245,240,232,0.4)',
                transition: 'color 0.2s ease',
              }}>
                {canSubmit
                  ? `${charCount} 字 ✓`
                  : `${charCount} 字 — 還需要 ${remaining} 字`}
              </span>

              {/* Submit button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: '9px',
                    letterSpacing: '1px',
                    color: canSubmit ? '#0D1B2A' : 'rgba(245,240,232,0.3)',
                    background: canSubmit ? 'var(--accent-gold)' : '#2D3748',
                    border: 'none',
                    padding: '10px 22px',
                    cursor: canSubmit ? 'pointer' : 'not-allowed',
                    boxShadow: canSubmit ? `4px 4px 0 0 rgba(0,0,0,0.5)` : 'none',
                    transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (canSubmit) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  提交反思 ▶
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Feedback phase ── */}
        {phase === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Player's own text (readonly recap) */}
            <div style={{
              background: 'var(--bg-primary)',
              padding: '14px 16px',
              boxShadow: pixelShadow('#4A5568'),
            }}>
              <p style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '9px',
                color: 'rgba(245,240,232,0.4)',
                letterSpacing: '1px',
                margin: '0 0 8px',
              }}>
                你寫下了：
              </p>
              <p style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '13px',
                color: 'rgba(245,240,232,0.75)',
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {text.trim()}
              </p>
            </div>

            {/* Lulu response */}
            <LuluDialogue
              message={luluComment}
              mood="thinking"
              onComplete={() => setLuluDone(true)}
            />

            {/* Finish button */}
            {luluDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}
              >
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
                  onClick={finish}
                  style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: '9px',
                    color: '#0D1B2A',
                    background: 'var(--accent-green)',
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
                  帶走這個思考 ✓
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

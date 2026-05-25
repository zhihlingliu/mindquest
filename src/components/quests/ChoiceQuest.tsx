'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuluDialogue from '@/components/lulu/LuluDialogue';
import { getLuluResponse, type LuluContext } from '@/lib/lulu-intelligence';

export interface ChoiceOption {
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface StatHint {
  stat: string;
  threshold: number;
  hint: string;
}

export interface ChoiceQuestProps {
  question: string;
  options: ChoiceOption[];
  xpReward: number;
  luluFeedback: {
    correct: string;
    wrong: string;
  };
  hasRevealItem?: boolean;
  onUseRevealItem?: () => void;
  statHint?: StatHint;
  playerStats?: Record<string, number>;
  luluContext?: LuluContext;
  onComplete: (xp: number) => void;
}

type State = 'idle' | 'correct' | 'wrong';

const WRONG_XP_RATIO = 0.4;

export default function ChoiceQuest({
  question,
  options,
  xpReward,
  luluFeedback,
  hasRevealItem = false,
  onUseRevealItem,
  statHint,
  playerStats,
  luluContext,
  onComplete,
}: ChoiceQuestProps) {
  const [state, setState] = useState<State>('idle');
  const [picked, setPicked] = useState<number | null>(null);
  const [showXP, setShowXP] = useState(false);
  const [luluDone, setLuluDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  const wrongXP = Math.round(xpReward * WRONG_XP_RATIO);
  const pickedOption = picked !== null ? options[picked] : null;

  const hintActive =
    !!statHint &&
    !!playerStats &&
    (playerStats[statHint.stat] ?? 0) >= statHint.threshold;

  const STAT_LABELS: Record<string, { label: string; icon: string; color: string }> = {
    cognition:     { label: 'COGNITION',  icon: '🧠', color: '#22D3EE' },
    decisionPower: { label: 'DECISION',   icon: '⚡', color: '#A78BFA' },
    influence:     { label: 'INFLUENCE',  icon: '🎭', color: '#F472B6' },
    socialCapital: { label: 'SOCIAL',     icon: '🕸️', color: '#34D399' },
    orgWisdom:     { label: 'ORG WISDOM', icon: '🏛️', color: '#FBBF24' },
  };
  const hintMeta = statHint
    ? (STAT_LABELS[statHint.stat] ?? { label: statHint.stat.toUpperCase(), icon: '★', color: '#22D3EE' })
    : null;

  // Lulu 說的話：答錯且有 luluContext 時用 intelligence 引擎；否則用靜態 feedback
  const baseWrongMessage = pickedOption?.feedback ?? luluFeedback.wrong;
  const intelligentWrongMessage =
    luluContext && wrongCount >= 1
      ? getLuluResponse('wrong', { ...luluContext, wrongCount }).message
      : null;

  const luluMessage = state === 'correct'
    ? (pickedOption?.feedback ?? luluFeedback.correct)
    : (intelligentWrongMessage ?? baseWrongMessage);

  function choose(idx: number) {
    if (state !== 'idle') return;
    setPicked(idx);
    if (options[idx].isCorrect) {
      setState('correct');
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1400);
    } else {
      setWrongCount((n) => n + 1);
      setState('wrong');
    }
  }

  function useReveal() {
    if (!hasRevealItem || revealed) return;
    setRevealed(true);
    onUseRevealItem?.();
  }

  function retry() {
    setState('idle');
    setPicked(null);
    setLuluDone(false);
  }

  function finish() {
    onComplete(state === 'correct' ? xpReward : wrongXP);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Question */}
      <div style={{ background: 'var(--bg-secondary)', padding: '20px', boxShadow: pixelShadow('#4A5568') }}>
        <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
          {question}
        </p>
      </div>

      {/* Ability Hint Panel */}
      {hintActive && hintMeta && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            padding: '12px 16px',
            background: `rgba(${hexToRgb(hintMeta.color)}, 0.07)`,
            borderLeft: `4px solid ${hintMeta.color}`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          }} />
          <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{hintMeta.icon}</span>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: hintMeta.color, margin: '0 0 5px', letterSpacing: '2px' }}>
              ★ ABILITY HINT ★ {hintMeta.label} &ge; {statHint!.threshold}
            </p>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '13px', color: 'var(--text-primary)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {statHint!.hint}
            </p>
          </div>
        </motion.div>
      )}

      {/* Insight Crystal item bar */}
      {hasRevealItem && state === 'idle' && !revealed && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 14px',
            background: 'rgba(192,132,252,0.08)',
            boxShadow: pixelShadow('#C084FC'),
          }}
        >
          <span style={{ fontSize: '18px' }}>💎</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: '#C084FC', margin: '0 0 2px', letterSpacing: '1px' }}>
              洞察水晶
            </p>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '12px', color: 'var(--text-primary)', opacity: 0.7, margin: 0 }}>
              消耗水晶，標記所有正確選項位置
            </p>
          </div>
          <button
            onClick={useReveal}
            style={{
              fontFamily: 'var(--font-pixel), monospace', fontSize: '8px',
              color: '#0D1B2A', background: '#C084FC', border: 'none',
              padding: '8px 14px', cursor: 'pointer',
              boxShadow: '3px 3px 0 0 rgba(0,0,0,0.5)',
            }}
          >
            使用 ▶
          </button>
        </motion.div>
      )}

      {revealed && state === 'idle' && (
        <div style={{ padding: '8px 14px', background: 'rgba(192,132,252,0.06)', borderLeft: '3px solid #C084FC' }}>
          <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: '#C084FC', margin: 0, letterSpacing: '1px' }}>
            💎 正解已揭示！正確選項已標記。
          </p>
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
        {options.map((opt, i) => {
          const isChosen = picked === i;
          const isRevealed = state !== 'idle';
          const isCorrectOpt = opt.isCorrect;

          let borderColor = '#4A5568';
          let bgColor = 'var(--bg-secondary)';

          if (revealed && isCorrectOpt && state === 'idle') {
            borderColor = '#C084FC';
            bgColor = 'rgba(192,132,252,0.1)';
          }

          if (isRevealed && isCorrectOpt) {
            borderColor = 'var(--accent-green)';
            bgColor = 'rgba(76,175,80,0.12)';
          } else if (isChosen && state === 'wrong') {
            borderColor = 'var(--accent-red)';
            bgColor = 'rgba(255,107,107,0.12)';
          }

          return (
            <motion.button
              key={i}
              onClick={() => choose(i)}
              whileHover={state === 'idle' ? { x: 4 } : {}}
              style={{
                textAlign: 'left', background: bgColor, border: 'none',
                cursor: state === 'idle' ? 'pointer' : 'default',
                padding: '14px 16px', display: 'flex', gap: '12px',
                alignItems: 'flex-start', boxShadow: pixelShadow(borderColor),
                transition: 'box-shadow 0.2s ease, background 0.2s ease',
              }}
            >
              <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: borderColor, flexShrink: 0, marginTop: '3px' }}>
                {String.fromCharCode(65 + i)}.
              </span>
              <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, flex: 1 }}>
                {opt.text}
              </span>

              {revealed && isCorrectOpt && state === 'idle' && (
                <span style={{ marginLeft: 'auto', flexShrink: 0, fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: '#C084FC', padding: '2px 6px', border: '1px solid #C084FC' }}>
                  💎 正解
                </span>
              )}
              {isRevealed && isCorrectOpt && (
                <span style={{ marginLeft: 'auto', flexShrink: 0, fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: 'var(--accent-green)', padding: '2px 6px', border: '1px solid var(--accent-green)' }}>
                  ✓ 正確
                </span>
              )}
              {isChosen && state === 'wrong' && (
                <span style={{ marginLeft: 'auto', flexShrink: 0, fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: 'var(--accent-red)', padding: '2px 6px', border: '1px solid var(--accent-red)' }}>
                  ✗ 後果
                </span>
              )}
            </motion.button>
          );
        })}

        {/* Floating XP popup */}
        <AnimatePresence>
          {showXP && (
            <motion.div
              key="xp"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -48 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ position: 'absolute', right: '16px', top: '0', fontFamily: 'var(--font-pixel), monospace', fontSize: '14px', color: 'var(--accent-gold)', pointerEvents: 'none', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}
            >
              +{xpReward} XP
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Consequence banner */}
      <AnimatePresence>
        {state === 'wrong' && (
          <motion.div
            key="consequence"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: 'rgba(255,107,107,0.08)',
              borderLeft: '4px solid var(--accent-red)',
              padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: 'var(--accent-red)', margin: '0 0 4px', letterSpacing: '1px' }}>
                  ⚠ CONSEQUENCE
                </p>
                <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '13px', color: 'var(--text-primary)', opacity: 0.75, margin: 0 }}>
                  這個決策讓你損失了部分洞察力
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: '#4A5568', margin: '0 0 2px', textDecoration: 'line-through' }}>
                  +{xpReward} XP
                </p>
                <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '11px', color: 'var(--accent-red)', margin: 0 }}>
                  +{wrongXP} XP
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lulu Feedback */}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <LuluDialogue
              message={luluMessage}
              mood={state === 'correct' ? 'excited' : 'challenge'}
              onComplete={() => setLuluDone(true)}
            />

            {luluDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
              >
                {state === 'wrong' && (
                  <ActionButton label="↺ 重新思考" color="#4A5568" onClick={retry} />
                )}
                <ActionButton
                  label={state === 'correct' ? '繼續 ▶' : `接受後果 (+${wrongXP} XP)`}
                  color={state === 'correct' ? 'var(--accent-green)' : 'var(--accent-red)'}
                  onClick={finish}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-pixel), monospace', fontSize: '9px',
        color: '#0D1B2A', background: color, border: 'none',
        padding: '10px 20px', cursor: 'pointer', letterSpacing: '1px',
        boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)', transition: 'transform 0.1s ease',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
    >
      {label}
    </button>
  );
}

function pixelShadow(color: string): string {
  return ['0 -4px 0 0', '4px 0 0 0', '0 4px 0 0', '-4px 0 0 0', '4px -4px 0 0', '4px 4px 0 0', '-4px 4px 0 0', '-4px -4px 0 0']
    .map(s => `${s} ${color}`).join(', ');
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '34, 211, 238';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuluDialogue from '@/components/lulu/LuluDialogue';

type Mood = 'normal' | 'excited' | 'thinking' | 'challenge';

export interface DialogueLine {
  message: string;
  mood?: Mood;
  /** Optional mid-dialogue choice (branch) */
  choice?: {
    prompt: string;
    options: { text: string; next: number }[];
  };
}

export interface DialogueQuestProps {
  dialogues: DialogueLine[];
  xpReward: number;
  onComplete: (xp: number) => void;
}

export default function DialogueQuest({
  dialogues,
  xpReward,
  onComplete,
}: DialogueQuestProps) {
  const [idx, setIdx] = useState(0);
  const [luluDone, setLuluDone] = useState(false);
  const [choiceMode, setChoiceMode] = useState(false);

  const current = dialogues[idx];
  const isLast = idx >= dialogues.length - 1;

  function handleLuluComplete() {
    setLuluDone(true);
    if (current.choice) setChoiceMode(true);
  }

  function advance(nextIdx?: number) {
    const target = nextIdx !== undefined ? nextIdx : idx + 1;
    if (target >= dialogues.length) {
      onComplete(xpReward);
      return;
    }
    setIdx(target);
    setLuluDone(false);
    setChoiceMode(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {dialogues.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === idx ? '16px' : '6px',
              height: '6px',
              background: i <= idx ? 'var(--accent-blue)' : '#4A5568',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
        <span
          style={{
            marginLeft: '8px',
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '9px',
            color: 'var(--text-primary)',
            opacity: 0.4,
          }}
        >
          {idx + 1}/{dialogues.length}
        </span>
      </div>

      {/* Dialogue */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <LuluDialogue
            message={current.message}
            mood={current.mood ?? 'normal'}
            onComplete={handleLuluComplete}
          />
        </motion.div>
      </AnimatePresence>

      {/* Mid-dialogue choice */}
      <AnimatePresence>
        {choiceMode && current.choice && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '14px',
                color: 'var(--text-primary)',
                margin: 0,
                opacity: 0.8,
              }}
            >
              {current.choice.prompt}
            </p>
            {current.choice.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => advance(opt.next)}
                style={{
                  textAlign: 'left',
                  background: 'var(--bg-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  boxShadow: pixelShadow('#4A5568'),
                  transition: 'box-shadow 0.15s ease',
                  display: 'flex',
                  gap: '10px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = pixelShadow('var(--accent-blue)');
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = pixelShadow('#4A5568');
                }}
              >
                <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', marginTop: '3px', flexShrink: 0 }}>
                  ▶
                </span>
                {opt.text}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue / Finish button */}
      <AnimatePresence>
        {luluDone && !choiceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <button
              onClick={() => advance()}
              style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '10px',
                letterSpacing: '2px',
                color: '#0D1B2A',
                background: isLast ? 'var(--accent-gold)' : 'var(--accent-blue)',
                border: 'none',
                padding: '12px 24px',
                cursor: 'pointer',
                boxShadow: `4px 4px 0 0 rgba(0,0,0,0.5)`,
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              {isLast ? `完成 +${xpReward} XP ★` : '繼續 ▶'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function pixelShadow(color: string): string {
  return [
    `0 -4px 0 0 ${color}`, `4px 0 0 0 ${color}`,
    `0 4px 0 0 ${color}`,  `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`, `4px 4px 0 0 ${color}`,
    `-4px 4px 0 0 ${color}`, `-4px -4px 0 0 ${color}`,
  ].join(', ');
}

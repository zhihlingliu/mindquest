'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuluDialogue from '@/components/lulu/LuluDialogue';

export interface SimChoice {
  text: string;
  /** Consequence narrative shown after choosing */
  outcome: string;
  /** XP awarded for this choice (no choice is "wrong", but some give more XP) */
  xp: number;
  /** Optional Lulu comment on this choice */
  luluComment?: string;
}

export interface SimulationQuestProps {
  scenario: string;
  /** Optional context/background paragraph */
  context?: string;
  choices: SimChoice[];
  onComplete: (xp: number) => void;
}

type Phase = 'choose' | 'outcome';

export default function SimulationQuest({
  scenario,
  context,
  choices,
  onComplete,
}: SimulationQuestProps) {
  const [phase, setPhase] = useState<Phase>('choose');
  const [picked, setPicked] = useState<number | null>(null);
  const [luluDone, setLuluDone] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const chosen = picked !== null ? choices[picked] : null;

  function choose(idx: number) {
    setPicked(idx);
    setPhase('outcome');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Scenario card */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          padding: '20px',
          borderLeft: '6px solid var(--accent-gold)',
          boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)',
        }}
      >
        {context && (
          <p
            style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '13px',
              color: 'var(--text-primary)',
              opacity: 0.6,
              lineHeight: 1.6,
              margin: '0 0 10px',
            }}
          >
            {context}
          </p>
        )}
        <p
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {scenario}
        </p>
      </div>

      {/* Choices — shown only in 'choose' phase */}
      <AnimatePresence mode="wait">
        {phase === 'choose' && (
          <motion.div
            key="choices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '10px',
                color: 'var(--accent-gold)',
                letterSpacing: '2px',
                margin: 0,
              }}
            >
              你會怎麼做？
            </p>
            {choices.map((c, i) => (
              <motion.button
                key={i}
                onClick={() => choose(i)}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ x: 6 }}
                style={{
                  textAlign: 'left',
                  background: hovered === i ? 'rgba(255,215,0,0.08)' : 'var(--bg-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  boxShadow: pixelShadow(hovered === i ? 'var(--accent-gold)' : '#4A5568'),
                  transition: 'box-shadow 0.15s ease, background 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: '9px',
                    color: hovered === i ? 'var(--accent-gold)' : '#4A5568',
                    flexShrink: 0,
                    marginTop: '3px',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {String.fromCharCode(65 + i)}.
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body), sans-serif',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                  }}
                >
                  {c.text}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Outcome reveal */}
        {phase === 'outcome' && chosen && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* XP badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '10px',
                  color: '#0D1B2A',
                  background: 'var(--accent-gold)',
                  padding: '4px 10px',
                  boxShadow: '2px 2px 0 0 rgba(0,0,0,0.4)',
                }}
              >
                你選了 {String.fromCharCode(65 + picked!)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '10px',
                  color: 'var(--accent-gold)',
                }}
              >
                +{chosen.xp} XP
              </span>
            </div>

            {/* Outcome narrative */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '16px',
                borderLeft: '6px solid var(--accent-blue)',
                boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {chosen.outcome}
              </p>
            </div>

            {/* Lulu comment */}
            {chosen.luluComment && (
              <LuluDialogue
                message={chosen.luluComment}
                mood="thinking"
                onComplete={() => setLuluDone(true)}
              />
            )}

            {/* Continue button */}
            {(!chosen.luluComment || luluDone) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <button
                  onClick={() => onComplete(chosen.xp)}
                  style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    color: '#0D1B2A',
                    background: 'var(--accent-gold)',
                    border: 'none',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    boxShadow: `4px 4px 0 0 rgba(0,0,0,0.5)`,
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  繼續 ▶
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
    `0 -4px 0 0 ${color}`, `4px 0 0 0 ${color}`,
    `0 4px 0 0 ${color}`,  `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`, `4px 4px 0 0 ${color}`,
    `-4px 4px 0 0 ${color}`, `-4px -4px 0 0 ${color}`,
  ].join(', ');
}

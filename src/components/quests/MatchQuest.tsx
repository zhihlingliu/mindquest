'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MatchQuestProps {
  title: string;
  pairs: Array<{ term: string; definition: string }>;
  xpReward: number;
  onComplete: (xp: number) => void;
}

interface DefItem {
  id: number;       // index into original pairs
  definition: string;
}

type MatchState = 'idle' | 'complete';

export default function MatchQuest({ title, pairs, xpReward, onComplete }: MatchQuestProps) {
  // Shuffle definitions once on mount
  const shuffledDefs = useMemo<DefItem[]>(() => {
    const arr: DefItem[] = pairs.map((p, i) => ({ id: i, definition: p.definition }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedTerm, setSelectedTerm] = useState<number | null>(null); // index into pairs
  const [matched, setMatched] = useState<Record<number, boolean>>({}); // pairIdx → matched
  const [wrongFlash, setWrongFlash] = useState<{ term: number; def: number } | null>(null);
  const [showXP, setShowXP] = useState(false);
  const [phase, setPhase] = useState<MatchState>('idle');

  const matchedCount = Object.keys(matched).length;
  const allDone = matchedCount === pairs.length;

  function selectTerm(idx: number) {
    if (matched[idx]) return;
    setSelectedTerm(idx === selectedTerm ? null : idx);
  }

  function selectDef(defItem: DefItem) {
    if (matched[defItem.id]) return;
    if (selectedTerm === null) return;

    if (selectedTerm === defItem.id) {
      // Correct
      const next = { ...matched, [defItem.id]: true };
      setMatched(next);
      setSelectedTerm(null);

      if (Object.keys(next).length === pairs.length) {
        setShowXP(true);
        setPhase('complete');
        setTimeout(() => {
          setShowXP(false);
          onComplete(xpReward);
        }, 1200);
      }
    } else {
      // Wrong — flash red then clear
      setWrongFlash({ term: selectedTerm, def: defItem.id });
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedTerm(null);
      }, 600);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>

      {/* ── Title ── */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '16px 20px',
        boxShadow: pixelShadow('var(--accent-blue)'),
      }}>
        <p style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '10px',
          color: 'var(--accent-blue)',
          letterSpacing: '2px',
          margin: '0 0 8px',
        }}>
          MATCH QUEST
        </p>
        <p style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {title}
        </p>
      </div>

      {/* ── Progress ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ flex: 1, height: 6, background: '#2D3748', position: 'relative' }}>
          <motion.div
            animate={{ width: `${(matchedCount / pairs.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, background: 'var(--accent-green)' }}
          />
        </div>
        <span style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '9px',
          color: 'var(--accent-green)',
          letterSpacing: '1px',
          flexShrink: 0,
        }}>
          {matchedCount}/{pairs.length}
        </span>
      </div>

      {/* ── Two columns ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Left: terms (original order) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '9px',
            color: 'rgba(245,240,232,0.4)',
            letterSpacing: '1px',
            margin: '0 0 4px',
          }}>
            術語
          </p>
          {pairs.map((pair, idx) => {
            const isMatched = matched[idx] === true;
            const isSelected = selectedTerm === idx;
            const isWrong = wrongFlash?.term === idx;
            const borderColor = isMatched
              ? 'var(--accent-green)'
              : isWrong
              ? 'var(--accent-red)'
              : isSelected
              ? 'var(--accent-blue)'
              : '#4A5568';

            return (
              <motion.button
                key={idx}
                onClick={() => !isMatched && selectTerm(idx)}
                animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  textAlign: 'left',
                  background: isMatched
                    ? 'rgba(76,175,80,0.12)'
                    : isSelected
                    ? 'rgba(41,182,246,0.12)'
                    : 'var(--bg-secondary)',
                  border: 'none',
                  cursor: isMatched ? 'default' : 'pointer',
                  padding: '12px 14px',
                  boxShadow: pixelShadow(borderColor),
                  transition: 'box-shadow 0.15s ease, background 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '10px',
                  color: borderColor,
                  flexShrink: 0,
                  transition: 'color 0.15s ease',
                }}>
                  {isMatched ? '✓' : isSelected ? '▶' : '○'}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isMatched ? 'var(--accent-green)' : 'var(--text-primary)',
                  lineHeight: 1.4,
                  transition: 'color 0.15s ease',
                }}>
                  {pair.term}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Right: definitions (shuffled) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '9px',
            color: 'rgba(245,240,232,0.4)',
            letterSpacing: '1px',
            margin: '0 0 4px',
          }}>
            定義
          </p>
          {shuffledDefs.map((defItem) => {
            const isMatched = matched[defItem.id] === true;
            const isWrong = wrongFlash?.def === defItem.id;
            const isAvailable = selectedTerm !== null && !isMatched;
            const borderColor = isMatched
              ? 'var(--accent-green)'
              : isWrong
              ? 'var(--accent-red)'
              : isAvailable
              ? 'var(--accent-gold)'
              : '#4A5568';

            return (
              <motion.button
                key={defItem.id}
                onClick={() => selectDef(defItem)}
                animate={isWrong ? { x: [0, 6, -6, 6, -6, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  textAlign: 'left',
                  background: isMatched
                    ? 'rgba(76,175,80,0.12)'
                    : isAvailable
                    ? 'rgba(255,215,0,0.06)'
                    : 'var(--bg-secondary)',
                  border: 'none',
                  cursor: isMatched ? 'default' : selectedTerm !== null ? 'pointer' : 'default',
                  padding: '12px 14px',
                  boxShadow: pixelShadow(borderColor),
                  transition: 'box-shadow 0.15s ease, background 0.15s ease',
                }}>
                <span style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '13px',
                  color: isMatched ? 'var(--accent-green)' : 'var(--text-primary)',
                  lineHeight: 1.5,
                  display: 'block',
                  transition: 'color 0.15s ease',
                }}>
                  {defItem.definition}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Hint ── */}
      {selectedTerm !== null && (
        <p style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '9px',
          color: 'var(--accent-blue)',
          letterSpacing: '1px',
          margin: 0,
          textAlign: 'center',
          animation: 'rq-blink 0.8s step-end infinite',
        }}>
          已選擇「{pairs[selectedTerm].term}」→ 點擊右側對應定義
        </p>
      )}

      {/* ── Complete banner ── */}
      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(76,175,80,0.12)',
              padding: '16px 20px',
              boxShadow: pixelShadow('var(--accent-green)'),
              textAlign: 'center',
              position: 'relative',
            }}
          >
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
                    top: 8,
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
            <p style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: '10px',
              color: 'var(--accent-green)',
              letterSpacing: '2px',
              margin: '0 0 4px',
            }}>
              全部正確！
            </p>
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '13px',
              color: 'var(--text-primary)',
              opacity: 0.7,
              margin: 0,
            }}>
              所有概念配對完成
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes rq-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
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

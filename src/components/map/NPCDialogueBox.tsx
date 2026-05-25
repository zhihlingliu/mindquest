'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEORY_FRAGMENTS } from '@/data/map/fragments';

export interface NPCDialogueProp {
  name: string;
  emoji: string;
  dialogues: string[];
  givesFragment?: string;
}

interface Props {
  npc: NPCDialogueProp;
  talkCount: number;
  onClose: () => void;
  onGiveFragment?: (fragmentId: string) => void;
}

export default function NPCDialogueBox({ npc, talkCount: _talkCount, onClose, onGiveFragment }: Props) {
  // Page through all dialogues within a single interaction
  const [page, setPage] = useState(0);
  const isLastPage = page >= npc.dialogues.length - 1;
  const line = npc.dialogues[Math.min(page, npc.dialogues.length - 1)];
  const fragment = npc.givesFragment
    ? THEORY_FRAGMENTS.find((f) => f.id === npc.givesFragment)
    : null;

  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset & start typewriter when page (line) changes
  useEffect(() => {
    setTyped('');
    setDone(false);
    setShowReward(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setTyped(line.slice(0, i));
      if (i >= line.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
      }
    }, 40);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [line]);

  function skipOrContinue() {
    if (!done) {
      // Skip typewriter — show full line immediately
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTyped(line);
      setDone(true);
      return;
    }
    if (!isLastPage) {
      // Advance to next dialogue page
      setPage((p) => p + 1);
      return;
    }
    // Last page — handle fragment reward or close
    if (fragment && !showReward) {
      setShowReward(true);
      return;
    }
    if (fragment) {
      onGiveFragment?.(fragment.id);
    }
    onClose();
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 400,
        }}
        onClick={skipOrContinue}
      />
      <motion.div
        key="dialogue"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          height: 160,
          background: '#0D1B2A',
          boxShadow: pixelShadow('var(--accent-gold)'),
          display: 'flex',
          alignItems: 'stretch',
          zIndex: 401,
          overflow: 'hidden',
        }}
      >
        {/* NPC Avatar */}
        <div style={{
          width: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRight: '3px solid rgba(255,215,0,0.3)',
          background: 'rgba(255,215,0,0.04)',
        }}>
          <div style={{
            width: 64, height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40,
            border: '3px solid rgba(255,215,0,0.4)',
            boxShadow: '0 0 16px 4px rgba(255,215,0,0.15)',
          }}>
            {npc.emoji}
          </div>
        </div>

        {/* Dialogue content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px 20px 14px',
          overflow: 'hidden',
        }}>
          <div>
            {/* NPC Name */}
            <p style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 9,
              color: 'var(--accent-gold)',
              letterSpacing: 2,
              margin: '0 0 10px',
            }}>
              {npc.name}
            </p>

            {/* Dialogue / Reward */}
            {showReward && fragment ? (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  background: `rgba(${hexToRgb(fragment.color)}, 0.1)`,
                  borderLeft: `4px solid ${fragment.color}`,
                }}
              >
                <span style={{ fontSize: 28 }}>{fragment.emoji}</span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: 8,
                    color: fragment.color,
                    margin: '0 0 4px',
                    letterSpacing: 1,
                  }}>
                    ✨ 獲得理論碎片
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body), sans-serif',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {fragment.title}
                  </p>
                </div>
              </motion.div>
            ) : (
              <p style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: 14,
                color: 'var(--text-primary)',
                lineHeight: 1.65,
                margin: 0,
                minHeight: 44,
              }}>
                {typed}
                {!done && (
                  <span style={{ opacity: Date.now() % 1000 < 500 ? 1 : 0 }}>|</span>
                )}
              </p>
            )}
          </div>

          {/* Continue button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={(e) => { e.stopPropagation(); skipOrContinue(); }}
              style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: 9,
                color: '#0D1B2A',
                background: 'var(--accent-gold)',
                border: 'none',
                padding: '8px 18px',
                cursor: 'pointer',
                letterSpacing: 1,
                boxShadow: '3px 3px 0 0 rgba(0,0,0,0.6)',
              }}
            >
              {!done ? 'SKIP' : showReward ? '關閉 ▶' : isLastPage ? '結束 ▶' : '繼續 ▶'}
            </button>
          </div>
        </div>

        {/* Page indicator */}
        <div style={{
          position: 'absolute', top: 8, right: 12,
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: 7,
          color: 'rgba(255,215,0,0.4)',
          letterSpacing: 1,
        }}>
          {page + 1} / {npc.dialogues.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function pixelShadow(color: string): string {
  return [
    `0 -4px 0 0 ${color}`,
    `4px 0 0 0 ${color}`,
    `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`,
    `-4px -4px 0 0 ${color}`,
  ].join(', ');
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255, 215, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

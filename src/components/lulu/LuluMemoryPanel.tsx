'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getLuluMemoryObservations, type LuluContext } from '@/lib/lulu-intelligence';

interface Props {
  ctx: LuluContext;
  isOpen: boolean;
  onClose: () => void;
}

function observationColor(text: string): string {
  if (/很高|完成|領先|突出|資深|解鎖/.test(text)) return 'var(--accent-green)';
  if (/偏低|答錯|傾向|癱瘓|危險|警告|不自知/.test(text)) return 'var(--accent-gold)';
  return 'var(--accent-blue)';
}

export default function LuluMemoryPanel({ ctx, isOpen, onClose }: Props) {
  const observations = getLuluMemoryObservations(ctx);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 600,
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              position: 'fixed',
              top: 0, right: 0,
              width: 300,
              height: '100vh',
              background: 'var(--bg-secondary)',
              borderLeft: '3px solid var(--accent-red)',
              zIndex: 601,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 18px 16px',
              borderBottom: '2px solid rgba(255,107,107,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 28 }}>🦊</span>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 9,
                  color: 'var(--accent-red)',
                  letterSpacing: 2,
                  margin: '0 0 2px',
                }}>
                  LULU MEMORY
                </p>
                <p style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  Lulu 的觀察記錄
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: '2px solid #4A5568',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 9,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  letterSpacing: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Observations */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              {observations.length === 0 ? (
                <p style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  opacity: 0.5,
                  margin: 0,
                  textAlign: 'center',
                  paddingTop: 24,
                }}>
                  完成更多任務後，<br />Lulu 會有更多觀察。
                </p>
              ) : (
                observations.map((obs, i) => {
                  const color = observationColor(obs);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'var(--bg-primary)',
                        boxShadow: `0 -2px 0 0 ${color}, 2px 0 0 0 ${color}, 0 2px 0 0 ${color}, -2px 0 0 0 ${color}`,
                      }}
                    >
                      {/* Color dot */}
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: 0,
                        background: color,
                        flexShrink: 0,
                        marginTop: 5,
                        boxShadow: `0 0 6px 1px ${color}66`,
                      }} />
                      <p style={{
                        fontFamily: 'var(--font-body), sans-serif',
                        fontSize: 12,
                        color: 'var(--text-primary)',
                        opacity: 0.85,
                        margin: 0,
                        lineHeight: 1.65,
                      }}>
                        {obs}
                      </p>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 16px',
              borderTop: '2px solid rgba(255,107,107,0.15)',
              flexShrink: 0,
            }}>
              <p style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: 7,
                color: 'var(--text-primary)',
                opacity: 0.35,
                margin: 0,
                letterSpacing: 1,
                lineHeight: 1.6,
                textAlign: 'center',
              }}>
                這些觀察隨著你的進度更新。
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

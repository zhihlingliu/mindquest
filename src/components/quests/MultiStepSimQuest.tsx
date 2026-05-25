'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SimStep {
  situation?: string;
  description?: string;
  choices: Array<{
    text: string;
    consequence?: string;
    feedback?: string;
    isGood?: boolean;
    isOptimal?: boolean;
  }>;
}

export interface MultiStepSimQuestProps {
  intro?: string;
  title?: string;
  description?: string;
  steps: SimStep[];
  xpReward: number;
  luluComment?: string;
  onComplete: (xp: number) => void;
}

export default function MultiStepSimQuest({
  intro,
  title,
  description,
  steps,
  xpReward,
  onComplete,
}: MultiStepSimQuestProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [goodCount, setGoodCount] = useState(0);

  const currentStep = steps[stepIdx];
  const isLastStep = stepIdx === steps.length - 1;
  const chosenChoice = picked !== null ? currentStep.choices[picked] : null;
  const isGood = chosenChoice ? !!(chosenChoice.isGood ?? chosenChoice.isOptimal) : false;
  const consequence = chosenChoice?.consequence ?? chosenChoice?.feedback ?? '';
  const situation = currentStep.situation ?? currentStep.description ?? '';

  const headerText = intro ?? description;
  const headerTitle = title;

  function choose(idx: number) {
    if (picked !== null) return;
    const c = currentStep.choices[idx];
    const good = !!(c.isGood ?? c.isOptimal);
    setPicked(idx);
    if (good) setGoodCount((g) => g + 1);
  }

  function next() {
    if (isLastStep) {
      const earned = Math.round(xpReward * (0.5 + (goodCount / steps.length) * 0.5));
      onComplete(earned);
    } else {
      setStepIdx((s) => s + 1);
      setPicked(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      {(headerTitle || headerText) && (
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '20px',
          borderLeft: '6px solid var(--accent-gold)',
          boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)',
        }}>
          {headerTitle && (
            <p style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: '10px',
              color: 'var(--accent-gold)',
              letterSpacing: '2px',
              margin: '0 0 8px',
            }}>
              {headerTitle}
            </p>
          )}
          {headerText && (
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: 1.65,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {headerText}
            </p>
          )}
        </div>
      )}

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === stepIdx ? 14 : 8,
              height: 8,
              background: i < stepIdx ? 'var(--accent-green)' : i === stepIdx ? 'var(--accent-blue)' : '#2D3748',
              transition: 'all 0.2s ease',
            }}
          />
        ))}
        <span style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '9px',
          color: 'rgba(245,240,232,0.4)',
          letterSpacing: '1px',
          marginLeft: 4,
        }}>
          {stepIdx + 1} / {steps.length}
        </span>
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {/* Situation card */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '18px',
            boxShadow: pixelShadow('var(--accent-blue)'),
          }}>
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.65,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {situation}
            </p>
          </div>

          {/* Choices */}
          {picked === null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '10px',
                color: 'var(--accent-gold)',
                letterSpacing: '2px',
                margin: 0,
              }}>
                你會怎麼做？
              </p>
              {currentStep.choices.map((c, i) => (
                <motion.button
                  key={i}
                  onClick={() => choose(i)}
                  whileHover={{ x: 6 }}
                  style={{
                    textAlign: 'left',
                    background: 'var(--bg-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '14px 16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    boxShadow: pixelShadow('#4A5568'),
                    transition: 'box-shadow 0.15s ease',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: '9px',
                    color: '#4A5568',
                    flexShrink: 0,
                    marginTop: '3px',
                  }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body), sans-serif',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                  }}>
                    {c.text}
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Result */}
          {picked !== null && chosenChoice && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{
                background: isGood ? 'rgba(76,175,80,0.1)' : 'rgba(255,107,107,0.08)',
                padding: '16px',
                borderLeft: `6px solid ${isGood ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '10px',
                  color: isGood ? 'var(--accent-green)' : 'var(--accent-red)',
                  letterSpacing: '1px',
                  margin: '0 0 8px',
                }}>
                  {isGood ? '✓ 好的選擇' : '✗ 還有更好的做法'}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}>
                  {consequence}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={next}
                  style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    color: '#0D1B2A',
                    background: isLastStep ? 'var(--accent-gold)' : 'var(--accent-blue)',
                    border: 'none',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  {isLastStep ? '完成 ✓' : '下一步 ▶'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function pixelShadow(color: string): string {
  return [
    `0 -4px 0 0 ${color}`, `4px 0 0 0 ${color}`,
    `0 4px 0 0 ${color}`, `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`, `4px 4px 0 0 ${color}`,
    `-4px 4px 0 0 ${color}`, `-4px -4px 0 0 ${color}`,
  ].join(', ');
}


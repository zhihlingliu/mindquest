'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LuluDialogue from '@/components/lulu/LuluDialogue';
import PixelBox from '@/components/ui/PixelBox';
import {
  QUIZ_QUESTIONS,
  PLAYER_TYPES,
  calcScores,
  getTopStyle,
  type StyleKey,
} from '@/data/onboarding';
import { usePlayerStore } from '@/store/playerStore';

type Phase = 'intro' | 'quiz' | 'result' | 'enter';

const INTRO_MESSAGE =
  '歡迎來到 MindQuest Academy，讓我先了解你是哪種決策者。\n\n接下來有 10 道情境題，沒有對錯，只有你真實的思考方式。準備好了嗎？';

// ── Shared layout wrapper ───────────────────────────────────────────────────
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: '32px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {children}
      </div>
    </div>
  );
}

// ── Phase 1 — Intro ─────────────────────────────────────────────────────────
function IntroPhase({ onDone }: { onDone: () => void }) {
  const [luluDone, setLuluDone] = useState(false);

  return (
    <Screen>
      <p
        style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '10px',
          color: 'var(--accent-blue)',
          letterSpacing: '3px',
          margin: 0,
        }}
      >
        MODULE 0 — 序章
      </p>
      <LuluDialogue message={INTRO_MESSAGE} mood="excited" onComplete={() => setLuluDone(true)} />
      {luluDone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <CtaButton label="開始診斷 ▶" onClick={onDone} variant="blue" />
        </motion.div>
      )}
    </Screen>
  );
}

// ── Phase 2 — Quiz ──────────────────────────────────────────────────────────
function QuizPhase({ onDone }: { onDone: (answers: StyleKey[]) => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<StyleKey[]>([]);
  const [selected, setSelected] = useState<StyleKey | null>(null);
  const [confirming, setConfirming] = useState(false);

  const q = QUIZ_QUESTIONS[current];
  const progress = Math.round(((current) / QUIZ_QUESTIONS.length) * 100);

  function choose(style: StyleKey) {
    if (confirming) return;
    setSelected(style);
  }

  function confirm() {
    if (!selected || confirming) return;
    setConfirming(true);
    const next = [...answers, selected];

    setTimeout(() => {
      if (current + 1 < QUIZ_QUESTIONS.length) {
        setAnswers(next);
        setCurrent((c) => c + 1);
        setSelected(null);
        setConfirming(false);
      } else {
        onDone(next);
      }
    }, 350);
  }

  return (
    <Screen>
      {/* Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '10px',
            color: 'var(--accent-blue)',
          }}
        >
          <span>認知診斷</span>
          <span>{current + 1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'var(--bg-secondary)',
            boxShadow: '0 -2px 0 0 #4A5568, 2px 0 0 0 #4A5568, 0 2px 0 0 #4A5568, -2px 0 0 0 #4A5568',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'var(--accent-blue)',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <PixelBox variant="default">
            <p
              style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {q.scenario}
            </p>
          </PixelBox>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === opt.style;
              return (
                <button
                  key={opt.style}
                  onClick={() => choose(opt.style)}
                  style={{
                    textAlign: 'left',
                    background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '12px 16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    boxShadow: isSelected
                      ? buildShadow('var(--accent-blue)')
                      : buildShadow('#4A5568'),
                    transition: 'box-shadow 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-pixel), monospace',
                      fontSize: '9px',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                      opacity: isSelected ? 1 : 0.4,
                      flexShrink: 0,
                      marginTop: '3px',
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
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <CtaButton
                label={current + 1 === QUIZ_QUESTIONS.length ? '完成診斷 ▶' : '下一題 ▶'}
                onClick={confirm}
                variant="blue"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}

// ── Phase 3 — Result ────────────────────────────────────────────────────────
function ResultPhase({ answers, onEnter }: { answers: StyleKey[]; onEnter: () => void }) {
  const scores = calcScores(answers);
  const topKey = getTopStyle(scores);
  const type = PLAYER_TYPES[topKey];
  const [luluDone, setLuluDone] = useState(false);

  return (
    <Screen>
      {/* Type reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '14px',
            color: 'var(--accent-gold)',
            letterSpacing: '3px',
            margin: 0,
          }}
        >
          診斷結果
        </p>

        <PixelBox variant="gold">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontSize: '40px', lineHeight: 1 }}>{type.emoji}</span>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 'clamp(14px, 4vw, 22px)',
                  color: type.accentColor,
                  margin: '0 0 4px',
                  letterSpacing: '2px',
                }}
              >
                {type.name}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '10px',
                  color: 'var(--accent-gold)',
                  margin: 0,
                  letterSpacing: '1px',
                }}
              >
                {type.subtitle}
              </p>
            </div>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              margin: '0 0 12px',
            }}
          >
            {type.description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <Tag label={type.trait} color={type.accentColor} />
            <Tag label={`初始優勢：${type.bonus}`} color="var(--accent-gold)" />
          </div>
        </PixelBox>

        {/* Score breakdown */}
        <ScoreBreakdown scores={scores} />
      </motion.div>

      {/* Lulu greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <LuluDialogue
          message={type.luluGreeting}
          mood="thinking"
          onComplete={() => setLuluDone(true)}
        />
      </motion.div>

      {luluDone && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <CtaButton label="▶ 進入學院" onClick={onEnter} variant="gold" />
        </motion.div>
      )}
    </Screen>
  );
}

// ── Root orchestrator ───────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { setPlayerType } = usePlayerStore();
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<StyleKey[]>([]);

  function handleQuizDone(ans: StyleKey[]) {
    setAnswers(ans);
    setPhase('result');
  }

  function handleEnter() {
    const scores = calcScores(answers);
    const topKey = getTopStyle(scores);
    setPlayerType(topKey);           // writes into Zustand + localStorage('mq-player')
    router.push('/dashboard');
  }

  return (
    <AnimatePresence mode="wait">
      {phase === 'intro' && (
        <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <IntroPhase onDone={() => setPhase('quiz')} />
        </motion.div>
      )}
      {phase === 'quiz' && (
        <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <QuizPhase onDone={handleQuizDone} />
        </motion.div>
      )}
      {phase === 'result' && (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ResultPhase answers={answers} onEnter={handleEnter} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Small helpers ───────────────────────────────────────────────────────────
function CtaButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: 'blue' | 'gold';
}) {
  const color = variant === 'gold' ? '#FFD700' : '#29B6F6';
  const dark  = variant === 'gold' ? '#B8860B' : '#1565C0';
  const text  = variant === 'gold' ? '#0D1B2A' : '#0D1B2A';

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-pixel), monospace',
        fontSize: '11px',
        letterSpacing: '2px',
        color: text,
        background: color,
        border: 'none',
        padding: '12px 28px',
        cursor: 'pointer',
        boxShadow: buildShadow(dark) + `, 6px 6px 0 0 rgba(0,0,0,0.6)`,
        transition: 'transform 0.12s ease',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
    >
      {label}
    </button>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-pixel), monospace',
        fontSize: '12px',
        color,
        background: 'var(--bg-primary)',
        padding: '4px 10px',
        letterSpacing: '1px',
        boxShadow: `0 -2px 0 0 ${color}, 2px 0 0 0 ${color}, 0 2px 0 0 ${color}, -2px 0 0 0 ${color}`,
      }}
    >
      {label}
    </span>
  );
}

function ScoreBreakdown({ scores }: { scores: Record<StyleKey, number> }) {
  const labels: Record<StyleKey, string> = {
    A: '分析型',
    D: '指揮型',
    C: '概念型',
    B: '關係型',
  };
  const colors: Record<StyleKey, string> = {
    A: 'var(--accent-blue)',
    D: 'var(--accent-red)',
    C: 'var(--accent-gold)',
    B: 'var(--accent-green)',
  };
  const total = Object.values(scores).reduce((s, n) => s + n, 0) || 1;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
      }}
    >
      {(Object.keys(scores) as StyleKey[]).map((k) => (
        <div
          key={k}
          style={{
            background: 'var(--bg-secondary)',
            padding: '8px 10px',
            borderLeft: `4px solid ${colors[k]}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: '12px',
              color: colors[k],
              letterSpacing: '1px',
            }}
          >
            {labels[k]}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                flex: 1,
                height: '6px',
                background: 'var(--bg-primary)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((scores[k] / total) * 100)}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ height: '100%', background: colors[k] }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '13px',
                color: 'var(--text-primary)',
                flexShrink: 0,
              }}
            >
              {scores[k]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function buildShadow(color: string): string {
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

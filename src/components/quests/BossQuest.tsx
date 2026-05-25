'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LuluDialogue from '@/components/lulu/LuluDialogue';

export interface BossQuestion {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface BossQuestProps {
  bossName: string;
  achievementName: string;
  achievementEmoji?: string;
  luluVictoryLine: string;
  questions: BossQuestion[];
  xpReward: number;
  hasShield?: boolean;
  onUseShield?: () => void;
  hasFocusRune?: boolean;
  onUseFocusRune?: () => void;
  onComplete: (xp: number) => void;
}

type BossPhase = 'intro' | 'battle' | 'victory' | 'defeat';
type HitEffect = 'boss-hit' | 'player-hit' | 'shield' | null;

const PLAYER_HP_LOSS = 25;
const XP_PENALTY = 0.5;

const EFFECT_LABEL: Record<NonNullable<HitEffect>, string> = {
  'boss-hit':   '\u2694 CRITICAL HIT!',
  'player-hit': '\uD83D\uDCA5 BOSS COUNTER!',
  'shield':     '\uD83D\uDEE1 SHIELD ABSORBED!',
};

const EFFECT_COLOR: Record<NonNullable<HitEffect>, string> = {
  'boss-hit':   '#FFD700',
  'player-hit': '#FF6B6B',
  'shield':     '#4CAF50',
};

export default function BossQuest({
  bossName,
  achievementName,
  achievementEmoji = '\u2605',
  luluVictoryLine,
  questions,
  xpReward,
  hasShield = false,
  onUseShield,
  hasFocusRune = false,
  onUseFocusRune,
  onComplete,
}: BossQuestProps) {
  const [phase, setPhase] = useState<BossPhase>('intro');
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [currentQ, setCurrentQ] = useState(0);
  const [bossHP, setBossHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);
  const [picked, setPicked] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [hitEffect, setHitEffect] = useState<HitEffect>(null);
  const [hitCount, setHitCount] = useState(0);
  const [shieldActive, setShieldActive] = useState(hasShield);
  const [shieldConsumed, setShieldConsumed] = useState(false);
  const [runeUsed, setRuneUsed] = useState(false);
  const [luluDone, setLuluDone] = useState(false);

  const bossHPPerQ = Math.floor(100 / activeQuestions.length);
  const isLastQ = currentQ === activeQuestions.length - 1;
  const current = activeQuestions[currentQ];

  /* ── Actions ── */

  function startBattle() {
    setPhase('battle');
    setLuluDone(false);
  }

  function useRune() {
    if (!hasFocusRune || runeUsed || activeQuestions.length <= 1) return;
    setActiveQuestions(qs => qs.slice(0, -1));
    setRuneUsed(true);
    onUseFocusRune?.();
  }

  function choose(idx: number) {
    if (confirmed) return;
    setPicked(idx);
  }

  function confirm() {
    if (picked === null || confirmed) return;
    setConfirmed(true);
    const isCorrect = current.options[picked]?.isCorrect ?? false;

    if (isCorrect) {
      setBossHP(prev => isLastQ ? 0 : Math.max(0, prev - bossHPPerQ));
      triggerHit('boss-hit');
    } else if (shieldActive) {
      setShieldActive(false);
      setShieldConsumed(true);
      onUseShield?.();
      triggerHit('shield');
    } else {
      setPlayerHP(prev => Math.max(0, prev - PLAYER_HP_LOSS));
      triggerHit('player-hit');
    }
  }

  function triggerHit(effect: HitEffect) {
    setHitEffect(effect);
    setHitCount(c => c + 1);
    setTimeout(() => setHitEffect(null), 1400);
  }

  function next() {
    const isCorrect = picked !== null && (current.options[picked]?.isCorrect ?? false);

    if (isLastQ) {
      setPhase(isCorrect ? 'victory' : 'defeat');
      return;
    }

    if (playerHP <= 0) {
      setPhase('defeat');
      return;
    }

    setCurrentQ(q => q + 1);
    setPicked(null);
    setConfirmed(false);
  }

  function resetBattle() {
    setPhase('intro');
    setActiveQuestions(questions);
    setCurrentQ(0);
    setBossHP(100);
    setPlayerHP(100);
    setPicked(null);
    setConfirmed(false);
    setHitEffect(null);
    setShieldActive(hasShield && !shieldConsumed);
    setRuneUsed(false);
    setLuluDone(false);
  }

  /* ── Shared style shorthand ── */
  const px: React.CSSProperties = {
    fontFamily: 'var(--font-pixel), monospace',
    letterSpacing: '1px',
  };

  /* ═══════════════════════════════════════════════════════ */
  return (
    <AnimatePresence mode="wait">

      {/* ─── INTRO ─────────────────────────────────────────── */}
      {phase === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center' }}
        >
          {/* Boss entrance */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              padding: '28px 32px', width: '100%',
              background: 'rgba(255,107,107,0.08)',
              boxShadow: pixelShadow('#FF6B6B'),
            }}
          >
            <motion.span
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ fontSize: '72px', lineHeight: 1 }}
            >
              {achievementEmoji}
            </motion.span>
            <p style={{ ...px, fontSize: '9px', color: 'var(--accent-red)', margin: '4px 0 0', letterSpacing: '3px' }}>
              BOSS BATTLE
            </p>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>
              {bossName}
            </p>
          </motion.div>

          {/* Rune usage before battle */}
          {hasFocusRune && !runeUsed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ width: '100%' }}
            >
              <button
                onClick={useRune}
                style={{
                  ...px, fontSize: '9px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 16px', width: '100%',
                  background: 'rgba(255,215,0,0.06)',
                  border: '1px solid var(--accent-gold)',
                  color: 'var(--accent-gold)',
                }}
              >
                <span style={{ fontSize: '18px' }}>&#9889;</span>
                使用集中符文 &#8212; 跳過最後一題
              </button>
            </motion.div>
          )}

          {/* Lulu intro dialogue */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ width: '100%' }}
          >
            <LuluDialogue
              message="準備好了嗎？這是最終考驗。"
              mood="thinking"
              onComplete={() => setLuluDone(true)}
            />
          </motion.div>

          {luluDone && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <button
                onClick={startBattle}
                style={{
                  ...px, fontSize: '11px', letterSpacing: '2px', cursor: 'pointer',
                  color: '#0D1B2A', background: 'var(--accent-red)',
                  border: 'none', padding: '14px 36px',
                  boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)',
                }}
              >
                開始戰鬥 &#9654;
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ─── BATTLE ─────────────────────────────────────────── */}
      {phase === 'battle' && (
        <motion.div
          key="battle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          {/* HP Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

            {/* Boss HP bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ ...px, fontSize: '8px', color: 'var(--accent-red)', minWidth: '52px' }}>
                {achievementEmoji} BOSS
              </span>
              <div style={{
                flex: 1, height: '14px',
                background: 'rgba(255,107,107,0.18)',
                position: 'relative', overflow: 'hidden',
                boxShadow: '2px 2px 0 0 rgba(0,0,0,0.4)',
              }}>
                <motion.div
                  animate={{ width: `${bossHP}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--accent-red)' }}
                />
              </div>
              <span style={{ ...px, fontSize: '8px', color: 'var(--accent-red)', minWidth: '36px', textAlign: 'right' }}>
                {bossHP}%
              </span>
            </div>

            {/* Hit effect strip */}
            <div style={{ height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <AnimatePresence>
                {hitEffect && (
                  <motion.span
                    key={`${hitEffect}-${hitCount}`}
                    initial={{ opacity: 0, y: 6, scale: 0.75 }}
                    animate={{ opacity: 1, y: 0, scale: 1.1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.85 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      ...px, fontSize: '10px', letterSpacing: '2px',
                      color: EFFECT_COLOR[hitEffect],
                      textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
                      position: 'absolute',
                    }}
                  >
                    {EFFECT_LABEL[hitEffect]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Player HP bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ ...px, fontSize: '8px', color: '#29B6F6', minWidth: '52px' }}>
                YOU
              </span>
              <div style={{
                flex: 1, height: '14px',
                background: 'rgba(41,182,246,0.18)',
                position: 'relative', overflow: 'hidden',
                boxShadow: '2px 2px 0 0 rgba(0,0,0,0.4)',
              }}>
                <motion.div
                  animate={{ width: `${playerHP}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: '#29B6F6' }}
                />
              </div>
              <span style={{ ...px, fontSize: '8px', color: '#29B6F6', minWidth: '36px', textAlign: 'right' }}>
                {playerHP}%
              </span>
            </div>
          </div>

          {/* Item bar */}
          {(shieldActive || (hasFocusRune && !runeUsed)) && (
            <div style={{
              display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
              padding: '8px 12px',
              background: 'rgba(255,215,0,0.04)',
              border: '1px solid rgba(255,215,0,0.2)',
            }}>
              <span style={{ ...px, fontSize: '8px', color: 'var(--accent-gold)' }}>&#9876; 道具：</span>

              {shieldActive && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 10px',
                  background: 'rgba(76,175,80,0.08)',
                  border: '1px solid #4CAF50',
                }}>
                  <span style={{ fontSize: '14px' }}>&#128737;&#65039;</span>
                  <span style={{ ...px, fontSize: '8px', color: '#4CAF50' }}>護盾就緒</span>
                </div>
              )}

              {hasFocusRune && !runeUsed && (
                <button
                  onClick={useRune}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 10px', cursor: 'pointer',
                    background: 'rgba(255,215,0,0.08)',
                    border: '1px solid var(--accent-gold)',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>&#9889;</span>
                  <span style={{ ...px, fontSize: '8px', color: 'var(--accent-gold)' }}>符文：跳過最後一題</span>
                </button>
              )}
            </div>
          )}

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {/* Question card */}
              <div style={{ background: 'var(--bg-secondary)', padding: '16px 18px', boxShadow: pixelShadow('#4A5568') }}>
                <p style={{ ...px, fontSize: '9px', color: 'var(--accent-red)', margin: '0 0 8px' }}>
                  Q{currentQ + 1} / {activeQuestions.length}
                </p>
                <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
                  {current.question}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {current.options.map((opt, i) => {
                  const isChosen = picked === i;
                  const borderColor = confirmed
                    ? opt.isCorrect ? 'var(--accent-green)' : isChosen ? 'var(--accent-red)' : '#4A5568'
                    : isChosen ? 'var(--accent-red)' : '#4A5568';

                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      style={{
                        textAlign: 'left', border: 'none', cursor: confirmed ? 'default' : 'pointer',
                        padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                        boxShadow: pixelShadow(borderColor),
                        transition: 'box-shadow 0.15s ease',
                        background: confirmed && opt.isCorrect
                          ? 'rgba(76,175,80,0.12)'
                          : confirmed && isChosen && !opt.isCorrect
                          ? 'rgba(255,107,107,0.12)'
                          : isChosen
                          ? 'rgba(255,107,107,0.08)'
                          : 'var(--bg-secondary)',
                      }}
                    >
                      <span style={{ ...px, fontSize: '10px', color: borderColor, flexShrink: 0, marginTop: '2px' }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Confirm button */}
              {picked !== null && !confirmed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={confirm}
                    style={{
                      ...px, fontSize: '10px', letterSpacing: '1px', cursor: 'pointer',
                      color: '#0D1B2A', background: 'var(--accent-red)',
                      border: 'none', padding: '10px 22px',
                      boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)',
                    }}
                  >
                    確認 &#9654;
                  </button>
                </motion.div>
              )}

              {/* Explanation + next */}
              {confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-blue)', padding: '12px 14px' }}>
                    <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '13px', color: 'var(--text-primary)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
                      {current.explanation}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={next}
                      style={{
                        ...px, fontSize: '10px', letterSpacing: '1px', cursor: 'pointer',
                        padding: '12px 28px', background: '#FFD700', border: 'none',
                        color: '#0D1B2A', fontFamily: 'var(--font-pixel), monospace',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                    >
                      {currentQ + 1 < activeQuestions.length ? '繼續 ▶' : '決戰 ⚔'}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

        {/* FAILED */}
        {phase === 'defeat' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '32px 24px' }}
          >
            <span style={{ fontSize: '56px' }}>💀</span>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-red)', letterSpacing: '3px', margin: 0 }}>DEFEATED</p>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.75, margin: 0, lineHeight: 1.7, textAlign: 'center', maxWidth: '380px' }}>
              {bossName} 的力量太強了。每一次失敗都是數據——你現在知道哪個弱點需要補強。
            </p>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '8px', color: 'var(--accent-gold)', opacity: 0.6, margin: 0 }}>
              XP 懲罰已套用 (-{Math.round(xpReward * XP_PENALTY)} XP)
            </p>
            <button onClick={resetBattle} style={{ ...px, fontSize: '10px', letterSpacing: '1px', cursor: 'pointer', padding: '12px 28px', background: 'var(--accent-red)', border: 'none', color: '#0D1B2A', fontFamily: 'var(--font-pixel), monospace' }}>
              重新挑戰 ↺
            </button>
          </motion.div>
        )}

        {/* VICTORY */}
        {phase === 'victory' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}
          >
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>{achievementEmoji}</span>
              <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '3px', margin: '0 0 6px' }}>ACHIEVEMENT UNLOCKED</p>
              <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{achievementName}</p>
            </div>
            <LuluDialogue message={luluVictoryLine} mood="excited" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '2px', margin: '0 0 4px', opacity: 0.8 }}>XP EARNED</p>
              <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '22px', color: 'var(--accent-gold)', margin: 0 }}>+{xpReward}</p>
            </div>
            <button
              onClick={() => onComplete(xpReward)}
              style={{ ...px, fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', padding: '14px 32px', background: 'var(--accent-gold)', border: 'none', color: '#0D1B2A', fontFamily: 'var(--font-pixel), monospace', transition: 'transform 0.1s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              繼續冒險 ▶
            </button>
          </motion.div>
        )}
    </AnimatePresence>
  );
}

function pixelShadow(color: string): string {
  return ['0 -4px 0 0', '4px 0 0 0', '0 4px 0 0', '-4px 0 0 0', '4px -4px 0 0', '4px 4px 0 0', '-4px 4px 0 0', '-4px -4px 0 0'].map(s => s + ' ' + color).join(', ');
}

'use client';

import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';

interface AchievementDef {
  name: string;
  emoji: string;
  hint: string;
  moduleId: number;
}

const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { name: '直覺免疫',    emoji: '🧠', hint: '擊敗 Module 1 的注意力盜賊',     moduleId: 1 },
  { name: 'Simon 滿意者', emoji: '⚖️', hint: '征服 Module 2 的完美決策幻象',  moduleId: 2 },
  { name: '說服建築師',  emoji: '🎭', hint: '掌握 Module 3 的影響力廊道',     moduleId: 3 },
  { name: '社群智者',   emoji: '🕸️', hint: '看透 Module 4 的社群動力引擎',   moduleId: 4 },
  { name: '策略制定者',  emoji: '🗻', hint: '登上 Module 5 的策略高地',       moduleId: 5 },
  { name: '組織解謎師',  emoji: '🏛️', hint: '破解 Module 6 的組織迷宮',      moduleId: 6 },
];

export default function AchievementsPage() {
  const router = useRouter();
  const { achievements } = usePlayerStore();

  const unlocked = ALL_ACHIEVEMENTS.filter((a) => achievements.includes(a.name));
  const locked   = ALL_ACHIEVEMENTS.filter((a) => !achievements.includes(a.name));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '4px solid var(--accent-gold)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--text-primary)', opacity: 0.55, letterSpacing: '1px', padding: 0, flexShrink: 0 }}
        >
          ← 返回學院
        </button>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '3px' }}>
          HALL OF MASTERY
        </span>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: 'var(--accent-green)', letterSpacing: '1px', marginLeft: 'auto' }}>
          {unlocked.length} / {ALL_ACHIEVEMENTS.length} 解鎖
        </span>
      </header>

      <main style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <section>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '2px', margin: '0 0 16px' }}>
              ★ 已解鎖
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {unlocked.map((a) => (
                <div key={a.name} style={{
                  background: 'var(--bg-secondary)',
                  padding: '20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'center',
                  boxShadow: pixelShadow('var(--accent-gold)'),
                }}>
                  <span style={{ fontSize: '36px', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' }}>{a.emoji}</span>
                  <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', margin: 0, letterSpacing: '1px', lineHeight: 1.6 }}>
                    {a.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '11px', color: 'var(--text-primary)', opacity: 0.55, margin: 0, lineHeight: 1.5 }}>
                    {a.hint}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <section>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: '#4A5568', letterSpacing: '2px', margin: '0 0 16px' }}>
              🔒 未解鎖 ({locked.length})
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {locked.map((a) => (
                <div key={a.name} style={{
                  background: 'var(--bg-secondary)',
                  padding: '20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'center',
                  boxShadow: pixelShadow('#2D3748'),
                  opacity: 0.5,
                }}>
                  <span style={{ fontSize: '36px', filter: 'grayscale(100%)' }}>❓</span>
                  <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: '#4A5568', margin: 0, letterSpacing: '1px' }}>
                    ???
                  </p>
                  <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '11px', color: 'var(--text-primary)', opacity: 0.4, margin: 0, lineHeight: 1.5 }}>
                    Module {a.moduleId} Boss 掉落
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {unlocked.length === 0 && locked.length === 0 && (
          <p style={{ fontFamily: 'var(--font-body), sans-serif',
            fontSize: '14px', color: 'var(--text-primary)', opacity: 0.5,
            textAlign: 'center', margin: '40px auto',
          }}>
            尚未解鎖任何成就。完成更多任務來獲得成就！
          </p>
        )}
      </main>
    </div>
  );
}

function AchievementCard({ id, unlocked }: { id: string; unlocked: boolean }) {
  const meta = ACHIEVEMENT_META[id] ?? { emoji: '🏅', name: id, description: '完成特殊挑戰' };
  const borderColor = unlocked ? 'var(--accent-gold)' : '#4A5568';
  const shadowParts = ['0 -4px 0 0', '4px 0 0 0', '0 4px 0 0', '-4px 0 0 0', '4px -4px 0 0', '4px 4px 0 0', '-4px 4px 0 0', '-4px -4px 0 0'];
  const boxShadow = shadowParts.map(s => s + ' ' + borderColor).join(', ');

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      padding: '18px 16px',
      display: 'flex', alignItems: 'center', gap: '14px',
      boxShadow,
      opacity: unlocked ? 1 : 0.45,
      filter: unlocked ? 'none' : 'grayscale(0.6)',
      transition: 'opacity 0.3s ease',
    }}>
      <span style={{ fontSize: '28px', flexShrink: 0, lineHeight: 1 }}>{meta.emoji}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: unlocked ? 'var(--accent-gold)' : '#9E9E9E', letterSpacing: '1px', margin: '0 0 4px' }}>
          {unlocked ? 'UNLOCKED' : 'LOCKED'}
        </p>
        <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>
          {meta.name}
        </p>
        <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '12px', color: 'var(--text-primary)', opacity: 0.6, margin: 0 }}>
          {meta.description}
        </p>
      </div>
    </div>
  );
}

const ACHIEVEMENT_META: Record<string, { emoji: string; name: string; description: string }> = {
  'first-quest':        { emoji: '⚡', name: '初次覺醒',      description: '完成第一個任務' },
  'first-module':       { emoji: '🗺️', name: '旅程開始',      description: '完成第一個模組' },
  'all-modules':        { emoji: '🏆', name: 'Cognitia 征服者', description: '完成所有六個模組' },
  'boss-first-try':     { emoji: '⚔️', name: '一擊必中',       description: '一次通關 Boss 戰' },
  'reflection-writer':  { emoji: '✏️', name: '反思者',         description: '完成三個反思書寫任務' },
  '認知解鎖者':          { emoji: '🧠', name: '認知解鎖者',     description: '擊敗認知迷霧的注意力盜賊' },
  'Simon 滿意者':        { emoji: '⚖️', name: 'Simon 滿意者',   description: '擊敗決策峰頂的完美決策幻象' },
  '說服建築師':          { emoji: '🎭', name: '說服建築師',     description: '擊敗影響力廊的幻術師' },
};

function pixelShadow(color: string): string {
  return ['0 -4px 0 0','4px 0 0 0','0 4px 0 0','-4px 0 0 0','4px -4px 0 0','4px 4px 0 0','-4px 4px 0 0','-4px -4px 0 0'].map(s => s + ' ' + color).join(', ');
}

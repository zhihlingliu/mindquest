'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import XPBar from '@/components/ui/XPBar';
import PixelBox from '@/components/ui/PixelBox';
import { usePlayerStore, LEVEL_TITLES, xpForLevel, xpForNextLevel } from '@/store/playerStore';
import { PLAYER_TYPES } from '@/data/onboarding';
import type { StyleKey } from '@/data/onboarding';

interface NavCard {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  accent: string;
  href: string;
}

const NAV_CARDS: NavCard[] = [
  { id: 'map',          label: '世界地圖',    sublabel: 'World Map',       icon: '◈', accent: 'var(--accent-blue)',  href: '/map'          },
  { id: 'quests',       label: '任務記錄',     sublabel: 'Quest Log',        icon: '❑', accent: 'var(--accent-gold)',  href: '/quests'       },
  { id: 'achievements', label: '成就廳',       sublabel: 'Hall of Mastery', icon: '★', accent: 'var(--accent-green)', href: '/achievements' },
  { id: 'lulu',         label: 'Lulu 辦公室', sublabel: "Lulu's Office",   icon: '♦', accent: 'var(--accent-red)',   href: '/lulu'         },
  { id: 'fragments',    label: '理論典藏館',   sublabel: 'Theory Archive',  icon: '◫', accent: '#FFF176',             href: '/fragments'    },
];

export default function DashboardPage() {
  const router = useRouter();
  const { xp, level, playerType, completedQuests, completedModules, stats, reset } = usePlayerStore();

  const handleReset = useCallback(() => {
    if (confirm('確定要重新開始遊戲嗎？所有進度將會清除。')) {
      reset();
      router.push('/onboarding');
    }
  }, [reset, router]);

  const levelTitle  = LEVEL_TITLES[level] ?? '管理者';
  const xpCurrent   = xp - xpForLevel(level);
  const xpNext      = xpForNextLevel(level) - xpForLevel(level);

  const typeKey     = playerType as StyleKey | null;
  const typeInfo    = typeKey ? PLAYER_TYPES[typeKey] : null;
  const styleLabel  = typeInfo ? `${typeInfo.emoji} ${typeInfo.name} / ${typeInfo.subtitle}` : '未診斷';
  const styleColor  = typeInfo ? typeInfo.accentColor : 'var(--accent-green)';

  const chapterLabel = completedModules.length === 0
    ? '序章 — 覺醒'
    : `Module ${Math.max(...completedModules)} 完成`;

  const isGameComplete = completedModules.length >= 6;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '4px solid var(--accent-gold)', padding: '12px 24px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>
        {/* Left: logo */}
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '3px' }}>
          MindQuest
        </span>

        {/* Center: XP bar */}
        <div style={{ width: 'min(480px, 50vw)', textAlign: 'center' }}>
          <XPBar currentXP={xpCurrent} maxXP={xpNext} level={level} title={levelTitle} />
        </div>

        {/* Right: player type badge + reset */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          {typeInfo && (
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: 'var(--bg-primary)',
                boxShadow: `0 -2px 0 0 ${typeInfo.accentColor}, 2px 0 0 0 ${typeInfo.accentColor}, 0 2px 0 0 ${typeInfo.accentColor}, -2px 0 0 0 ${typeInfo.accentColor}`,
              }}
            >
              <span style={{ fontSize: '14px' }}>{typeInfo.emoji}</span>
              <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: typeInfo.accentColor, letterSpacing: '1px' }}>
                {typeInfo.subtitle}
              </span>
            </div>
          )}
          <button
            onClick={handleReset}
            style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: '#FF6B6B', background: 'transparent', border: '2px solid #FF6B6B', padding: '5px 10px', cursor: 'pointer', letterSpacing: 1, flexShrink: 0 }}
          >
            ↺ 重新開始
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Welcome */}
        <div>
          <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', letterSpacing: '3px', margin: '0 0 8px' }}>
            WELCOME BACK
          </p>
          <h1 style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
            Cognitia 大陸正在等待你，管理者。
          </h1>
        </div>

        {/* Game Complete Banner */}
        {isGameComplete && (
          <div style={{
            background: 'var(--bg-secondary)',
            boxShadow: [
              '0 -4px 0 0 var(--accent-gold)', '4px 0 0 0 var(--accent-gold)',
              '0 4px 0 0 var(--accent-gold)', '-4px 0 0 0 var(--accent-gold)',
              '4px -4px 0 0 var(--accent-gold)', '4px 4px 0 0 var(--accent-gold)',
              '-4px 4px 0 0 var(--accent-gold)', '-4px -4px 0 0 var(--accent-gold)',
            ].join(', '),
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '48px', filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' }}>🏆</span>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '4px', margin: 0 }}>
              COGNITIA CLEARED
            </p>
            <h2 style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              你已征服 Cognitia 大陸的全部六個領域！
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['🧠 M1', '⚖️ M2', '🎭 M3', '🔥 M4', '🗺️ M5', '🏛️ M6'].map((badge) => (
                <span key={badge} style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '10px',
                  color: 'var(--accent-gold)',
                  padding: '4px 8px',
                  background: 'var(--bg-primary)',
                  letterSpacing: '1px',
                }}>
                  {badge}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '13px', color: 'var(--text-primary)', opacity: 0.7, margin: 0, lineHeight: 1.6, maxWidth: '480px' }}>
              Lulu 微笑著說：「你不只是讀過管理理論，你已在這場試煉中親自做出選擇、承擔後果，並一步步成長。這，才是真正的管理者之路。」
            </p>
          </div>
        )}

        {/* Nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
          {NAV_CARDS.map((card) => (
            <NavCardButton key={card.id} card={card} onClick={() => router.push(card.href)} />
          ))}
        </div>

        {/* Status panel */}
        <PixelBox variant="default">
          <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '2px', margin: '0 0 16px' }}>
            STATUS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <StatRow label="CHAPTER"   value={chapterLabel}                     color="var(--accent-gold)"  />
            <StatRow label="QUESTS"    value={`${completedQuests.length} 完成`} color="var(--accent-blue)"  />
            <StatRow label="STYLE"     value={styleLabel}                        color={styleColor}           />
            <StatRow label="LEVEL"     value={`Lv.${level}  ${levelTitle}`}     color="var(--accent-red)"   />
          </div>
        </PixelBox>

        {/* Stats panel */}
        <PixelBox variant="default">
          <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', letterSpacing: '2px', margin: '0 0 16px' }}>
            MANAGER STATS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <StatBar label="COGNITION 認知力"   value={stats.cognition}     color="#29B6F6" />
            <StatBar label="DECISION 決策力"     value={stats.decisionPower} color="#FFD700" />
            <StatBar label="INFLUENCE 影響力"    value={stats.influence}     color="#4CAF50" />
            <StatBar label="SOCIAL 社會資本"     value={stats.socialCapital} color="#C084FC" />
            <StatBar label="ORG WISDOM 組織智慧" value={stats.orgWisdom}     color="#FF9800" />
          </div>
        </PixelBox>
      </main>
    </div>
  );
}

function NavCardButton({ card, onClick }: { card: NavCard; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '24px 20px', textAlign: 'left', boxShadow: shadow(card.accent, '12px 12px 0 0 rgba(0,0,0,0.7)'), transition: 'transform 0.12s ease, box-shadow 0.12s ease', display: 'flex', flexDirection: 'column', gap: '10px' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = shadow(card.accent, '16px 16px 0 0 rgba(0,0,0,0.7), 0 0 20px 4px ' + card.accent + '44');
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = shadow(card.accent, '12px 12px 0 0 rgba(0,0,0,0.7)');
      }}
    >
      <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '28px', color: card.accent, lineHeight: 1, display: 'block' }}>{card.icon}</span>
      <div>
        <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{card.label}</p>
        <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: card.accent, margin: 0, opacity: 0.8, letterSpacing: '1px' }}>{card.sublabel}</p>
      </div>
      <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: card.accent, alignSelf: 'flex-end', opacity: 0.6 }}>▶</span>
    </button>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px 12px', background: 'var(--bg-primary)', borderLeft: '4px solid ' + color }}>
      <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color, letterSpacing: '1px' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(Math.round((value / 100) * 100), 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color, letterSpacing: '1px' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color, opacity: 0.8 }}>{value}</span>
      </div>
      <div style={{ height: '8px', background: 'var(--bg-primary)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: pct + '%', background: color, boxShadow: '0 0 8px 2px ' + color + '55', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function shadow(color: string, extra: string) {
  return ['0 -4px 0 0', '4px 0 0 0', '0 4px 0 0', '-4px 0 0 0', '4px -4px 0 0', '4px 4px 0 0', '-4px 4px 0 0', '-4px -4px 0 0'].map(s => s + ' ' + color).concat([extra]).join(', ');
}

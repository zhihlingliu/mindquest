'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore, type PlayerState } from '@/store/playerStore';
import {
  getLuluResponse,
  type LuluContext,
  type LuluResponse,
} from '@/lib/lulu-intelligence';
import LuluMemoryPanel from '@/components/lulu/LuluMemoryPanel';

const MOOD_COLOR: Record<LuluResponse['mood'], string> = {
  normal:    '#29B6F6',
  excited:   '#FFD700',
  challenge: '#FF6B6B',
  thinking:  '#9C27B0',
  warning:   '#FF9800',
};

const MOOD_LABEL: Record<LuluResponse['mood'], string> = {
  normal:    '思考中',
  excited:   '很有精神',
  challenge: '挑戰模式',
  thinking:  '深度分析',
  warning:   '注意',
};

type TopicKey =
  | 'progress' | 'stats' | 'profile' | 'challenge'
  | 'module1' | 'module2' | 'module3' | 'module4' | 'module5' | 'module6'
  | 'reflection';

interface Topic { id: TopicKey; label: string; emoji: string; group: string }

const TOPICS: Topic[] = [
  { id: 'progress',   label: '我今天的進度',   emoji: '📊', group: '關於我' },
  { id: 'stats',      label: '解讀我的能力值',  emoji: '⚡', group: '關於我' },
  { id: 'profile',    label: '角色建議',        emoji: '🎯', group: '關於我' },
  { id: 'challenge',  label: '給我挑戰',        emoji: '⚔️', group: '關於我' },
  { id: 'module1',    label: '認知迷霧',        emoji: '🧠', group: '複習課程' },
  { id: 'module2',    label: '決策峰頂',        emoji: '⚖️', group: '複習課程' },
  { id: 'module3',    label: '影響力廊',        emoji: '🌐', group: '複習課程' },
  { id: 'module4',    label: '群體引力',        emoji: '🔥', group: '複習課程' },
  { id: 'module5',    label: '策略高地',        emoji: '🗺️', group: '複習課程' },
  { id: 'module6',    label: '組織迷宮',        emoji: '🏛️', group: '複習課程' },
  { id: 'reflection', label: '反思回饋',        emoji: '✏️', group: '特殊' },
];

const REFLECTION_QUEST_IDS: Record<number, string> = {
  1: 'm1q4', 2: 'm2q4', 3: 'm3q4', 4: 'm4q4', 5: 'm5q4', 6: 'm6q4',
};
const REFLECTION_MODULE_LABELS: Record<number, string> = {
  1: 'Module 1 · 認知迷霧', 2: 'Module 2 · 決策峰頂',
  3: 'Module 3 · 影響力廊', 4: 'Module 4 · 群體引力',
  5: 'Module 5 · 策略高地', 6: 'Module 6 · 組織迷宮',
};

const STAT_META: Array<{ key: keyof LuluContext['stats']; label: string; color: string }> = [
  { key: 'cognition',     label: 'COGNITION',  color: '#29B6F6' },
  { key: 'decisionPower', label: 'DECISION',   color: '#FFD700' },
  { key: 'influence',     label: 'INFLUENCE',  color: '#4CAF50' },
  { key: 'socialCapital', label: 'SOCIAL',     color: '#C084FC' },
  { key: 'orgWisdom',     label: 'ORG WISDOM', color: '#FF9800' },
];

function buildCtx(store: PlayerState): LuluContext {
  return {
    stats: store.stats,
    playerType: store.playerType,
    level: store.level,
    completedModules: store.completedModules,
    achievements: store.achievements,
  };
}

function getTopicResponse(topic: TopicKey, ctx: LuluContext): LuluResponse {
  switch (topic) {
    case 'progress':   return getLuluResponse('recap',   ctx);
    case 'stats':      return getLuluResponse('stat',    ctx);
    case 'profile':    return getLuluResponse('profile', ctx);
    case 'challenge':  return getLuluResponse('stat',    ctx);
    case 'module1':    return getLuluResponse('recap',   { ...ctx, currentModuleId: 1 });
    case 'module2':    return getLuluResponse('recap',   { ...ctx, currentModuleId: 2 });
    case 'module3':    return getLuluResponse('recap',   { ...ctx, currentModuleId: 3 });
    case 'module4':    return getLuluResponse('recap',   { ...ctx, currentModuleId: 4 });
    case 'module5':    return getLuluResponse('recap',   { ...ctx, currentModuleId: 5 });
    case 'module6':    return getLuluResponse('recap',   { ...ctx, currentModuleId: 6 });
    case 'reflection': return { message: '選擇下方已完成的反思任務，我會給你個性化的觀察與延伸問題。', mood: 'thinking' };
  }
}

function px(color: string): string {
  return [
    `0 -4px 0 0 ${color}`, `4px 0 0 0 ${color}`,
    `0 4px 0 0 ${color}`, `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`, `4px 4px 0 0 ${color}`,
    `-4px 4px 0 0 ${color}`, `-4px -4px 0 0 ${color}`,
  ].join(', ');
}

const GROUPS = ['關於我', '複習課程', '特殊'] as const;

export default function LuluPage() {
  const router = useRouter();
  const store  = usePlayerStore();
  const ctx    = buildCtx(store);

  const openingResponse = getLuluResponse('recap', ctx);

  const [activeTopic,      setActiveTopic]      = useState<TopicKey | null>(null);
  const [activeResponse,   setActiveResponse]   = useState<LuluResponse>(openingResponse);
  const [displayText,      setDisplayText]      = useState('');
  const [typingDone,       setTypingDone]        = useState(false);
  const [memoryOpen,       setMemoryOpen]        = useState(false);
  const [activeReflection, setActiveReflection] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const completedReflections = Object.entries(REFLECTION_QUEST_IDS)
    .filter(([, qid]) => store.completedQuests.includes(qid))
    .map(([mid]) => Number(mid));

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayText('');
    setTypingDone(false);
    let i = 0;
    const msg = activeResponse.message;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayText(msg.slice(0, i));
      if (i >= msg.length) { clearInterval(timerRef.current!); setTypingDone(true); }
    }, 28);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeResponse]);

  function selectTopic(topic: TopicKey) {
    setActiveTopic(topic);
    setActiveReflection(null);
    setActiveResponse(getTopicResponse(topic, ctx));
  }
  function selectReflection(moduleId: number) {
    setActiveReflection(moduleId);
    setActiveResponse(getLuluResponse('reflection', { ...ctx, currentModuleId: moduleId }));
  }
  function skipTyping() {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayText(activeResponse.message);
    setTypingDone(true);
  }

  const moodColor = MOOD_COLOR[activeResponse.mood];
  const moodLabel = MOOD_LABEL[activeResponse.mood];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '3px solid var(--accent-red)',
        padding: '0 24px', height: 48,
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
      }}>
        <button onClick={() => router.push('/dashboard')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-pixel), monospace', fontSize: 9,
          color: 'var(--text-primary)', opacity: 0.5, letterSpacing: 1, padding: 0,
        }}>← 返回學院</button>
        <span style={{
          fontFamily: 'var(--font-pixel), monospace', fontSize: 10,
          color: 'var(--accent-red)', letterSpacing: 3,
        }}>LULU&apos;S OFFICE</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => setMemoryOpen(true)} style={{
          fontFamily: 'var(--font-pixel), monospace', fontSize: 8,
          color: 'var(--accent-red)', background: 'transparent',
          border: '2px solid var(--accent-red)',
          padding: '5px 12px', cursor: 'pointer', letterSpacing: 1,
        }}>🦊 觀察記錄</button>
      </header>

      {/* ── Body ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        maxHeight: 'calc(100vh - 48px)',
        overflow: 'hidden',
      }}>

        {/* ══ LEFT SIDEBAR ══ */}
        <aside style={{
          background: 'var(--bg-secondary)',
          borderRight: '2px solid rgba(255,107,107,0.12)',
          overflowY: 'auto',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>

          {/* Lulu avatar mini */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 20, padding: '10px 12px',
            background: 'var(--bg-primary)',
          }}>
            <div style={{
              width: 40, height: 40, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
              outline: '2px solid ' + moodColor,
              transition: 'outline-color 0.4s ease',
            }}>🦊</div>
            <div>
              <p style={{
                fontFamily: 'var(--font-pixel), monospace', fontSize: 8,
                color: moodColor, letterSpacing: 2, margin: 0, transition: 'color 0.4s ease',
              }}>LULU</p>
              <p style={{
                fontFamily: 'var(--font-pixel), monospace', fontSize: 9,
                color: 'var(--text-primary)', opacity: 0.45, margin: '2px 0 0', letterSpacing: 1,
              }}>{moodLabel.toUpperCase()}</p>
            </div>
          </div>

          {/* Topic groups */}
          {GROUPS.map((group) => {
            const groupTopics = TOPICS.filter((t) => t.group === group);
            return (
              <div key={group} style={{ marginBottom: 12 }}>
                <p style={{
                  fontFamily: 'var(--font-pixel), monospace', fontSize: 10,
                  color: 'var(--text-primary)', opacity: 0.3,
                  letterSpacing: 2, margin: '0 0 6px 4px',
                }}>{group.toUpperCase()}</p>
                {groupTopics.map((topic) => {
                  const isActive = activeTopic === topic.id;
                  const borderColor = isActive ? moodColor : 'transparent';
                  const bgColor = isActive ? moodColor + '18' : 'transparent';
                  const textColor = isActive ? moodColor : 'var(--text-primary)';
                  return (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(topic.id)}
                      style={{
                        width: '100%', textAlign: 'left',
                        background: bgColor,
                        border: 'none', cursor: 'pointer',
                        padding: '8px 10px',
                        display: 'flex', alignItems: 'center', gap: 8,
                        borderLeft: '3px solid ' + borderColor,
                        transition: 'all 0.15s ease',
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 13, flexShrink: 0, lineHeight: 1 }}>{topic.emoji}</span>
                      <span style={{
                        fontFamily: 'var(--font-body), sans-serif',
                        fontSize: 12, fontWeight: isActive ? 700 : 500,
                        color: textColor,
                        opacity: isActive ? 1 : 0.75,
                        transition: 'color 0.15s ease',
                      }}>{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Reflection sub-list */}
          {activeTopic === 'reflection' && (
            <div style={{
              marginTop: 4, padding: '10px',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(158,158,158,0.18)',
            }}>
              <p style={{
                fontFamily: 'var(--font-pixel), monospace', fontSize: 9,
                color: '#9E9E9E', letterSpacing: 1, margin: '0 0 8px',
              }}>已完成的反思</p>
              {completedReflections.length === 0 ? (
                <p style={{ fontSize: 11, color: 'var(--text-primary)', opacity: 0.35, margin: 0, lineHeight: 1.5 }}>
                  完成模組反思任務後在這裡查看回饋
                </p>
              ) : (
                completedReflections.map((mid) => {
                  const isActive = activeReflection === mid;
                  return (
                    <button
                      key={mid}
                      onClick={() => selectReflection(mid)}
                      style={{
                        width: '100%', textAlign: 'left',
                        background: isActive ? 'rgba(158,158,158,0.1)' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        padding: '6px 8px',
                        display: 'flex', alignItems: 'center', gap: 6,
                        borderLeft: isActive ? '3px solid #9E9E9E' : '3px solid transparent',
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 11 }}>✏️</span>
                      <span style={{
                        fontSize: 11, fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#9E9E9E' : 'var(--text-primary)',
                        opacity: isActive ? 1 : 0.65,
                      }}>{REFLECTION_MODULE_LABELS[mid] ?? 'Module ' + mid}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </aside>

        {/* ══ RIGHT MAIN ══ */}
        <main style={{
          overflowY: 'auto',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>

          {/* ── Lulu Response Card ── */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '24px 28px',
            boxShadow: px(moodColor),
            transition: 'box-shadow 0.4s ease',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Scanline */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)',
            }} />

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, position: 'relative' }}>
              <div style={{
                width: 52, height: 52, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30,
                outline: '2px solid ' + moodColor,
                outlineOffset: 3,
                boxShadow: '0 0 18px 4px ' + moodColor + '44',
                transition: 'all 0.4s ease',
              }}>🦊</div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: 'var(--font-pixel), monospace', fontSize: 9,
                  color: moodColor, letterSpacing: 2, margin: 0, transition: 'color 0.4s ease',
                }}>LULU ★ {activeResponse.mood.toUpperCase()}</p>
                {activeTopic && (
                  <p style={{
                    fontFamily: 'var(--font-pixel), monospace', fontSize: 9,
                    color: 'var(--text-primary)', opacity: 0.4, letterSpacing: 1, margin: '4px 0 0',
                  }}>
                    {TOPICS.find((t) => t.id === activeTopic)?.emoji + ' ' + (TOPICS.find((t) => t.id === activeTopic)?.label.toUpperCase() ?? '')}
                    {activeReflection ? ' › MODULE ' + activeReflection : ''}
                  </p>
                )}
              </div>
              {!typingDone && (
                <button onClick={skipTyping} style={{
                  fontFamily: 'var(--font-pixel), monospace', fontSize: 7,
                  color: moodColor, background: 'transparent',
                  border: '1px solid ' + moodColor + '55',
                  padding: '4px 10px', cursor: 'pointer', letterSpacing: 1, opacity: 0.7,
                }}>SKIP ▶▶</button>
              )}
            </div>

            {/* Message */}
            <div style={{
              minHeight: 80,
              borderLeft: '3px solid ' + moodColor,
              paddingLeft: 18,
              transition: 'border-color 0.4s ease',
              position: 'relative',
            }}>
              <p style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: 15, color: 'var(--text-primary)',
                lineHeight: 1.85, margin: 0, whiteSpace: 'pre-wrap',
              }}>
                {displayText}
                {!typingDone && (
                  <span style={{
                    display: 'inline-block', width: 9, height: 16,
                    background: moodColor, marginLeft: 2,
                    verticalAlign: 'middle',
                    animation: 'lulucursor 0.6s step-end infinite',
                  }} />
                )}
              </p>
            </div>

            {/* Hint */}
            {typingDone && activeResponse.hint && (
              <div style={{
                marginTop: 18, padding: '12px 16px',
                background: 'rgba(255,215,0,0.05)',
                borderLeft: '3px solid var(--accent-gold)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body), sans-serif', fontSize: 13,
                  color: 'var(--text-primary)', opacity: 0.85, margin: 0, lineHeight: 1.7,
                }}>💡 {activeResponse.hint}</p>
              </div>
            )}

            {/* Followup */}
            {typingDone && activeResponse.followup && (
              <div style={{
                marginTop: 10, padding: '12px 16px',
                background: 'rgba(34,211,238,0.04)',
                borderLeft: '3px solid #22D3EE',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body), sans-serif', fontSize: 13,
                  color: 'var(--text-primary)', opacity: 0.8, margin: 0,
                  lineHeight: 1.7, fontStyle: 'italic',
                }}>💭 {activeResponse.followup}</p>
              </div>
            )}
          </div>

          {/* No topic hint */}
          {!activeTopic && (
            <div style={{ textAlign: 'center', padding: '32px 20px', opacity: 0.4 }}>
              <p style={{
                fontFamily: 'var(--font-pixel), monospace', fontSize: 9,
                color: 'var(--text-primary)', letterSpacing: 2, margin: 0,
              }}>← 從左側選擇一個主題開始對話</p>
            </div>
          )}

          {/* ── Stats ── */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '18px 22px',
            boxShadow: px('#2D3748'),
          }}>
            <p style={{
              fontFamily: 'var(--font-pixel), monospace', fontSize: 8,
              color: '#4A9EFF', letterSpacing: 3, margin: '0 0 14px',
            }}>MANAGER STATS</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
              {STAT_META.map(({ key, label, color }) => {
                const val = store.stats[key];
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 9, color, letterSpacing: 1 }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 9, color, opacity: 0.7 }}>{val}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-primary)' }}>
                      <div style={{
                        height: '100%', width: Math.min(val, 100) + '%',
                        background: color, boxShadow: '0 0 8px 2px ' + color + '55',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Memory trigger */}
          <button
            onClick={() => setMemoryOpen(true)}
            style={{
              width: '100%',
              fontFamily: 'var(--font-pixel), monospace', fontSize: 9,
              color: 'var(--accent-red)', background: 'transparent',
              border: '2px solid var(--accent-red)',
              padding: '14px', cursor: 'pointer', letterSpacing: 2,
            }}
          >
            🦊 查看 LULU 的觀察記錄 ▶
          </button>
        </main>
      </div>

      <LuluMemoryPanel ctx={ctx} isOpen={memoryOpen} onClose={() => setMemoryOpen(false)} />

      <style>{`
        @keyframes lulucursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

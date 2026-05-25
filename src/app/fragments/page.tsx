'use client';

import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';
import { THEORY_FRAGMENTS } from '@/data/map/fragments';

const MODULE_META: Record<number, { name: string; emoji: string; color: string }> = {
  1: { name: '認知迷霧',  emoji: '🧠', color: '#29B6F6' },
  2: { name: '決策峰頂',  emoji: '⚖️', color: '#FFD700' },
  3: { name: '影響力廊',  emoji: '🌐', color: '#4CAF50' },
  4: { name: '群體引力',  emoji: '🔥', color: '#C084FC' },
  5: { name: '策略高地',  emoji: '🗺️', color: '#FF9800' },
  6: { name: '組織迷宮',  emoji: '🏛️', color: '#FF6B6B' },
};

export default function FragmentsPage() {
  const router = useRouter();
  const { discoveredFragments } = usePlayerStore();

  const discovered = discoveredFragments.length;
  const total = THEORY_FRAGMENTS.length;

  // Group fragments by moduleId
  const byModule = new Map<number, typeof THEORY_FRAGMENTS>();
  for (const frag of THEORY_FRAGMENTS) {
    if (!byModule.has(frag.moduleId)) byModule.set(frag.moduleId, []);
    byModule.get(frag.moduleId)!.push(frag);
  }
  const moduleIds = [1, 2, 3, 4, 5, 6];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Header ── */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '4px solid var(--accent-gold)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--text-primary)', opacity: 0.55, letterSpacing: '1px', padding: 0, flexShrink: 0 }}
        >
          ← 返回學院
        </button>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '3px' }}>
          THEORY ARCHIVE
        </span>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: '#FFF176', letterSpacing: '1px', marginLeft: 'auto' }}>
          {discovered} / {total} 發現
        </span>
      </header>

      {/* ── Progress bar ── */}
      <div style={{ height: 6, background: 'var(--bg-secondary)' }}>
        <div style={{
          height: '100%',
          width: `${Math.round((discovered / total) * 100)}%`,
          background: 'linear-gradient(90deg, var(--accent-gold), #FFF176)',
          transition: 'width 0.8s ease',
          boxShadow: '0 0 10px 2px rgba(255,215,0,0.5)',
        }} />
      </div>

      {/* ── Subtitle ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 0' }}>
        <p style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontSize: 14,
          color: 'var(--text-primary)',
          opacity: 0.6,
          margin: 0,
          lineHeight: 1.6,
        }}>
          在 Cognitia 大陸探索時踩上發光地磚，或與特定 NPC 對話，即可收集理論碎片。
          已發現 <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{discovered}</span> / {total} 個碎片。
        </p>
      </div>

      {/* ── Modules ── */}
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px 60px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {moduleIds.map((moduleId) => {
          const meta = MODULE_META[moduleId];
          const frags = byModule.get(moduleId) ?? [];
          const collectedCount = frags.filter((f) => discoveredFragments.includes(f.id)).length;

          return (
            <section key={moduleId}>
              {/* Module header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
                paddingBottom: 10,
                borderBottom: `2px solid ${meta.color}44`,
              }}>
                <span style={{ fontSize: 22 }}>{meta.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-pixel), monospace',
                    fontSize: 11,
                    color: meta.color,
                    letterSpacing: 2,
                    margin: '0 0 4px',
                  }}>
                    MODULE {moduleId}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body), sans-serif',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    {meta.name}
                  </p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: 9,
                  color: collectedCount === frags.length ? meta.color : 'rgba(245,240,232,0.3)',
                  letterSpacing: 1,
                }}>
                  {collectedCount} / {frags.length}
                  {collectedCount === frags.length && ' ✓'}
                </span>
              </div>

              {/* Fragment cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {frags.map((frag) => {
                  const collected = discoveredFragments.includes(frag.id);
                  return (
                    <div
                      key={frag.id}
                      style={{
                        background: collected ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.02)',
                        boxShadow: collected
                          ? `0 -3px 0 0 ${meta.color}, 3px 0 0 0 ${meta.color}, 0 3px 0 0 ${meta.color}, -3px 0 0 0 ${meta.color}`
                          : '0 -3px 0 0 #2D3748, 3px 0 0 0 #2D3748, 0 3px 0 0 #2D3748, -3px 0 0 0 #2D3748',
                        padding: '16px 18px',
                        filter: collected ? 'none' : 'grayscale(1)',
                        opacity: collected ? 1 : 0.5,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {collected ? (
                        <>
                          {/* Collected state */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <span style={{ fontSize: 28 }}>{frag.emoji}</span>
                            <h3 style={{
                              fontFamily: 'var(--font-pixel), monospace',
                              fontSize: 14,
                              color: meta.color,
                              margin: 0,
                              letterSpacing: 1,
                              lineHeight: 1.4,
                            }}>
                              {frag.title}
                            </h3>
                          </div>
                          <p style={{
                            fontFamily: 'var(--font-body), sans-serif',
                            fontSize: 12,
                            color: 'var(--text-primary)',
                            opacity: 0.8,
                            margin: 0,
                            lineHeight: 1.65,
                          }}>
                            {frag.content}
                          </p>
                        </>
                      ) : (
                        <>
                          {/* Locked state */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ fontSize: 28, opacity: 0.3 }}>🔒</span>
                            <h3 style={{
                              fontFamily: 'var(--font-pixel), monospace',
                              fontSize: 10,
                              color: '#4A5568',
                              margin: 0,
                              letterSpacing: 1,
                            }}>
                              ???
                            </h3>
                          </div>
                          <p style={{
                            fontFamily: 'var(--font-pixel), monospace',
                            fontSize: 8,
                            color: '#4A5568',
                            margin: 0,
                            letterSpacing: 1,
                          }}>
                            前往地圖探索以解鎖
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

'use client';

import PixelBox from '@/components/ui/PixelBox';
import XPBar from '@/components/ui/XPBar';
import LuluDialogue from '@/components/lulu/LuluDialogue';

const SECTION: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-pixel), monospace',
  fontSize: '10px',
  color: 'var(--accent-blue)',
  letterSpacing: '3px',
  margin: 0,
};

const LULU_CASES: { mood: 'normal' | 'excited' | 'thinking' | 'challenge'; message: string }[] = [
  { mood: 'normal',    message: '管理是一門關於人的學問，每個決策背後都藏著假設。' },
  { mood: 'excited',   message: '你解鎖了「框架效應」！損失 100 元的痛苦是賺 100 元快樂的兩倍！！' },
  { mood: 'thinking',  message: '嗯……如果今天是你的最後一天，你會做同樣的決定嗎？' },
  { mood: 'challenge', message: '警告：前方是 Boss 關卡。你確定準備好了嗎？' },
];

export default function TestPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      {/* Page title */}
      <h1
        style={{
          fontFamily: 'var(--font-pixel), monospace',
          fontSize: '12px',
          color: 'var(--accent-gold)',
          letterSpacing: '3px',
          margin: 0,
        }}
      >
        COMPONENT TEST PAGE
      </h1>

      {/* ── PixelBox variants ── */}
      <section style={SECTION}>
        <p style={LABEL}>PIXEL BOX — 3 VARIANTS</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '32px',
          }}
        >
          {(['default', 'gold', 'blue'] as const).map((variant) => (
            <PixelBox key={variant} variant={variant}>
              <p
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '9px',
                  color: 'var(--text-primary)',
                  margin: '0 0 6px',
                  letterSpacing: '1px',
                }}
              >
                {variant.toUpperCase()}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  opacity: 0.7,
                  margin: 0,
                }}
              >
                4px 階梯像素邊框
              </p>
            </PixelBox>
          ))}
        </div>
      </section>

      {/* ── XPBar ── */}
      <section style={SECTION}>
        <p style={LABEL}>XP BAR</p>
        <XPBar currentXP={350} maxXP={500} level={3} title="分析師" />
      </section>

      {/* ── LuluDialogue × 4 moods ── */}
      <section style={SECTION}>
        <p style={LABEL}>LULU DIALOGUE — 4 MOODS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {LULU_CASES.map(({ mood, message }) => (
            <div key={mood}>
              <p
                style={{
                  fontFamily: 'var(--font-pixel), monospace',
                  fontSize: '9px',
                  color: 'var(--text-primary)',
                  opacity: 0.4,
                  margin: '0 0 8px',
                  letterSpacing: '2px',
                }}
              >
                mood: {mood}
              </p>
              <LuluDialogue message={message} mood={mood} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { ITEMS } from '@/data/map/items';

interface HUDProps {
  inventory: string[];
  xpBoost: number;
  fragmentCount: number;
}

export default function HUD({ inventory, xpBoost, fragmentCount }: HUDProps) {
  const router = useRouter();
  const hotbar = inventory.slice(0, 4);

  return (
    <div style={{
      flexShrink: 0, height: 56,
      background: 'rgba(13,27,42,0.9)',
      borderBottom: '3px solid var(--accent-red)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 16, zIndex: 50,
    }}>
      {/* Back to dashboard */}
      <button
        onClick={() => router.push('/dashboard')}
        style={{
          fontFamily: 'var(--font-pixel), monospace', fontSize: 10,
          color: 'var(--text-primary)', opacity: 0.55,
          background: 'none', border: 'none',
          padding: 0, cursor: 'pointer', letterSpacing: 1, flexShrink: 0,
        }}
      >
        ← 返回學院
      </button>

      {/* Inventory hotbar */}
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: 4 }, (_, i) => {
          const itemId = hotbar[i];
          const item = itemId ? ITEMS[itemId] : null;
          return (
            <div key={i} title={item?.name} style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.06)',
              border: '2px solid ' + (item ? '#FFD700' : '#2D3748'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {item?.emoji ?? ''}
            </div>
          );
        })}
      </div>

      {/* XP Boost indicator */}
      {xpBoost > 1 && (
        <div style={{
          fontFamily: 'var(--font-pixel), monospace', fontSize: 8,
          color: '#FFD700', letterSpacing: 1,
          background: 'rgba(255,215,0,0.1)',
          border: '1px solid #FFD700',
          padding: '4px 8px',
        }}>
          ⚡ XP ×{xpBoost}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Fragment counter */}
      <div style={{
        fontFamily: 'var(--font-pixel), monospace', fontSize: 8,
        color: '#FFF176', letterSpacing: 1, opacity: 0.85,
      }}>
        📖 {fragmentCount}/12
      </div>
    </div>
  );
}

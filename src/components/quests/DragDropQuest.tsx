'use client';

import { useRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

export interface DragItem {
  id: string;
  label: string;
}

export interface DropZone {
  id: string;
  label: string;
  /** ID of the item that belongs here */
  acceptsId: string;
}

export interface DragDropQuestProps {
  instruction: string;
  items: DragItem[];
  zones: DropZone[];
  xpReward: number;
  onComplete: (xp: number) => void;
}

type Placement = Record<string, string>; // itemId → zoneId

export default function DragDropQuest({
  instruction,
  items,
  zones,
  xpReward,
  onComplete,
}: DragDropQuestProps) {
  // itemId → zoneId that it has been placed into
  const [placement, setPlacement] = useState<Placement>({});
  // zoneId currently being hovered during a drag
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const placedItems = new Set(Object.keys(placement));
  // items still in the source tray
  const sourceItems = items.filter((it) => !placedItems.has(it.id));

  function findZoneUnderPointer(point: { x: number; y: number }): string | null {
    for (const zone of zones) {
      const el = zoneRefs.current[zone.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
      ) {
        return zone.id;
      }
    }
    return null;
  }

  function handleDrag(_: unknown, info: PanInfo, itemId: string) {
    const zoneId = findZoneUnderPointer(info.point);
    setHoveredZone(zoneId !== placement[itemId] ? zoneId : null);
  }

  function handleDragEnd(_: unknown, info: PanInfo, itemId: string) {
    setHoveredZone(null);
    const zoneId = findZoneUnderPointer(info.point);
    if (!zoneId) return; // snap back (dragSnapToOrigin)

    // Remove item from any previous zone
    const next: Placement = {};
    for (const [k, v] of Object.entries(placement)) {
      if (k !== itemId && v !== zoneId) next[k] = v;
    }
    next[itemId] = zoneId;
    setPlacement(next);

    // Check completion
    const allCorrect = zones.every((z) => {
      const placed = Object.entries(next).find(([, v]) => v === z.id);
      return placed && placed[0] === z.acceptsId;
    });
    const allFilled = zones.every((z) =>
      Object.values(next).includes(z.id)
    );

    if (allFilled && allCorrect) {
      setDone(true);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1400);
    }
  }

  function removeFromZone(itemId: string) {
    if (done) return;
    setPlacement((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Instruction */}
      <div style={{ background: 'var(--bg-secondary)', padding: '16px', boxShadow: pixelShadow('#4A5568') }}>
        <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
          {instruction}
        </p>
      </div>

      {/* Source tray */}
      <div>
        <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: 'var(--accent-blue)', letterSpacing: '2px', margin: '0 0 10px' }}>
          拖曳到右側對應的區域
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '48px', padding: '12px', background: 'var(--bg-secondary)', boxShadow: pixelShadow('#4A5568') }}>
          {sourceItems.length === 0 && (
            <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--text-primary)', opacity: 0.3 }}>
              所有項目已放置
            </span>
          )}
          {sourceItems.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragSnapToOrigin
              onDrag={(e, info) => handleDrag(e, info, item.id)}
              onDragEnd={(e, info) => handleDragEnd(e, info, item.id)}
              whileDrag={{ scale: 1.08, zIndex: 50, cursor: 'grabbing' }}
              style={{
                fontFamily: 'var(--font-body), sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0D1B2A',
                background: 'var(--accent-blue)',
                padding: '8px 14px',
                cursor: 'grab',
                userSelect: 'none',
                boxShadow: `4px 4px 0 0 rgba(0,0,0,0.5)`,
                touchAction: 'none',
              }}
            >
              {item.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drop zones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {zones.map((zone) => {
          const placedEntry = Object.entries(placement).find(([, v]) => v === zone.id);
          const placedItem = placedEntry ? items.find((it) => it.id === placedEntry[0]) : null;
          const isHovered = hoveredZone === zone.id;
          const isCorrect = done && placedItem?.id === zone.acceptsId;
          const isWrong = placedItem && !done && placedItem.id !== zone.acceptsId;

          const borderColor = isCorrect
            ? 'var(--accent-green)'
            : isWrong
            ? 'var(--accent-red)'
            : isHovered
            ? 'var(--accent-gold)'
            : '#4A5568';

          return (
            <div
              key={zone.id}
              ref={(el) => { zoneRefs.current[zone.id] = el; }}
              style={{
                minHeight: '80px',
                background: isHovered ? 'rgba(255,215,0,0.08)' : 'var(--bg-secondary)',
                boxShadow: pixelShadow(borderColor),
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'box-shadow 0.15s ease, background 0.15s ease',
              }}
            >
              <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: borderColor, letterSpacing: '1px' }}>
                {zone.label}
              </span>
              {placedItem && (
                <div
                  onClick={() => removeFromZone(placedItem.id)}
                  style={{
                    fontFamily: 'var(--font-body), sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0D1B2A',
                    background: isCorrect ? 'var(--accent-green)' : isWrong ? 'var(--accent-red)' : 'var(--accent-blue)',
                    padding: '6px 12px',
                    cursor: done ? 'default' : 'pointer',
                    display: 'inline-block',
                    boxShadow: '2px 2px 0 0 rgba(0,0,0,0.4)',
                    transition: 'background 0.2s ease',
                  }}
                  title={done ? '' : '點擊取消放置'}
                >
                  {placedItem.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* XP popup + completion */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {showXP && (
            <motion.div
              key="xp"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -40 }}
              transition={{ duration: 1.2 }}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '16px',
                color: 'var(--accent-gold)',
                pointerEvents: 'none',
                textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
              }}
            >
              +{xpReward} XP
            </motion.div>
          )}
        </AnimatePresence>

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}
          >
            <button
              onClick={() => onComplete(xpReward)}
              style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '10px',
                color: '#0D1B2A',
                background: 'var(--accent-green)',
                border: 'none',
                padding: '12px 24px',
                cursor: 'pointer',
                letterSpacing: '2px',
                boxShadow: `4px 4px 0 0 rgba(0,0,0,0.5)`,
              }}
            >
              ✓ 全部正確！繼續 ▶
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function pixelShadow(color: string): string {
  return [
    `0 -4px 0 0 ${color}`, `4px 0 0 0 ${color}`,
    `0 4px 0 0 ${color}`,  `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`, `4px 4px 0 0 ${color}`,
    `-4px 4px 0 0 ${color}`, `-4px -4px 0 0 ${color}`,
  ].join(', ');
}

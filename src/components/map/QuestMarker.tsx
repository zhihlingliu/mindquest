'use client';

import { motion } from 'framer-motion';

export type MarkerType = 'module' | 'npc' | 'fragment' | 'lock';

interface Props {
  col: number;
  row: number;
  tileSize: number;
  type: MarkerType;
  color?: string;
  pulse?: boolean;
}

const TYPE_META: Record<MarkerType, { icon: string; defaultColor: string; glowColor: string }> = {
  module:   { icon: '❗', defaultColor: '#FFD700', glowColor: 'rgba(255,215,0,0.6)' },
  npc:      { icon: '💬', defaultColor: '#29B6F6', glowColor: 'rgba(41,182,246,0.6)' },
  fragment: { icon: '✨', defaultColor: '#FFF176', glowColor: 'rgba(255,241,118,0.5)' },
  lock:     { icon: '🔒', defaultColor: '#4A5568', glowColor: 'rgba(74,85,104,0.4)' },
};

export default function QuestMarker({ col, row, tileSize, type, color, pulse = false }: Props) {
  const meta = TYPE_META[type];
  const activeColor = color ?? meta.defaultColor;

  return (
    <div
      style={{
        position: 'absolute',
        left: col * tileSize,
        top: row * tileSize - 22,
        width: tileSize,
        height: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 1.6,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
        style={{
          fontSize: 16,
          lineHeight: 1,
          filter: pulse
            ? `drop-shadow(0 0 6px ${activeColor}) drop-shadow(0 0 3px ${meta.glowColor})`
            : `drop-shadow(0 0 4px ${meta.glowColor})`,
        }}
      >
        {meta.icon}
      </motion.div>
    </div>
  );
}

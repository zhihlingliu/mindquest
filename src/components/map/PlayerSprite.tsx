'use client';

import type { Direction } from '@/hooks/useGameMap';

interface PlayerSpriteProps {
  facing: Direction;
  walking: boolean;
  step: number; // 0 or 1
  size?: number;
}

// ── CSS pixel art character (top-down view) ────────────────────────────────
// Each layer is a div positioned absolutely within a 32×32 container.
// Colors:
//   skin: #F5C8A0   hair: #3D2B1F   shirt: #2962FF   pants: #1A237E
//   shoes: #1B1B1B  eyes: #1B1B1B   outline: shadow trick

const SKIN   = '#F5C8A0';
const HAIR   = '#3D2B1F';
const SHIRT  = '#2962FF';
const PANTS  = '#1A237E';
const SHOES  = '#1B1B1B';
const EYES   = '#1B1B1B';

// Walk bob: legs alternate each step
function legOffset(side: 'left' | 'right', step: number): number {
  if (side === 'left')  return step === 0 ?  2 : -2;
  return step === 0 ? -2 : 2;
}

export default function PlayerSprite({ facing, walking, step, size = 32 }: PlayerSpriteProps) {
  const s = size / 32; // scale factor

  // Shadow under player
  const shadow = (
    <div style={{
      position: 'absolute',
      bottom: -4 * s,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 24 * s,
      height: 6 * s,
      background: 'rgba(0,0,0,0.35)',
      borderRadius: '50%',
    }} />
  );

  if (facing === 'down') {
    return (
      <div style={{ position: 'relative', width: 32 * s, height: 36 * s }}>
        {shadow}
        {/* Hair / head top */}
        <div style={{ position: 'absolute', top: 0, left: 6*s, width: 20*s, height: 8*s, background: HAIR }} />
        {/* Head */}
        <div style={{ position: 'absolute', top: 4*s, left: 8*s, width: 16*s, height: 12*s, background: SKIN }} />
        {/* Eyes */}
        <div style={{ position: 'absolute', top: 9*s, left: 11*s, width: 3*s, height: 3*s, background: EYES }} />
        <div style={{ position: 'absolute', top: 9*s, left: 18*s, width: 3*s, height: 3*s, background: EYES }} />
        {/* Body */}
        <div style={{ position: 'absolute', top: 16*s, left: 8*s, width: 16*s, height: 10*s, background: SHIRT }} />
        {/* Arms */}
        <div style={{ position: 'absolute', top: 16*s, left: 4*s, width: 4*s, height: 9*s, background: SHIRT }} />
        <div style={{ position: 'absolute', top: 16*s, left: 24*s, width: 4*s, height: 9*s, background: SHIRT }} />
        {/* Pants */}
        <div style={{ position: 'absolute', top: 26*s, left: 8*s, width: 6*s, height: 6*s, background: PANTS,
          transform: walking ? `translateY(${legOffset('left', step)}px)` : undefined }} />
        <div style={{ position: 'absolute', top: 26*s, left: 18*s, width: 6*s, height: 6*s, background: PANTS,
          transform: walking ? `translateY(${legOffset('right', step)}px)` : undefined }} />
        {/* Shoes */}
        <div style={{ position: 'absolute', top: 32*s, left: 8*s, width: 6*s, height: 4*s, background: SHOES,
          transform: walking ? `translateY(${legOffset('left', step)}px)` : undefined }} />
        <div style={{ position: 'absolute', top: 32*s, left: 18*s, width: 6*s, height: 4*s, background: SHOES,
          transform: walking ? `translateY(${legOffset('right', step)}px)` : undefined }} />
      </div>
    );
  }

  if (facing === 'up') {
    return (
      <div style={{ position: 'relative', width: 32 * s, height: 36 * s }}>
        {shadow}
        {/* Back of head */}
        <div style={{ position: 'absolute', top: 0, left: 6*s, width: 20*s, height: 16*s, background: HAIR }} />
        {/* Body */}
        <div style={{ position: 'absolute', top: 16*s, left: 8*s, width: 16*s, height: 10*s, background: SHIRT }} />
        {/* Arms */}
        <div style={{ position: 'absolute', top: 16*s, left: 4*s, width: 4*s, height: 9*s, background: SHIRT }} />
        <div style={{ position: 'absolute', top: 16*s, left: 24*s, width: 4*s, height: 9*s, background: SHIRT }} />
        {/* Pants */}
        <div style={{ position: 'absolute', top: 26*s, left: 8*s, width: 6*s, height: 6*s, background: PANTS,
          transform: walking ? `translateY(${legOffset('left', step)}px)` : undefined }} />
        <div style={{ position: 'absolute', top: 26*s, left: 18*s, width: 6*s, height: 6*s, background: PANTS,
          transform: walking ? `translateY(${legOffset('right', step)}px)` : undefined }} />
        {/* Shoes */}
        <div style={{ position: 'absolute', top: 32*s, left: 8*s, width: 6*s, height: 4*s, background: SHOES,
          transform: walking ? `translateY(${legOffset('left', step)}px)` : undefined }} />
        <div style={{ position: 'absolute', top: 32*s, left: 18*s, width: 6*s, height: 4*s, background: SHOES,
          transform: walking ? `translateY(${legOffset('right', step)}px)` : undefined }} />
      </div>
    );
  }

  // Left / Right (mirror with scaleX)
  const scaleX = facing === 'left' ? -1 : 1;
  return (
    <div style={{ position: 'relative', width: 32 * s, height: 36 * s, transform: `scaleX(${scaleX})` }}>
      {shadow}
      {/* Head */}
      <div style={{ position: 'absolute', top: 0, left: 6*s, width: 20*s, height: 8*s, background: HAIR }} />
      <div style={{ position: 'absolute', top: 4*s, left: 6*s, width: 18*s, height: 12*s, background: SKIN }} />
      {/* Eye (only one visible from side) */}
      <div style={{ position: 'absolute', top: 9*s, left: 20*s, width: 3*s, height: 3*s, background: EYES }} />
      {/* Body */}
      <div style={{ position: 'absolute', top: 16*s, left: 8*s, width: 16*s, height: 10*s, background: SHIRT }} />
      {/* Front arm */}
      <div style={{ position: 'absolute', top: 16*s, left: 22*s, width: 4*s, height: 9*s, background: SHIRT,
        transform: walking ? `translateY(${legOffset('right', step) * 0.6}px)` : undefined }} />
      {/* Pants */}
      <div style={{ position: 'absolute', top: 26*s, left: 9*s, width: 6*s, height: 6*s, background: PANTS,
        transform: walking ? `translateY(${legOffset('left', step)}px)` : undefined }} />
      <div style={{ position: 'absolute', top: 26*s, left: 16*s, width: 6*s, height: 6*s, background: PANTS,
        transform: walking ? `translateY(${legOffset('right', step)}px)` : undefined }} />
      {/* Shoes */}
      <div style={{ position: 'absolute', top: 32*s, left: 9*s, width: 6*s, height: 4*s, background: SHOES,
        transform: walking ? `translateY(${legOffset('left', step)}px)` : undefined }} />
      <div style={{ position: 'absolute', top: 32*s, left: 16*s, width: 6*s, height: 4*s, background: SHOES,
        transform: walking ? `translateY(${legOffset('right', step)}px)` : undefined }} />
    </div>
  );
}

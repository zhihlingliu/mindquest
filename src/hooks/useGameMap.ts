'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { isTileWalkable } from '@/data/map/worldMap';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PlayerPos {
  col: number;
  row: number;
}

const KEY_DIR: Record<string, Direction> = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

const DIR_DELTA: Record<Direction, { dc: number; dr: number }> = {
  up:    { dc:  0, dr: -1 },
  down:  { dc:  0, dr:  1 },
  left:  { dc: -1, dr:  0 },
  right: { dc:  1, dr:  0 },
};

interface UseGameMapOptions {
  startCol?: number;
  startRow?: number;
  moveIntervalMs?: number;
  onStep?: (col: number, row: number) => void;
  disabled?: boolean;
  isBlocked?: (col: number, row: number) => boolean;
}

export function useGameMap({
  startCol = 11,
  startRow = 5,
  moveIntervalMs = 160,
  onStep,
  disabled = false,
  isBlocked,
}: UseGameMapOptions = {}) {
  const [pos, setPos] = useState<PlayerPos>({ col: startCol, row: startRow });
  const [facing, setFacing] = useState<Direction>('down');
  const [walking, setWalking] = useState(false);
  const [step, setStep] = useState(0); // toggles 0/1 for walk frame

  const heldKeys = useRef<Set<string>>(new Set());
  const posRef = useRef<PlayerPos>({ col: startCol, row: startRow });
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;
  const isBlockedRef = useRef(isBlocked);
  isBlockedRef.current = isBlocked;
  // Always-current ref for disabled — avoids stale closure in interval/listeners
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  // Sync posRef with state
  useEffect(() => { posRef.current = pos; }, [pos]);

  // Clear held keys when map becomes disabled so movement stops immediately
  useEffect(() => {
    if (disabled) {
      heldKeys.current.clear();
      setWalking(false);
    }
  }, [disabled]);

  // Movement loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (disabledRef.current) { setWalking(false); return; }
      const keys = heldKeys.current;
      if (keys.size === 0) {
        setWalking(false);
        return;
      }

      // Pick first held direction
      let dir: Direction | null = null;
      for (const k of keys) {
        if (KEY_DIR[k]) { dir = KEY_DIR[k]; break; }
      }
      if (!dir) { setWalking(false); return; }

      const { dc, dr } = DIR_DELTA[dir];
      const { col, row } = posRef.current;
      const nc = col + dc;
      const nr = row + dr;

      setFacing(dir);
      if (isTileWalkable(nc, nr) && !isBlockedRef.current?.(nc, nr)) {
        setPos({ col: nc, row: nr });
        setStep((s) => (s + 1) % 2);
        setWalking(true);
        onStepRef.current?.(nc, nr);
      } else {
        setWalking(false);
      }
    }, moveIntervalMs);

    return () => clearInterval(interval);
  }, [moveIntervalMs]);

  // Key listeners (attach to window, not element, so map doesn't need focus)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (disabledRef.current) return;
      if (KEY_DIR[e.key]) {
        e.preventDefault();
        heldKeys.current.add(e.key);
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      heldKeys.current.delete(e.key);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // D-pad press (mobile / click)
  const pressDir = useCallback((dir: Direction) => {
    heldKeys.current.add(dir === 'up' ? 'w' : dir === 'down' ? 's' : dir === 'left' ? 'a' : 'd');
  }, []);
  const releaseDir = useCallback((dir: Direction) => {
    heldKeys.current.delete(dir === 'up' ? 'w' : dir === 'down' ? 's' : dir === 'left' ? 'a' : 'd');
  }, []);

  return { pos, facing, walking, step, pressDir, releaseDir };
}

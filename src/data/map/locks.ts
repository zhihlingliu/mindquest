// ── Region Locks ──────────────────────────────────────────────────────────
// Areas of the map that are gated behind module completion.
// A region is locked when the player has not completed the required modules.

export interface RegionLock {
  id: string;
  label: string;
  description: string;          // shown when player tries to enter
  // Rectangular boundary (inclusive, in tile coords)
  colMin: number;
  colMax: number;
  rowMin: number;
  rowMax: number;
  requiredModules: number[];    // all must be completed to unlock
  accentColor: string;
  emoji: string;
}

export const REGION_LOCKS: RegionLock[] = [
  {
    id: 'lock_central',
    label: '中央禁區',
    description: '完成「認知迷霧」模組後，前往決策峰頂的道路將會開啟。',
    colMin: 8,
    colMax: 13,
    rowMin: 3,
    rowMax: 8,
    requiredModules: [1],
    accentColor: '#FFD700',
    emoji: '🔒',
  },
  {
    id: 'lock_east',
    label: '東部高地',
    description: '需完成「認知迷霧」與「決策峰頂」兩個模組，才能進入東部影響力廊。',
    colMin: 14,
    colMax: 20,
    rowMin: 3,
    rowMax: 8,
    requiredModules: [1, 2],
    accentColor: '#4CAF50',
    emoji: '🚧',
  },
  {
    id: 'lock_south',
    label: '南方迷宮',
    description: '完成前三個模組後，南方組織迷宮、群體引力、策略高地的入口將全面解鎖。',
    colMin: 1,
    colMax: 20,
    rowMin: 9,
    rowMax: 12,
    requiredModules: [1, 2, 3],
    accentColor: '#FF6B6B',
    emoji: '⛔',
  },
];

// ── World map tile data ────────────────────────────────────────────────────
// Tile types:
//   0 = deep water   (impassable)
//   1 = water        (impassable)
//   2 = grass        (walkable)
//   3 = dark grass   (walkable)
//   4 = path/stone   (walkable)
//   5 = tree         (impassable)
//   6 = mountain     (impassable)
//   7 = sand         (walkable)
//   8 = stone floor  (walkable)

export const TILE_SIZE = 64; // px per tile
export const MAP_COLS = 26;
export const MAP_ROWS = 15;

export const TILE_COLORS: Record<number, string> = {
  0: '#0A2744',  // deep water
  1: '#1A3A5C',  // water
  2: '#2D5A1B',  // grass
  3: '#1E3D12',  // dark grass
  4: '#8B7355',  // path
  5: '#1A3D0A',  // tree (dark, usually overlaid with emoji)
  6: '#3D3230',  // mountain
  7: '#C4A35A',  // sand
  8: '#4A4A5A',  // stone floor
};

// 0=deepwater 1=water 2=grass 3=darkgrass 4=path 5=tree 6=mountain 7=sand 8=stone
export const WORLD_MAP: number[][] = [
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,5,5,2,2,2,2,5,5,2,2,2,2,5,5,2,2,2,5,5,5,6,6,6,6,6],
  [6,5,2,2,4,4,2,2,5,2,4,4,2,2,5,2,4,2,2,5,2,6,2,6,2,6],
  [6,2,2,4,4,4,4,2,2,4,4,4,4,2,2,4,4,4,2,2,2,6,2,6,2,6],
  [6,2,4,4,8,8,4,4,2,4,8,8,4,4,2,4,8,4,4,2,2,6,2,6,2,6],
  [6,2,4,8,8,8,8,4,4,4,8,8,8,4,4,4,8,8,4,2,2,6,2,6,2,6],
  [6,2,4,8,8,8,8,4,4,4,8,8,8,4,4,4,8,8,4,2,5,6,5,6,5,6],
  [6,2,4,4,8,8,4,4,2,4,8,8,4,4,2,4,8,4,4,2,5,6,5,6,5,6],
  [6,2,2,4,4,4,4,2,2,4,4,4,4,2,2,4,4,4,2,2,2,6,2,6,2,6],
  [6,5,2,2,4,4,2,2,5,2,4,4,2,2,5,2,4,2,2,5,2,6,2,6,2,6],
  [6,5,5,2,2,2,2,5,5,2,2,2,2,5,5,2,2,2,5,5,5,6,5,6,5,6],
  [6,2,2,2,2,7,7,7,7,7,7,2,2,2,2,7,7,7,7,2,2,6,2,6,2,6],
  [6,2,5,5,7,7,0,0,0,0,7,7,5,5,7,7,0,0,7,5,2,6,2,6,2,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
];

// ── Walkable check ─────────────────────────────────────────────────────────

const WALKABLE_TILES = new Set([2, 3, 4, 7, 8]);

export function isTileWalkable(col: number, row: number): boolean {
  if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return false;
  return WALKABLE_TILES.has(WORLD_MAP[row][col]);
}

// ── Entity types ──────────────────────────────────────────────────────────

export interface ItemEntity {
  kind: 'item';
  id: string;       // unique instance id
  itemId: string;   // references ITEMS key
  col: number;
  row: number;
}

export interface ModulePortal {
  kind: 'portal';
  moduleId: number;
  label: string;
  col: number;
  row: number;
  accentColor: string;
  emoji: string;
}

export interface NPC {
  kind: 'npc';
  id: string;
  name: string;
  emoji: string;
  col: number;
  row: number;
  dialogue: string;        // kept for backward compat with GameMap.tsx
  dialogues: string[];     // full multi-line dialogue sequence
  requiredModule?: number; // only visible when this module is completed
  givesFragment?: string;  // fragmentId granted after talking
}

export type MapEntity = ItemEntity | ModulePortal | NPC;

// ── Static entity layout ──────────────────────────────────────────────────

export const STATIC_ENTITIES: MapEntity[] = [
  // ── Module portals ──
  // M1 & M2 are in the open western area (col < 8) — accessible from the start
  { kind: 'portal', moduleId: 1, label: '認知迷霧', col: 4,  row: 5,  accentColor: '#29B6F6', emoji: '🧠' },
  { kind: 'portal', moduleId: 2, label: '決策峰頂', col: 6,  row: 5,  accentColor: '#FFD700', emoji: '⚖️' },
  // M3 & M4 are inside lock_central (cols 8-13) — unlocked after M1; diagonally spread
  { kind: 'portal', moduleId: 3, label: '影響力廊', col: 10, row: 4,  accentColor: '#4CAF50', emoji: '🌐' },
  { kind: 'portal', moduleId: 4, label: '群體引力', col: 12, row: 6,  accentColor: '#C084FC', emoji: '🔥' },
  // M5 & M6 are inside lock_east (cols 14-20) — unlocked after M1+M2; diagonally spread
  { kind: 'portal', moduleId: 5, label: '策略高地', col: 16, row: 4,  accentColor: '#FF9800', emoji: '🗺️' },
  { kind: 'portal', moduleId: 6, label: '組織迷宮', col: 17, row: 6,  accentColor: '#FF6B6B', emoji: '🏛️' },

  // ── NPCs ────────────────────────────────────────────────────────────────

  // Lulu — central guide (col 5 row 7: below the portal room, not adjacent to any portal)
  {
    kind: 'npc', id: 'lulu', name: 'Lulu', emoji: '🦊', col: 5, row: 7,
    dialogue: '歡迎來到 Cognitia 大陸！地圖上的光門是各個知識模組的入口。記得先收集道具再去挑戰 Boss！',
    dialogues: [
      '歡迎來到 Cognitia 大陸！我是你的嚮導 Lulu 🦊',
      '地圖上六扇光門通往不同的知識試煉。每個模組都有故事、任務、模擬和最終 Boss！',
      '記得先好好熟悉地圖上的每個區域——每一個都是不同的管理挑戰。',
    ],
  },
];

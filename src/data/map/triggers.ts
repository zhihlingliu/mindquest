// ── Event Triggers ────────────────────────────────────────────────────────
// Area-based events that fire when the player steps within radius tiles
// of the trigger's (col, row) center.

export type TriggerType =
  | 'fragment-hint'    // hint popup pointing toward a nearby fragment
  | 'encounter-start'  // start a MiniEncounter
  | 'lore-popup'       // show a lore / world-building message
  | 'unlock-hint';     // tell the player what they need to unlock a region

export interface EventTrigger {
  id: string;
  col: number;
  row: number;
  radius: number;          // tiles — trigger fires when player ≤ radius away
  type: TriggerType;
  targetId: string;        // fragmentId / encounterId / regionLockId / lore key
  requiredModules?: number[];  // only active when all listed modules are complete
  message?: string;        // override display text (optional)
}

export const EVENT_TRIGGERS: EventTrigger[] = [
  // ── Fragment hints ──────────────────────────────────────────────────────
  {
    id: 'trig_hint_m1a',
    col: 3,
    row: 4,
    radius: 2,
    type: 'fragment-hint',
    targetId: 'frag_m1_a',
    message: '附近有認知碎片的氣息……往西走一格。',
  },
  {
    id: 'trig_hint_m1b',
    col: 7,
    row: 3,
    radius: 2,
    type: 'fragment-hint',
    targetId: 'frag_m1_b',
    message: '空氣中飄著資訊的殘影……注意力碎片就在附近。',
  },
  {
    id: 'trig_hint_m3a',
    col: 16,
    row: 3,
    radius: 2,
    type: 'fragment-hint',
    targetId: 'frag_m3_a',
    message: '影響力的迴響……Cialdini 的智慧就在這片廊道中。',
    requiredModules: [1, 2],
  },

  // ── Encounter triggers ──────────────────────────────────────────────────
  {
    id: 'trig_enc_fog',
    col: 5,
    row: 4,
    radius: 1,
    type: 'encounter-start',
    targetId: 'enc_fog_patrol',
  },
  {
    id: 'trig_enc_anchor',
    col: 11,
    row: 3,
    radius: 1,
    type: 'encounter-start',
    targetId: 'enc_anchor_trap',
    requiredModules: [1],
  },
  {
    id: 'trig_enc_framing',
    col: 13,
    row: 4,
    radius: 1,
    type: 'encounter-start',
    targetId: 'enc_framing_duel',
    requiredModules: [1],
  },
  {
    id: 'trig_enc_shadow',
    col: 5,
    row: 7,
    radius: 1,
    type: 'encounter-start',
    targetId: 'enc_shadow_org',
    requiredModules: [1, 2, 3],
  },
  {
    id: 'trig_enc_motivation',
    col: 13,
    row: 7,
    radius: 1,
    type: 'encounter-start',
    targetId: 'enc_motivation_crisis',
    requiredModules: [1, 2, 3],
  },

  // ── Lore popups ─────────────────────────────────────────────────────────
  {
    id: 'trig_lore_welcome',
    col: 11,
    row: 5,
    radius: 2,
    type: 'lore-popup',
    targetId: 'lore_cognitia_center',
    message:
      '你站在 Cognitia 大陸的中心廣場。六扇知識之門環繞四周——每一扇都通往一段管理智慧的試煉。',
  },
  {
    id: 'trig_lore_south_gate',
    col: 10,
    row: 8,
    radius: 1,
    type: 'lore-popup',
    targetId: 'lore_south_gate',
    requiredModules: [1, 2, 3],
    message:
      '深處的封印已解。群體引力、策略高地、組織迷宮在等待你的到來。',
  },

  // ── Unlock hints ────────────────────────────────────────────────────────
  {
    id: 'trig_unlock_east',
    col: 13,
    row: 5,
    radius: 1,
    type: 'unlock-hint',
    targetId: 'lock_east',
    message: '東部高地仍被霧氣封鎖。完成「認知迷霧」與「決策峰頂」後，道路將會顯現。',
  },
];

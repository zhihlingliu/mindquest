// ── Item definitions for the RPG world map ─────────────────────────────────

export type ItemEffect =
  | { type: 'xp_boost';       value: number }   // multiply next quest XP reward
  | { type: 'reveal_answer';  value: number }   // highlight correct answer once
  | { type: 'reduce_boss';    value: number }   // reduce boss questions by N
  | { type: 'shield_penalty'; value: number }   // cancel retry XP penalty once
  | { type: 'boss_key';       value: string }   // unlock a locked boss module
  | { type: 'stat_boost';     stat: string; value: number }; // temporary stat +

export interface MapItem {
  id: string;
  emoji: string;
  name: string;
  nameZh: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
  effect: ItemEffect;
  accentColor: string;
}

export const ITEMS: Record<string, MapItem> = {
  knowledge_shard: {
    id: 'knowledge_shard',
    emoji: '📖',
    name: 'Knowledge Shard',
    nameZh: '知識碎片',
    description: '下一個任務的 XP 獎勵 ×1.5',
    rarity: 'common',
    effect: { type: 'xp_boost', value: 1.5 },
    accentColor: '#29B6F6',
  },
  insight_crystal: {
    id: 'insight_crystal',
    emoji: '🔮',
    name: 'Insight Crystal',
    nameZh: '洞察水晶',
    description: '選擇題時，可以高亮顯示正確答案一次',
    rarity: 'rare',
    effect: { type: 'reveal_answer', value: 1 },
    accentColor: '#C084FC',
  },
  focus_rune: {
    id: 'focus_rune',
    emoji: '⚡',
    name: 'Focus Rune',
    nameZh: '專注符文',
    description: 'Boss 戰減少 1 道題（最少保留 2 題）',
    rarity: 'rare',
    effect: { type: 'reduce_boss', value: 1 },
    accentColor: '#FFD700',
  },
  cognition_shield: {
    id: 'cognition_shield',
    emoji: '🛡️',
    name: 'Cognition Shield',
    nameZh: '認知護盾',
    description: 'Boss 戰答錯時，取消一次 XP 扣減懲罰',
    rarity: 'rare',
    effect: { type: 'shield_penalty', value: 1 },
    accentColor: '#4CAF50',
  },
  lulu_star: {
    id: 'lulu_star',
    emoji: '⭐',
    name: "Lulu's Star",
    nameZh: 'Lulu 星章',
    description: '解鎖 Module 9「第九模組：傳承」',
    rarity: 'legendary',
    effect: { type: 'boss_key', value: 'module9' },
    accentColor: '#FF6B6B',
  },
  wisdom_tome: {
    id: 'wisdom_tome',
    emoji: '📜',
    name: 'Wisdom Tome',
    nameZh: '智慧古卷',
    description: '下一個任務的 XP 獎勵 ×2.0',
    rarity: 'legendary',
    effect: { type: 'xp_boost', value: 2.0 },
    accentColor: '#FF9800',
  },
  decision_compass: {
    id: 'decision_compass',
    emoji: '🧭',
    name: 'Decision Compass',
    nameZh: '決策羅盤',
    description: '臨時提升 DECISION POWER +15',
    rarity: 'common',
    effect: { type: 'stat_boost', stat: 'decisionPower', value: 15 },
    accentColor: '#29B6F6',
  },
  social_amulet: {
    id: 'social_amulet',
    emoji: '🤝',
    name: 'Social Amulet',
    nameZh: '人脈護符',
    description: '臨時提升 SOCIAL CAPITAL +15',
    rarity: 'common',
    effect: { type: 'stat_boost', stat: 'socialCapital', value: 15 },
    accentColor: '#4CAF50',
  },
};

export type ItemId = keyof typeof ITEMS;

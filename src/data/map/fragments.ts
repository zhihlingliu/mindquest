// ── Theory Fragments ──────────────────────────────────────────────────────
// Collectible knowledge shards scattered across the world map.
// 2 fragments per module (12 total).
// Positions verified walkable against WORLD_MAP.

export interface TheoryFragment {
  id: string;
  moduleId: number;
  title: string;
  content: string;
  emoji: string;
  color: string;
  col: number;
  row: number;
}

export const THEORY_FRAGMENTS: TheoryFragment[] = [
  // ── Module 1: 認知迷霧  (portal: 4,5 — open area) ──────────────────────
  {
    id: 'frag_m1_a',
    moduleId: 1,
    title: '雙重歷程理論',
    content:
      'Kahneman 的 System 1 快速、直覺、自動化；System 2 緩慢、分析、耗能。' +
      '管理者在壓力下易被 System 1 劫持，產生系統性偏誤。',
    emoji: '🧠',
    color: '#29B6F6',
    col: 4,
    row: 4,  // directly above M1 portal
  },
  {
    id: 'frag_m1_b',
    moduleId: 1,
    title: '注意力稀缺',
    content:
      '決策品質與注意力餘量成正比。資訊過載使人倚賴捷思（heuristics），' +
      '導致錨定偏誤與代表性偏誤。保護認知頻寬是現代管理核心技能。',
    emoji: '⚡',
    color: '#29B6F6',
    col: 4,
    row: 6,  // directly below M1 portal
  },

  // ── Module 2: 決策峰頂  (portal: 6,5 — open area) ──────────────────────
  {
    id: 'frag_m2_a',
    moduleId: 2,
    title: '前景理論',
    content:
      'Kahneman & Tversky：人對損失的痛苦約為等量收益快樂的 2 倍。' +
      '框架效果（framing）使相同結果因呈現方式不同而產生截然不同的決策。',
    emoji: '⚖️',
    color: '#FFD700',
    col: 6,
    row: 4,  // directly above M2 portal
  },
  {
    id: 'frag_m2_b',
    moduleId: 2,
    title: '選擇悖論',
    content:
      'Barry Schwartz：選項越多，決策滿意度越低。' +
      'Maximizer 追求最優解，Satisficer 追求夠好——後者通常更快樂且更有效率。',
    emoji: '🔮',
    color: '#FFD700',
    col: 6,
    row: 6,  // directly below M2 portal
  },

  // ── Module 3: 影響力廊  (portal: 10,4 — inside lock_central) ───────────
  {
    id: 'frag_m3_a',
    moduleId: 3,
    title: 'Cialdini 六原則',
    content:
      '影響力六大武器：互惠、承諾與一致、社會認同、喜好、權威、稀缺。' +
      '理解原則讓你既能運用影響力，也能識別操縱。',
    emoji: '🌐',
    color: '#4CAF50',
    col: 10,
    row: 3,  // above M3 portal (path tile, inside lock_central)
  },
  {
    id: 'frag_m3_b',
    moduleId: 3,
    title: '框架與敘事',
    content:
      '相同政策用「節省 200 人」vs「犧牲 400 人」呈現，支持率差距逾 30%。' +
      '管理者掌握敘事框架等同掌握議程設定權。',
    emoji: '🎭',
    color: '#4CAF50',
    col: 11,
    row: 4,  // beside M3 portal (inside lock_central)
  },

  // ── Module 6: 組織迷宮  (portal: 17,6 — inside lock_east) ─────────────
  {
    id: 'frag_m4_a',
    moduleId: 6,
    title: '組織結構光譜',
    content:
      '從機械式（高正式化、集中化）到有機式（低正式化、分權），' +
      '最優結構取決於環境不確定性。Burns & Stalker 的情境理論奠定此框架。',
    emoji: '🏛️',
    color: '#FF6B6B',
    col: 12,
    row: 5,  // above M4 portal (inside lock_central)
  },
  {
    id: 'frag_m4_b',
    moduleId: 6,
    title: '正式 vs 非正式組織',
    content:
      '組織圖之外存在影子網絡——實際決策與資訊流動沿非正式關係傳播。' +
      '忽視非正式結構的改革注定失敗。',
    emoji: '🕸️',
    color: '#FF6B6B',
    col: 11,
    row: 6,  // beside M4 portal (inside lock_central)
  },

  // ── Module 4: 群體引力  (portal: 12,6 — inside lock_central) ───────────
  {
    id: 'frag_m5_a',
    moduleId: 4,
    title: '自我決定理論',
    content:
      'Deci & Ryan：內在動機由自主感、勝任感、歸屬感驅動。' +
      '外部獎勵若替代自主感，反而削弱長期動機——過度辯護效應。',
    emoji: '🔥',
    color: '#C084FC',
    col: 16,
    row: 3,  // above M5 portal (path tile, inside lock_east)
  },
  {
    id: 'frag_m5_b',
    moduleId: 4,
    title: 'Herzberg 雙因素',
    content:
      '保健因素（薪資、工作條件）消除不滿；激勵因素（成就、認可）創造滿意。' +
      '兩者性質不同，不可互相取代——加薪無法替代成就感。',
    emoji: '💡',
    color: '#C084FC',
    col: 17,
    row: 4,  // beside M5 portal (inside lock_east)
  },

  // ── Module 5: 策略高地  (portal: 16,4 — inside lock_east) ──────────────
  {
    id: 'frag_m6_a',
    moduleId: 5,
    title: 'Porter 五力',
    content:
      '產業吸引力由五力決定：現有競爭者、潛在進入者、替代品、' +
      '供應商議價力、買方議價力。策略目標是找到防禦五力的最佳定位。',
    emoji: '🗺️',
    color: '#FF9800',
    col: 16,
    row: 6,  // beside M6 portal (inside lock_east)
  },
  {
    id: 'frag_m6_b',
    moduleId: 5,
    title: '資源基礎觀',
    content:
      'Barney：持久競爭優勢來自 VRIN 資源——有價值、稀少、不可模仿、不可替代。' +
      '策略從「外部定位」轉向「內部能力」的典範轉移。',
    emoji: '💎',
    color: '#FF9800',
    col: 17,
    row: 7,  // below M6 portal (inside lock_east)
  },
];

// ── Rowe Decision Style Inventory (adapted, 10 questions) ──────────────────
// Each option maps to one of four styles:
//   A = Analytical   D = Directive
//   C = Conceptual   B = Behavioral

export type StyleKey = 'A' | 'D' | 'C' | 'B';

export interface QuizOption {
  text: string;
  style: StyleKey;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: '你的團隊正在規劃一項新專案。你第一個反應是？',
    options: [
      { text: '收集所有相關數據和先例，分析可行性後再決定。', style: 'A' },
      { text: '直接設定目標和截止日期，立刻分派任務。', style: 'D' },
      { text: '想像這個專案五年後的影響，從願景倒推計畫。', style: 'C' },
      { text: '先問每個人的想法，確保大家都買單再動。', style: 'B' },
    ],
  },
  {
    id: 2,
    scenario: '會議上出現意見分歧，大家各執一詞。你會怎麼做？',
    options: [
      { text: '要求各方提出數據佐證，用事實來裁決。', style: 'A' },
      { text: '快速做出決定，避免討論無限延伸。', style: 'D' },
      { text: '提出一個更大的框架，讓不同意見都有容身之處。', style: 'C' },
      { text: '花時間傾聽每個人，讓大家感覺被尊重後再整合。', style: 'B' },
    ],
  },
  {
    id: 3,
    scenario: '你收到一份報告，但數據和你的直覺相牴觸。你傾向？',
    options: [
      { text: '深入分析數據，找出可能的誤差或遺漏的變數。', style: 'A' },
      { text: '信任直覺，數據只是參考。行動才能驗證一切。', style: 'D' },
      { text: '思考是否有第三種可能，數據和直覺都只是局部真相。', style: 'C' },
      { text: '找幾位信任的同事討論，聽聽他們怎麼解讀這個矛盾。', style: 'B' },
    ],
  },
  {
    id: 4,
    scenario: '主管給你一個模糊的任務指令，你會？',
    options: [
      { text: '列出所有可能的詮釋，再請主管確認哪個最接近意圖。', style: 'A' },
      { text: '直接選一個最合理的方向開始做，再邊做邊調整。', style: 'D' },
      { text: '把模糊當成創意空間，提出一個超出預期的提案。', style: 'C' },
      { text: '和主管約時間好好溝通，確保彼此的期待一致。', style: 'B' },
    ],
  },
  {
    id: 5,
    scenario: '你必須在三個方案中選一個，但三個都各有優劣。你的決策方式是？',
    options: [
      { text: '建立評估矩陣，用加權評分客觀比較。', style: 'A' },
      { text: '選風險最低、執行最快的那個，先做再說。', style: 'D' },
      { text: '問自己：哪個方案最有可能改變遊戲規則？', style: 'C' },
      { text: '考慮哪個方案對團隊士氣和人際關係的影響最小。', style: 'B' },
    ],
  },
  {
    id: 6,
    scenario: '你的工作最讓你有成就感的是？',
    options: [
      { text: '把一個複雜問題拆解清楚，找到最優解。', style: 'A' },
      { text: '在混亂中快速做決定，讓事情動起來。', style: 'D' },
      { text: '想出一個別人沒想到的創新方向。', style: 'C' },
      { text: '幫助一位同事突破困境，看到他成長。', style: 'B' },
    ],
  },
  {
    id: 7,
    scenario: '你在準備一場重要簡報。你最在意的是？',
    options: [
      { text: '邏輯嚴謹、數據充分，每個論點都有來源。', style: 'A' },
      { text: '重點清晰、行動明確，讓聽眾知道接下來要做什麼。', style: 'D' },
      { text: '故事性強、視野宏觀，讓聽眾看見更大的圖景。', style: 'C' },
      { text: '語氣真誠、考慮到不同聽眾的感受和需求。', style: 'B' },
    ],
  },
  {
    id: 8,
    scenario: '面對一個你不熟悉的新領域，你的第一步通常是？',
    options: [
      { text: '系統性地研究相關文獻、案例和理論。', style: 'A' },
      { text: '直接找一個小任務實作，從錯誤中學習。', style: 'D' },
      { text: '先建立一個整體的心智地圖，再逐步填入細節。', style: 'C' },
      { text: '找一個這個領域的前輩聊聊，從人的經驗開始。', style: 'B' },
    ],
  },
  {
    id: 9,
    scenario: '一位下屬犯了錯誤，造成專案延誤。你的第一反應是？',
    options: [
      { text: '先分析錯誤的根本原因，再提出系統性的改善方案。', style: 'A' },
      { text: '立即修正問題，把損失降到最低，事後再複盤。', style: 'D' },
      { text: '把這個錯誤視為重新思考流程的機會。', style: 'C' },
      { text: '先關心下屬的狀態，確保他不會因此喪失信心。', style: 'B' },
    ],
  },
  {
    id: 10,
    scenario: '你如何定義一個「好的決策」？',
    options: [
      { text: '在充分資訊下，用邏輯推導出最佳解。', style: 'A' },
      { text: '在有限時間內，選出能達成目標的行動。', style: 'D' },
      { text: '對未來有長遠的正面影響，哪怕短期有風險。', style: 'C' },
      { text: '讓所有相關人都能接受，並維持良好關係。', style: 'B' },
    ],
  },
];

// ── Scoring ────────────────────────────────────────────────────────────────

export type ScoreMap = Record<StyleKey, number>;

export function calcScores(answers: StyleKey[]): ScoreMap {
  const scores: ScoreMap = { A: 0, D: 0, C: 0, B: 0 };
  for (const s of answers) scores[s]++;
  return scores;
}

export function getTopStyle(scores: ScoreMap): StyleKey {
  return (Object.keys(scores) as StyleKey[]).reduce((top, key) =>
    scores[key] > scores[top] ? key : top
  );
}

// ── Player Type Config ──────────────────────────────────────────────────────

export interface PlayerType {
  key: StyleKey;
  name: string;
  subtitle: string;
  description: string;
  trait: string;
  bonus: string;
  emoji: string;
  accentColor: string;
  luluGreeting: string;
}

export const PLAYER_TYPES: Record<StyleKey, PlayerType> = {
  A: {
    key: 'A',
    name: '分析型',
    subtitle: 'The Analyst',
    description:
      '你是數據的信徒，邏輯的追求者。在做任何決定之前，你需要充分的資訊和嚴謹的推理。這是優勢，也是你的功課——學習在不確定中行動。',
    trait: '邏輯強 · 數據控 · 追求精準',
    bonus: '測量 / 機率模組 +15% XP',
    emoji: '🔬',
    accentColor: 'var(--accent-blue)',
    luluGreeting:
      '分析型……有趣。你知道嗎，數據是過去的鏡子，但管理要面對的是未來。我期待看你如何跨越這個距離。',
  },
  D: {
    key: 'D',
    name: '指揮型',
    subtitle: 'The Director',
    description:
      '你天生就是行動者。在別人還在思考時，你已經在執行了。這股能量是組織的引擎——但記住，快速不等於正確，果斷需要以理解為基礎。',
    trait: '執行力強 · 果斷 · 目標導向',
    bonus: '決策 / 組織模組 +15% XP',
    emoji: '⚔️',
    accentColor: 'var(--accent-red)',
    luluGreeting:
      '指揮型。你不怕做決定，這很好。但我要問你一件事——你上一次改變主意，是因為什麼？這個問題很重要。',
  },
  C: {
    key: 'C',
    name: '概念型',
    subtitle: 'The Visionary',
    description:
      '你看見的比別人多、想的比別人遠。你的天賦是創造可能性。但願景需要落地，想法需要執行——這趟旅程會訓練你把夢想變成計畫。',
    trait: '創意強 · 大局觀 · 未來導向',
    bonus: '說故事 / 社群模組 +15% XP',
    emoji: '🌠',
    accentColor: 'var(--accent-gold)',
    luluGreeting:
      '概念型——我喜歡這種人。你總是在想「如果……會怎樣？」對嗎？保持這個習慣，但也要學會問：「如果不是，那又怎樣？」',
  },
  B: {
    key: 'B',
    name: '關係型',
    subtitle: 'The Connector',
    description:
      '你的核心是人。你感知情感、建立信任、創造連結。這是所有管理能力中最難學會、也最難被取代的。你已經走在正確的路上了。',
    trait: '人際強 · 同理心高 · 善於傾聽',
    bonus: '社會資本 / 群體模組 +15% XP',
    emoji: '🕸️',
    accentColor: 'var(--accent-green)',
    luluGreeting:
      '關係型。你很懂人。但讓我問你——當你必須做一個讓所有人都不開心的決定時，你能做到嗎？這才是真正的試煉。',
  },
};

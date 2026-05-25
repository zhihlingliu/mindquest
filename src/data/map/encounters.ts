// ── Mini Encounters ───────────────────────────────────────────────────────
// Short in-world challenge events triggered by proximity.
// Positions verified walkable against WORLD_MAP.

export interface EncounterChoice {
  text: string;
  isOptimal: boolean;
  feedback: string;
  xpReward: number;
}

export interface MiniEncounter {
  id: string;
  title: string;
  description: string;
  emoji: string;
  col: number;
  row: number;
  choices: EncounterChoice[];
}

export const MINI_ENCOUNTERS: MiniEncounter[] = [
  {
    id: 'enc_fog_patrol',
    title: '迷霧巡邏兵',
    description:
      '一名疲憊的管理者攔住你：「我同時收到 40 封信，腦子已經當機了。你建議我怎麼辦？」',
    emoji: '🌫️',
    col: 5,
    row: 4,
    choices: [
      {
        text: '告訴他先處理看起來最緊急的幾封',
        isOptimal: false,
        feedback: '直覺篩選容易被緊迫感（而非重要性）誤導——典型 System 1 陷阱。',
        xpReward: 20,
      },
      {
        text: '建議他先關閉通知，依重要性矩陣分類後再處理',
        isOptimal: true,
        feedback: '對！保護認知頻寬、啟動 System 2 分析——這是應對資訊過載的核心策略。',
        xpReward: 50,
      },
    ],
  },
  {
    id: 'enc_anchor_trap',
    title: '錨點陷阱',
    description:
      '供應商報價 $10,000，你的預算是 $6,000。對方說「最低 $9,500，不然沒得談」。',
    emoji: '⚓',
    col: 11,
    row: 3,
    choices: [
      {
        text: '接受 $9,500，畢竟已經降價了',
        isOptimal: false,
        feedback: '你被錨點效應困住了——$10,000 的初始報價讓 $9,500 看起來合理，但仍超出預算。',
        xpReward: 20,
      },
      {
        text: '忽視錨點，重新以自己的預算框架提出反報價',
        isOptimal: true,
        feedback: '正確！識別並打破錨點是談判的關鍵認知技能。提出你的框架，重設雙方基準。',
        xpReward: 50,
      },
    ],
  },
  {
    id: 'enc_framing_duel',
    title: '框架對決',
    description:
      '董事會面臨裁員決策：方案 A「保留 200 人工作」，方案 B「裁員 400 人」。兩者結果相同，你如何呈報？',
    emoji: '🖼️',
    col: 13,
    row: 4,
    choices: [
      {
        text: '如實呈現兩種說法，讓董事會自行判斷',
        isOptimal: false,
        feedback: '中性呈現看似公平，但實際上放棄了敘事主導權，結果往往由發言順序決定。',
        xpReward: 25,
      },
      {
        text: '以「保留 200 人」的正面框架呈報，同時附上完整數據',
        isOptimal: true,
        feedback: '掌握框架並保持透明——前景理論告訴我們正面框架能提高接受率，而數據保障誠信。',
        xpReward: 50,
      },
    ],
  },
  {
    id: 'enc_shadow_org',
    title: '影子網絡',
    description:
      '你發現一項改革決定在正式審查前就已流傳，幾位非正式意見領袖正在說服同事反對。你怎麼做？',
    emoji: '👥',
    col: 5,
    row: 7,
    choices: [
      {
        text: '通過正式公告再次強調改革必要性',
        isOptimal: false,
        feedback: '正式渠道對已在非正式網絡中發酵的抵制往往效果有限。',
        xpReward: 20,
      },
      {
        text: '主動接觸非正式意見領袖，理解顧慮並納入調整',
        isOptimal: true,
        feedback: '非正式組織的影響力真實存在。擁抱影子網絡、爭取意見領袖，是改革成功的關鍵。',
        xpReward: 50,
      },
    ],
  },
  {
    id: 'enc_motivation_crisis',
    title: '動機危機',
    description:
      '明星員工績效突然下滑。你調查後發現，她加薪後反而感覺「被買斷了熱情」。這是什麼現象？',
    emoji: '📉',
    col: 13,
    row: 7,
    choices: [
      {
        text: '這是巧合，薪酬永遠是主要動機',
        isOptimal: false,
        feedback: 'Herzberg 和 Deci 均指出：外在獎勵可以替代並削弱內在動機——過度辯護效應。',
        xpReward: 20,
      },
      {
        text: '過度辯護效應——外部獎勵降低了她的自主感與內在動機',
        isOptimal: true,
        feedback: '完全正確！SDT 理論：用外在獎勵替代自主感，內在動機會萎縮。應重新強化工作的意義感。',
        xpReward: 50,
      },
    ],
  },
  {
    id: 'enc_five_forces',
    title: '五力衝擊',
    description:
      '新創平台突然以超低價進入你的市場。用 Porter 五力分析，你的首要應對方向是？',
    emoji: '⚡',
    col: 18,
    row: 8,
    choices: [
      {
        text: '立即降價匹配，防止市佔流失',
        isOptimal: false,
        feedback: '價格戰消耗現有玩家，正中新進者下懷。這只回應了「現有競爭者」維度，忽略更深的結構性問題。',
        xpReward: 20,
      },
      {
        text: '強化 VRIN 資源壁壘（品牌、專利、客戶忠誠），提升進入門檻',
        isOptimal: true,
        feedback: '五力分析的答案在於「防禦性定位」。VRIN 資源創造的護城河才是持久應對新進者的策略。',
        xpReward: 50,
      },
    ],
  },
];

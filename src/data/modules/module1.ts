/**
 * Module 1 — 認知迷霧（Mist Valley）
 * 核心理論：注意力經濟、Kahneman 雙系統理論、認知啟發與偏誤
 */
import type { ChoiceQuestProps } from '@/components/quests/ChoiceQuest';
import type { SimulationQuestProps } from '@/components/quests/SimulationQuest';
import type { DialogueQuestProps } from '@/components/quests/DialogueQuest';
import type { BossQuestProps } from '@/components/quests/BossQuest';
import type { StoryQuestProps } from '@/components/quests/StoryQuest';
import type { ReflectionQuestProps } from '@/components/quests/ReflectionQuest';
import type { MatchQuestProps } from '@/components/quests/MatchQuest';
import type { StoryQuestData, ChoiceQuestData, SimQuestData, MatchQuestData, ReflectionQuestData, BossQuestData } from '../quest-types';

export type QuestType = 'choice' | 'sim' | 'dialogue' | 'boss' | 'story' | 'reflection' | 'match';

export interface ModuleQuest {
  id: string;
  name: string;
  type: QuestType;
  xpReward: number;
  data:
    | Omit<ChoiceQuestProps, 'onComplete'>
    | Omit<SimulationQuestProps, 'onComplete'>
    | Omit<DialogueQuestProps, 'onComplete'>
    | Omit<BossQuestProps, 'onComplete'>
    | Omit<StoryQuestProps, 'onComplete'>
    | Omit<ReflectionQuestProps, 'onComplete'>
    | Omit<MatchQuestProps, 'onComplete'>
    | StoryQuestData
    | ChoiceQuestData
    | SimQuestData
    | MatchQuestData
    | ReflectionQuestData
    | BossQuestData;
}

// ── Quest 0：序章故事 ──────────────────────────────────────────────────────

const q0: ModuleQuest = {
  id: 'm1q0',
  name: '進入霧谷',
  type: 'story',
  xpReward: 50,
  data: {
    xpReward: 50,
    pages: [
      {
        title: '霧谷 · 入口',
        body: '你站在霧谷的邊緣。濃霧從四面湧來，帶著雜音、通知、假新聞，還有無數條「緊急」訊息。\n\n這裡是「注意力盜賊」的領地。他們靠製造資訊噪音維生，讓你的大腦永遠忙碌，卻從不思考。\n\nLulu 從你肩膀跳下來，搖搖尾巴說：「要穿越霧谷，你必須學會一件事——選擇你真正要注意什麼。」',
        visual: '🌫️',
        mood: 'dramatic',
      },
      {
        title: '注意力是有限資源',
        body: '管理學家 Herbert Simon 早在 1955 年就說過：\n\n「資訊的豐富，造成注意力的匱乏。」\n\n你的注意力有三個特性：\n• **有限性**：同一時間只能高度專注一件事\n• **選擇性**：你的大腦會自動過濾你「不夠重視」的資訊\n• **移動性**：注意力可以轉移，但轉移需要耗費認知資源\n\n問題不是「你忙不忙」，而是「你把注意力放在了哪裡」。',
        visual: '🧠',
        mood: 'normal',
      },
      {
        title: 'Kahneman 的兩個系統',
        body: '心理學家 Daniel Kahneman 發現，人類大腦有兩套運作系統：\n\n**System 1（快思）**：直覺、自動、快速。看到老虎就跑，不需要思考。\n\n**System 2（慢想）**：分析、刻意、耗能。計算 17×24，需要集中注意力。\n\n問題是：大多數人在應該用 System 2 的時候，偷懶啟動了 System 1。\n\n這就是「認知偏誤」的來源。',
        visual: '⚡',
        mood: 'normal',
      },
      {
        title: '你的任務',
        body: 'Lulu 用爪子在地上畫了一張地圖。\n\n「霧谷有五個挑戰。每一個都是注意力盜賊設下的陷阱。」\n\n「通過這些試煉，你就能習得『選擇性注意』，看穿迷霧。」\n\n「準備好了嗎？第一個挑戰——Linda問題——就在前方。」',
        visual: '🗺️',
        mood: 'dramatic',
      },
    ],
  } satisfies StoryQuestData,
};

// ── Quest 1：Linda 問題（代表性捷思） ──────────────────────────────────────

const q1: ModuleQuest = {
  id: 'm1q1',
  name: '直覺陷阱',
  type: 'choice',
  xpReward: 80,
  data: {
    xpReward: 80,
    question: 'Linda 今年 31 歲，聰明、直率、主修哲學。學生時代對歧視和社會正義議題非常關心，曾參與反核遊行。\n\n請問，以下哪個描述更有可能是真的？',
    options: [
      {
        text: 'Linda 是銀行行員。',
        isCorrect: true,
        feedback: '正確！「Linda 是銀行行員」的機率，在邏輯上永遠大於或等於「Linda 是銀行行員且是女性主義者」的機率。結合兩個條件，機率只會更低，不會更高。這是代表性捷思（Representativeness Heuristic）——因為 Linda 的描述「感覺」像女性主義者，所以大腦把 B 判斷得更合理。',
      },
      {
        text: 'Linda 是銀行行員，同時也是女性主義運動的積極參與者。',
        isCorrect: false,
        feedback: '這是 Kahneman 著名的「連結謬誤」實驗！85% 的受試者選了這個選項——因為 Linda 的描述和「女性主義者」更吻合（代表性）。但邏輯上，兩個條件同時成立的機率不可能高於單一條件。你的 System 1 被描述的「形象感」誤導了。',
      },
    ],
    luluFeedback: {
      correct: '哇！你識破了代表性捷思！大多數人會選 B，因為那個形象更「符合」Linda 的描述。但邏輯機率告訴我們：A ≥ A∩B。你的 System 2 勝出了！',
      wrong: '這是 Kahneman 最著名的實驗之一！85% 的人和你做了同樣的選擇。原因是「代表性捷思」——Linda 的描述讓她「看起來像」女性主義者，所以大腦覺得 B 更合理。但機率論告訴我們：A 的機率永遠 ≥ A∩B 的機率。',
    },
  } satisfies Omit<ChoiceQuestProps, 'onComplete'>,
};

// ── Quest 2：果醬實驗（選擇過載） ──────────────────────────────────────────

const q2: ModuleQuest = {
  id: 'm1q2',
  name: '果醬實驗',
  type: 'sim',
  xpReward: 100,
  data: {
    scenario: '你是一家超市的行銷顧問。Sheena Iyengar 的研究發現：\n展示 24 種果醬時 60% 顧客停下試吃，但只有 3% 購買；展示 6 種果醬時 40% 停下試吃，但有 30% 購買。\n\n老闆計畫下個月推出 48 種口味。你會怎麼建議？',
    choices: [
      {
        text: '支持老闆的計畫：更多選擇 = 更多吸引力。',
        outcome: '銷售量下滑了 45%。這是「選擇過載（Choice Overload）」——選項太多時認知負荷過大，顧客乾脆放棄購買。Barry Schwartz 在《選擇的悖論》中詳細描述了這個現象。有時候，少即是多。',
        xp: 30,
      },
      {
        text: '建議削減到 6-8 種，聚焦最暢銷口味，設計清晰分類。',
        outcome: '銷售量成長了 28%！Iyengar 果醬實驗的洞察直接奏效。適當選項數（5-9 項，符合 Miller 的魔數）能降低認知負荷，幫助顧客決策而非讓他們陷入選擇焦慮。這才是管理者的判斷！',
        xp: 100,
      },
      {
        text: '讓顧客投票決定推出哪些口味，引入民主機制。',
        outcome: '投票結果：顧客想要 36 種口味，問題沒有解決反而更複雜。管理決策不能只是「讓所有人開心」，而是要基於數據和理論做出有根據的判斷。',
        xp: 50,
      },
    ],
  } satisfies Omit<SimulationQuestProps, 'onComplete'>,
};

// ── Quest 3：錨定效應 ───────────────────────────────────────────────────────

const q3: ModuleQuest = {
  id: 'm1q3',
  name: '錨定的陷阱',
  type: 'choice',
  xpReward: 80,
  data: {
    xpReward: 80,
    question: '你是一位採購主管，正在和廠商談判零組件的合約價格。\n\n談判開始前，廠商丟出第一個數字：「我們的建議售價是每單位 **$500**。」\n\n根據市場調查，合理成本應該在 $200-$280 之間。你會怎麼做？',
    options: [
      {
        text: '從 $500 開始往下談，最終談到 $380，覺得已經「省了很多」。',
        isCorrect: false,
        feedback: '你被錨定效應（Anchoring Effect）影響了！廠商用 $500 設下錨點，讓你把「討價還價的成功感」建立在這個虛高的數字上。最終的 $380 仍然遠高於市場行情，但你的大腦認為「已經很成功了」。這是 Kahneman 和 Tversky 發現的最強力認知偏誤之一。',
      },
      {
        text: '無視廠商的開價，拋出自己的錨點：「根據我們的市場調查，$240 是合理價格，請報價。」',
        isCorrect: true,
        feedback: '這是對付錨定效應的最好方法——建立你自己的錨點！談判學專家建議：不要讓對方的開價成為討論的基準。用獨立分析的數據打破對方的錨，把談判焦點移到你設定的參考框架上。',
      },
      {
        text: '直接拒絕繼續談判，說「這個價格完全不合理」然後離開。',
        isCorrect: false,
        feedback: '雖然你識破了錨定效應，但直接離開並非最佳策略。在商業談判中，即使對方開出不合理的價格，維持關係和找到共識也很重要。更好的做法是反錨——用你自己的合理數據作為新的談判起點。',
      },
    ],
    luluFeedback: {
      correct: '完美！你用「反錨定」策略化解了錨定效應。在談判中，誰先設定基準，誰就掌握了心理優勢。永遠要帶著你自己的數據進談判室！',
      wrong: '錨定效應是最強力的認知偏誤之一。即使知道錨點可能不合理，大多數人還是會受到第一個數字的影響。對策是：用獨立調查設置你自己的錨點，而不是在對方的框架內討價還價。',
    },
  } satisfies Omit<ChoiceQuestProps, 'onComplete'>,
};

// ── Quest 4：反思書寫 ───────────────────────────────────────────────────────

const q4: ModuleQuest = {
  id: 'm1q4',
  name: '盧哲人的提問',
  type: 'reflection',
  xpReward: 60,
  data: {
    question: '今天，誰控制了你的注意力？',
    prompt: '回想今天或最近一週，有哪個時刻你的注意力被「劫走」了——被手機通知、突發狀況、或他人的緊急要求拉走？\n\n那個時刻，你真正想做什麼？那件被打斷的事最終完成了嗎？\n\n用 2-3 句話，誠實地寫下你的觀察。',
    luluComment: '管理學從「管理自己的注意力」開始。你無法管理你不了解的東西——包括你自己的大腦。',
  } satisfies ReflectionQuestData,
};

// ── Boss：注意力盜賊 ────────────────────────────────────────────────────────

const boss: ModuleQuest = {
  id: 'm1boss',
  name: '注意力盜賊',
  type: 'boss',
  xpReward: 200,
  data: {
    bossName: '注意力盜賊 The Attention Thief',
    achievementName: '認知解鎖者',
    achievementEmoji: '🧠',
    luluVictoryLine: '你做到了！你用System 2的力量，在資訊洪流中找到了真實。這就是管理者最重要的能力——在噪音中聽見訊號。',
    xpReward: 200,
    questions: [
      {
        question: '以下哪個選項描述「連結謬誤（Conjunction Fallacy）」的核心錯誤？',
        options: [
          { text: '人們傾向記住第一個看到的資訊（錨定效應）', isCorrect: false },
          { text: '兩個條件同時成立的機率，被誤判為高於單一條件成立的機率', isCorrect: true },
          { text: '選項太多時，人們傾向選擇中間的那個', isCorrect: false },
          { text: 'System 2 比 System 1 更容易出錯', isCorrect: false },
        ],
        explanation: 'Linda 問題揭示了連結謬誤：A∩B 的機率永遠 ≤ A 的機率。「Linda 是銀行行員且是女性主義者」的機率，不可能高於「Linda 是銀行行員」。代表性捷思讓大腦用「形象相符度」代替了機率計算。',
      },
      {
        question: 'Kahneman 的 System 1 和 System 2 中，以下哪個描述最準確？',
        options: [
          { text: 'System 1 是理性的，System 2 是感性的', isCorrect: false },
          { text: 'System 2 永遠比 System 1 做出更好的決策', isCorrect: false },
          { text: 'System 1 快速自動，在需要深度分析時若未切換至 System 2，容易產生認知偏誤', isCorrect: true },
          { text: 'System 1 只在壓力情境下啟動', isCorrect: false },
        ],
        explanation: 'System 1 快速、直覺、自動——在緊急情況下是生存優勢，但在需要邏輯分析的決策中（如機率判斷、談判、策略規劃），若未切換至耗能的 System 2，就容易被捷思和偏誤誤導。管理者的訓練，是學會「知道何時切換」。',
      },
      {
        question: '一位業務主管在簽約前讓客戶先填了一張「建議合約金額」表（可填任意數字）。研究發現，這個無意義的數字對最終成交金額有顯著影響。這說明了什麼？',
        options: [
          { text: '選擇過載：太多選項讓客戶無所適從', isCorrect: false },
          { text: '可得性捷思：容易想到的資訊被賦予更高的重要性', isCorrect: false },
          { text: '錨定效應：即使是隨機或任意的數字，也會影響後續的數值判斷', isCorrect: true },
          { text: '確認偏誤：人們只注意符合自己期待的資訊', isCorrect: false },
        ],
        explanation: '這正是 Kahneman 和 Tversky 發現的錨定效應（Anchoring Effect）。即使受試者知道那個數字是隨機的，它仍然顯著影響了最終判斷。錨點一旦設下，人的思考就會在它的引力範圍內移動。對抗方法：帶著自己的獨立分析進入任何談判或決策。',
      },
    ],
  } satisfies Omit<BossQuestProps, 'onComplete'>,
};

export const MODULE1 = {
  id: 1,
  name: '認知迷霧',
  subtitle: 'Mist Valley',
  description: '穿越充滿認知陷阱的霧谷，學會在資訊噪音中找到真實訊號。',
  statsGain: { cognition: 25, decisionPower: 10 },
  quests: [q0, q1, q2, q3, q4, boss] as ModuleQuest[],
};

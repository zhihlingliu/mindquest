/**
 * Module 3 — 影響力廊（Influence Corridor）
 * 核心理論：說故事、ELM 說服、Logos/Ethos/Pathos、媒體依賴理論
 */
import type { ChoiceQuestProps } from '@/components/quests/ChoiceQuest';
import type { SimulationQuestProps } from '@/components/quests/SimulationQuest';
import type { BossQuestProps } from '@/components/quests/BossQuest';
import type { StoryQuestProps } from '@/components/quests/StoryQuest';
import type { ReflectionQuestProps } from '@/components/quests/ReflectionQuest';
import type { MatchQuestProps } from '@/components/quests/MatchQuest';
import type { ModuleQuest } from './module1';

// ── Quest 0：進入影響力廊 ──────────────────────────────────────────────────

const q0: ModuleQuest = {
  id: 'm3q0',
  name: '進入影響力廊',
  type: 'story',
  xpReward: 50,
  data: {
    xpReward: 50,
    pages: [
      {
        title: '影響力廊 · 入口',
        body: '影響力廊。\n\n這條長廊的兩側掛滿了廣告看板、演說台、社群媒體螢幕。\n每一個訊息都在爭奪你的注意力，每一個人都想說服你。\n\n在這個時代，真正的管理者不只要做出好決策——他必須讓別人相信那個決策。',
        visual: '🎭',
        mood: 'normal',
      },
      {
        title: '故事的力量',
        body: '盧哲人說：\n\n「我帶學生去聽了一場兩小時的演講。一週後，大家記得的幾乎都是故事——那些只佔十幾分鐘的片段。\n\n其他一小時四十分鐘呢？消失了。」\n\n這就是你今天要學會的武器：故事力、說服力、媒體策略。',
        visual: '🦊',
        mood: 'normal',
      },
      {
        title: '三個能力',
        body: '三個能力，一條廊道：\n\n① 說故事——讓人記住你\n② 說服——讓人相信你\n③ 媒體選擇——讓訊息找到對的人\n\n準備好了嗎？影響力幻術師在廊道盡頭等著你。',
        visual: '⚔️',
        mood: 'dramatic',
      },
    ],
  } satisfies Omit<StoryQuestProps, 'onComplete'>,
};

// ── Quest 1：故事的記憶魔法 ───────────────────────────────────────────────

const q1: ModuleQuest = {
  id: 'm3q1',
  name: '故事的記憶魔法',
  type: 'choice',
  xpReward: 90,
  data: {
    question:
      '盧教授帶學生聽了一場兩小時的演講。一週後請學生回憶，大家記得最清楚的是什麼？',
    options: [
      {
        text: '演講者提供的數據與統計資料',
        isCorrect: false,
      },
      {
        text: '演講者分享的個人故事，雖然只占十幾分鐘',
        isCorrect: true,
      },
      {
        text: '演講者引用的學術研究結論',
        isCorrect: false,
      },
      {
        text: '演講者的 PPT 架構與邏輯',
        isCorrect: false,
      },
    ],
    xpReward: 90,
    luluFeedback: {
      correct:
        '對。故事占了演講時間不到 10%，卻幾乎是唯一被記住的部分。這就是 Narrative 的力量——大腦天生為故事而設計。邏輯說服理性，故事說服記憶。',
      wrong:
        '想想你自己的經驗：上週你讀過最多數字的那份報告，你現在還記得幾個？但你朋友說過的某個故事，你可能記得好幾年。人腦不是硬碟，是故事機。',
    },
    statHint: {
      stat: 'influence',
      threshold: 15,
      hint: '你的影響力直覺感知到了——人腦對情緒敘事的記憶比數字和邏輯深刻得多。能讓人感受的內容，才能讓人記住。',
    },
  } satisfies Omit<ChoiceQuestProps, 'onComplete'>,
};

// ── Quest 2：ELM 說服路徑選擇 ─────────────────────────────────────────────

const q2: ModuleQuest = {
  id: 'm3q2',
  name: 'ELM 說服路徑選擇',
  type: 'sim',
  xpReward: 100,
  data: {
    scenario:
      '你是一家製造業的 HR 總監。公司要推行一個「彈性工時制度」的變革，需要說服 500 名基層員工接受。你有兩個簡報策略可以選擇。',
    context:
      '根據 Petty & Cacioppo 的「思辨可能模式（ELM）」：\n中央路徑：對象有動機有能力思考時，提供完整邏輯論證，效果持久\n邊緣路徑：對象動機或能力不足時，用情緒、故事、名人，效果即時但易消退',
    choices: [
      {
        text: '策略一：準備 50 頁的數據簡報，包含彈性工時的全球研究、成本效益分析、各部門影響評估，說明變革的完整邏輯。',
        outcome:
          '你的簡報完整，但員工在會議上就開始發呆。彈性工時對他們來說是個陌生概念，他們沒有足夠的背景知識來消化這 50 頁的資訊——他們目前的「思辨能力」不足以走中央路徑。\n\nELM 告訴我們：說服策略必須配合對象的思辨程度。當對象能力不足時，先走邊緣路徑建立情緒連結，才能引導他們進入中央路徑。',
        xp: 60,
        luluComment:
          '你說服了自己，但沒說服他們。邏輯是你的邏輯，不是他們的邏輯。先讓人感受到變革的必要，再給他們理解的能力。',
      },
      {
        text: '策略二：請一位曾採用彈性工時、現在家庭工作都兼顧的資深員工來分享故事，再搭配 3 張關鍵數據。',
        outcome:
          '效果顯著。員工聽到身邊人的故事，產生了情感連結（邊緣路徑）；3 張數據提供了基本的理性支撐（初步的中央路徑）。\n\n這是 ELM 的實戰應用：先用邊緣路徑（故事）讓人有動機，再用中央路徑（數據）給人能力，說服才能持久。',
        xp: 100,
        luluComment:
          '你讓他們先想「我也可以」，才讓他們看「數據說明這是真的」。John Kotter 說：變革的第一步不是邏輯，是急迫感。你做到了。',
      },
    ],
  } satisfies Omit<SimulationQuestProps, 'onComplete'>,
};

// ── Quest 3：說服理論配對 ──────────────────────────────────────────────────

const q3: ModuleQuest = {
  id: 'm3q3',
  name: '說服理論配對',
  type: 'match',
  xpReward: 90,
  data: {
    title: '配對看看——你記住了嗎？',
    pairs: [
      { term: 'Logos',  definition: '以邏輯與事實說服，訴諸理性' },
      { term: 'Ethos',  definition: '以訊息來源的權威與信譽說服' },
      { term: 'Pathos', definition: '以情感與情緒狀態說服' },
      { term: '中央路徑', definition: '對象思辨程度高時，提供完整論證' },
      { term: '邊緣路徑', definition: '對象動機或能力不足時，用情緒與故事' },
      { term: '睡眠效應', definition: '名人光環的說服力會隨時間消退' },
    ],
    xpReward: 90,
  } satisfies Omit<MatchQuestProps, 'onComplete'>,
};

// ── Quest 4：你的影響力故事 ───────────────────────────────────────────────

const q4: ModuleQuest = {
  id: 'm3q4',
  name: '你的影響力故事',
  type: 'reflection',
  xpReward: 80,
  data: {
    question:
      '想一個你曾經「說服」過別人的經驗——不論是說服父母、朋友、同學、還是老師。\n\n你用的是邏輯（Logos）、信譽（Ethos）、還是情感（Pathos）？你走的是中央路徑還是邊緣路徑？',
    prompt: '描述那個情境，以及你用了什麼說服策略...',
    luluComment:
      '說服從來不是技巧的問題，是「理解對方在哪個狀態」的問題。你剛才分析了自己的說服經驗——這個自我覺察，就是成為影響力高手的第一步。',
    xpReward: 80,
  } satisfies Omit<ReflectionQuestProps, 'onComplete'>,
};

// ── Boss：影響力幻術師 ────────────────────────────────────────────────────

const boss: ModuleQuest = {
  id: 'm3boss',
  name: '影響力幻術師',
  type: 'boss',
  xpReward: 160,
  data: {
    bossName: '影響力幻術師 The Illusion Master',
    achievementName: '說服建築師',
    achievementEmoji: '🎭',
    luluVictoryLine:
      '通過了。大多數人花一輩子被別人的故事說服，卻從來不知道自己可以用故事影響別人。現在你知道了那些規則，你就不再只是觀眾。',
    xpReward: 160,
    questions: [
      {
        question: '根據媒體依賴理論，下列哪個描述最正確？',
        options: [
          { text: '大眾媒體永遠比小眾媒體有效，覆蓋率更廣', isCorrect: false },
          { text: '個人媒體（如部落格）的影響力永遠大於傳統媒體', isCorrect: false },
          {
            text: '沒有絕對最好的媒體；不同媒體在不同社會情境對不同對象有不同效果',
            isCorrect: true,
          },
          { text: '魔彈效應已被完全證實，大眾媒體對所有人有相同的直接影響', isCorrect: false },
        ],
        explanation:
          '媒體依賴理論的核心：媒體效果取決於媒體系統、社會情境、與閱聽人三者的互動。沒有萬能媒體，只有適合的媒體——這就是為什麼經理人需要「靈活交互應用」。',
      },
      {
        question: '故事的五大要素（Narrative Structure Coding Scale）中，「知覺程度」指的是？',
        options: [
          { text: '故事中的時序是否按照起承轉合發展', isCorrect: false },
          { text: '故事中是否描述了角色的成長與改變', isCorrect: false },
          {
            text: '閱聽者是否能與故事角色產生共鳴，感受到角色的想法與情感',
            isCorrect: true,
          },
          { text: '故事是否聚焦於某一個特殊的具體事件', isCorrect: false },
        ],
        explanation:
          '知覺程度（Landscape of Consciousness）：讀者/聽者是否能進入角色的內心世界，感同身受。這是讓故事產生感染力的關鍵要素——沒有共鳴，故事只是報告。',
      },
      {
        question:
          '一家公司想說服旗下教育程度較高、態度原本不贊成的員工接受新政策。根據 ELM 與說服研究，最有效的策略是？',
        options: [
          { text: '重複播放激情的宣傳影片，用情緒壓制反對意見', isCorrect: false },
          { text: '邀請名人代言，借用光環效應提升接受度', isCorrect: false },
          {
            text: '提供完整雙面訊息，讓員工看到政策的優缺點及因應方案',
            isCorrect: true,
          },
          { text: '只強調政策好處，隱藏可能的負面影響', isCorrect: false },
        ],
        explanation:
          '研究顯示：教育程度高、原本持反對態度的對象，提供「雙面訊息」比單面更有說服效果。他們的思辨能力高（走中央路徑），隱藏資訊反而會引發不信任。名人效應對高思辨者幾乎無效。',
      },
    ],
  } satisfies Omit<BossQuestProps, 'onComplete'>,
};

export const MODULE3 = {
  id: 3,
  name: '影響力廊',
  subtitle: 'Influence Corridor',
  description: '說故事、說服、媒體策略——在這條廊道裡，你必須學會讓人相信你。',
  statsGain: { influence: 25, socialCapital: 10 },
  quests: [q0, q1, q2, q3, q4, boss] as ModuleQuest[],
};

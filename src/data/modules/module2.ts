/**
 * Module 2 — 決策峰頂（Decision Peak）
 * 核心理論：有限理性、滿意化、測量尺度、回歸均值
 */
import type { ChoiceQuestProps } from '@/components/quests/ChoiceQuest';
import type { SimulationQuestProps } from '@/components/quests/SimulationQuest';
import type { BossQuestProps } from '@/components/quests/BossQuest';
import type { StoryQuestProps } from '@/components/quests/StoryQuest';
import type { ReflectionQuestProps } from '@/components/quests/ReflectionQuest';
import type { MatchQuestProps } from '@/components/quests/MatchQuest';
import type { ModuleQuest } from './module1';

// ── Quest 0：登頂之前 ─────────────────────────────────────────────────────

const q0: ModuleQuest = {
  id: 'm2q0',
  name: '登頂之前',
  type: 'story',
  xpReward: 50,
  data: {
    xpReward: 50,
    pages: [
      {
        title: '決策峰頂 · 山腳',
        body: '你站在一座山的山腳。\n\n從這裡往上看，峰頂被雲遮住了。傳說中，峰頂有一個地方叫做「完美決策之地」——在那裡，你能看見所有選項，計算所有後果，做出永遠正確的決定。\n\n每個管理者都想爬上去。大多數人爬到一半就迷路了。',
        visual: '⛰️',
        mood: 'dramatic',
      },
      {
        title: 'Herbert Simon 的警告',
        body: '1978 年，一位叫 Herbert Simon 的人拿了諾貝爾獎。\n\n他的核心發現是：「完美決策之地」不存在。\n\n不是因為人類太笨，而是因為真實世界裡，資訊永遠不完整、認知能力永遠有限、時間永遠不夠。\n\n他把這個稱作「有限理性（Bounded Rationality）」。',
        visual: '🏆',
        mood: 'normal',
      },
      {
        title: '真正的目標',
        body: '「那麼，我們要學什麼？」\n\nLulu 從岩石後面跳出來。\n\n「不是學如何做完美決策——而是學如何在不完美的條件下，做出夠好的決定。更快、更清醒、更少後悔。\n\n這才是真正爬上決策峰頂的方法。走吧。」',
        visual: '🦊',
        mood: 'success',
      },
    ],
  } satisfies Omit<StoryQuestProps, 'onComplete'>,
};

// ── Quest 1：猴子 vs. 人類 ────────────────────────────────────────────────

const q1: ModuleQuest = {
  id: 'm2q1',
  name: '猴子 vs. 人類',
  type: 'sim',
  xpReward: 90,
  data: {
    scenario:
      '你是一家新創公司的創辦人。你有兩個薪資談判策略可以選擇。你的核心工程師告訴你他考慮離職，希望加薪。',
    context:
      '猴子的邏輯：持續按下「提高薪資」按鈕，直到找到最優解。\n人類的邏輯：在有限資訊下，找到「夠好的解」然後停止。\n\nHerbert Simon 把前者叫做「最佳化者」，後者叫做「滿意化者」。',
    choices: [
      {
        text: '最佳化：詳細調查市場薪資、分析公司現金流、評估每一個加薪幅度的影響，找出最優解後再決定。',
        outcome:
          '你花了兩週做分析。在這段期間，這位工程師收到了另一家公司的 offer 並接受了。\n\n最佳化策略的代價：時間成本。現實世界裡，「完美的決策」往往來不及。',
        xp: 60,
        luluComment:
          '猴子每次按按鈕都能得到正確反饋，但人類的世界沒有這個奢侈。你的分析完美，但你的工程師已經走了。',
      },
      {
        text: '滿意化：快速評估「對公司可負擔且對員工夠公平的薪資範圍」，今天做決定，提出 offer。',
        outcome:
          '你在 48 小時內提出了加薪方案。方案不是最優的，但是「夠好的」。這位工程師接受了，並且因為你快速回應而更信任公司。\n\nSimon 的洞見：「滿意化」不是懶惰，而是在有限理性下最聰明的策略。',
        xp: 90,
        luluComment:
          '「夠好就好」不是放棄追求卓越，而是理解認知資源有限。最頂尖的管理者，都是優秀的滿意化者。',
      },
    ],
  } satisfies Omit<SimulationQuestProps, 'onComplete'>,
};

// ── Quest 2：測量神殿 ──────────────────────────────────────────────────────

const q2: ModuleQuest = {
  id: 'm2q2',
  name: '測量神殿',
  type: 'choice',
  xpReward: 100,
  data: {
    question:
      '測量神殿守衛問你：「你的公司要評估員工滿意度，設計了一份問卷，其中一題是『你有多滿意？請從 1 到 5 打分』。這是哪種測量尺度？」',
    options: [
      {
        text: '名目尺度（Nominal）——只有分類，沒有順序，如性別、部門。',
        isCorrect: false,
      },
      {
        text: '順序尺度（Ordinal）——有順序但間距不等，如滿意度評分。',
        isCorrect: true,
      },
      {
        text: '等距尺度（Interval）——有等距但無真正零點，如溫度（攝氏）。',
        isCorrect: false,
      },
      {
        text: '比率尺度（Ratio）——有等距且有真正零點，如收入、年齡。',
        isCorrect: false,
      },
    ],
    xpReward: 100,
    luluFeedback: {
      correct:
        '正確！滿意度 1–5 分是順序尺度——你知道 5 > 4 > 3，但你不能說「5 分的人比 1 分的人滿意五倍」，因為間距並不相等。這就是為什麼滿意度數據只能用中位數，不能用平均數。',
      wrong:
        '想一想：1–5 的滿意度評分，「5分」和「4分」之間的差距，和「2分」和「1分」之間的差距真的一樣嗎？這就是辨別測量尺度的關鍵。',
    },
    statHint: {
      stat: 'decisionPower',
      threshold: 15,
      hint: '你的決策力發現了關鍵差異——「有順序」不等於「等距」。問問自己：從不滿意到普通，和從普通到滿意，真的是同樣的距離嗎？',
    },
  } satisfies Omit<ChoiceQuestProps, 'onComplete'>,
};

// ── Quest 3：決策概念配對 ─────────────────────────────────────────────────

const q3: ModuleQuest = {
  id: 'm2q3',
  name: '決策概念配對',
  type: 'match',
  xpReward: 100,
  data: {
    title: '把這些決策理論關鍵詞，配上正確的定義',
    pairs: [
      { term: '有限理性',  definition: '資訊、認知與時間的限制使人無法達到完全理性' },
      { term: '滿意化',    definition: '找到「夠好的解」後停止搜尋，而非追求最優解' },
      { term: '回歸均值',  definition: '極端表現後，下一次通常自然趨近平均，與介入無關' },
      { term: '順序尺度',  definition: '有排序但間距不等，不能做乘除運算' },
      { term: '比率尺度',  definition: '有真正零點，可說「A 是 B 的兩倍」' },
    ],
    xpReward: 100,
  } satisfies Omit<MatchQuestProps, 'onComplete'>,
};

// ── Quest 4：你的決策慣性 ──────────────────────────────────────────────────

const q4: ModuleQuest = {
  id: 'm2q4',
  name: '你的決策慣性',
  type: 'reflection',
  xpReward: 80,
  data: {
    question:
      '回想一個你最近真正「想清楚了」的決策——你當時考量了哪些因素？事後回頭看，你遺漏了什麼？或者，回想一個你「沒想清楚就做」的決策，是什麼讓你跳過了分析？',
    prompt: '試著描述那個決策的情境和你當時的思考過程...',
    luluComment:
      '大多數人在事後才看清楚自己的盲點。Simon 說，有限理性不是缺陷，是現實——真正的成長，是搞清楚你的限制來自哪裡：資訊不足、認知偏誤，還是時間壓力？知道原因，下次才能設計更好的決策程序。',
    xpReward: 80,
  } satisfies Omit<ReflectionQuestProps, 'onComplete'>,
};

// ── Boss：完美決策幻象 ────────────────────────────────────────────────────

const boss: ModuleQuest = {
  id: 'm2boss',
  name: '完美決策幻象',
  type: 'boss',
  xpReward: 160,
  data: {
    bossName: '完美決策幻象 The Illusion of Optimality',
    achievementName: 'Simon 滿意者',
    achievementEmoji: '⚖️',
    luluVictoryLine:
      '到達峰頂的人，從來不是走了完美的路。他們只是及時停下來，選了夠好的那一條。你現在理解了。',
    xpReward: 160,
    questions: [
      {
        question:
          'Herbert Simon 提出「有限理性（Bounded Rationality）」，以下哪個描述最準確？',
        options: [
          { text: '人類有時會不理性，但透過更多訓練可以達到完全理性。', isCorrect: false },
          {
            text: '由於資訊、認知與時間的限制，人類決策本質上是有限的，因此「滿意化」是最佳策略。',
            isCorrect: true,
          },
          { text: '電腦輔助可以完全克服人類決策的局限。', isCorrect: false },
          { text: '有限理性只適用於複雜決策，日常小決策仍可完全理性。', isCorrect: false },
        ],
        explanation:
          'Simon 的核心論點：完全理性需要無限資訊、無限認知與無限時間——這三者在現實中都不存在。因此滿意化（找到「夠好的解」後停止）是理性行為，而非妥協。',
      },
      {
        question:
          '四種測量尺度中，哪種可以進行「有意義的乘除運算」？例如「A 的收入是 B 的兩倍」。',
        options: [
          { text: '名目尺度（Nominal）', isCorrect: false },
          { text: '順序尺度（Ordinal）', isCorrect: false },
          { text: '等距尺度（Interval）', isCorrect: false },
          { text: '比率尺度（Ratio）', isCorrect: true },
        ],
        explanation:
          '比率尺度有真正的零點（0 代表「完全沒有」），因此可以說「A 是 B 的兩倍」。等距尺度（如攝氏溫度）雖有等距，但沒有真正的零點——0°C 並非「沒有溫度」，所以不能說「30°C 是 15°C 的兩倍熱」。',
      },
      {
        question:
          '一位主管發現：每次他批評員工後，那位員工下次表現就變好。他認為「批評是最有效的管理工具」。這個推論最可能犯了什麼錯？',
        options: [
          { text: '確認偏誤——他只記住了批評有效的案例。', isCorrect: false },
          { text: '回歸均值——表現極差後自然改善，與批評不一定有因果關係。', isCorrect: true },
          { text: '錨定效應——他以第一次批評的結果作為基準。', isCorrect: false },
          { text: '可用性捷思——批評的場景比表揚更容易被記住。', isCorrect: false },
        ],
        explanation:
          '回歸均值：當表現處於極端（極差）時，下一次自然會趨向平均——無論你做了什麼。主管把「統計必然」誤認成「管理介入的效果」，這是 Kahneman 最著名的管理案例之一。',
      },
    ],
  } satisfies Omit<BossQuestProps, 'onComplete'>,
};

export const MODULE2 = {
  id: 2,
  name: '決策峰頂',
  subtitle: 'Decision Peak',
  description: '傳說中的「完美決策之路」在峰頂等著你。但盧哲人說：及時停下來，選夠好的那條。',
  statsGain: { decisionPower: 25, cognition: 10 },
  quests: [q0, q1, q2, q3, q4, boss] as ModuleQuest[],
};

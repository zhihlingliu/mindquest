// ── Lulu Template-Based Intelligence Engine ────────────────────────────────
// Pure rule-matching + template interpolation. No external API calls.

// ── Types ──────────────────────────────────────────────────────────────────

export interface LuluContext {
  // Player state
  stats: {
    cognition: number;
    decisionPower: number;
    influence: number;
    socialCapital: number;
    orgWisdom: number;
  };
  playerType: string | null;
  level: number;
  completedModules: number[];
  achievements: string[];

  // Current situation
  wrongCount?: number;
  currentModuleId?: number;
  currentQuestType?: string;
  recentQuestId?: string;
  recentQuestCorrect?: boolean;

  // Reflection context
  reflectionTopic?: string;
}

export interface LuluResponse {
  message: string;
  mood: 'normal' | 'excited' | 'challenge' | 'thinking' | 'warning';
  hint?: string;
  followup?: string;
}

// ── Category A: STAT_REACTION ───────────────────────────────────────────────

interface StatReactionTemplate {
  condition: (ctx: LuluContext) => boolean;
  message: string;
  mood: LuluResponse['mood'];
  hint?: string;
  followup?: string;
}

const STAT_REACTION_TEMPLATES: StatReactionTemplate[] = [
  // Cognition
  {
    condition: (ctx) => ctx.stats.cognition >= 60,
    message:
      '你的認知力已經相當可觀了。但我得提醒你——高認知力有時反而是陷阱：你會開始用複雜的框架解讀本應簡單的事。',
    mood: 'challenge',
    hint: '注意不要過度分析。系統一的直覺有時比系統二的邏輯更快找到答案。',
  },
  {
    condition: (ctx) => ctx.stats.cognition >= 30 && ctx.stats.cognition < 60,
    message:
      '認知力正在成長中。你開始注意到自己的思考偏誤了嗎？這是 Kahneman 最希望你做的事。',
    mood: 'normal',
  },
  {
    condition: (ctx) => ctx.stats.cognition < 20,
    message:
      '認知力還在起步階段。沒關係——大多數人一輩子都沒意識到自己有認知偏誤。你至少開始了。',
    mood: 'normal',
    hint: '先從霧谷（Module 1）開始——那裡會教你最基本的認知防禦。',
  },
  // Decision power
  {
    condition: (ctx) => ctx.stats.decisionPower >= 50,
    message:
      '你的決策力讓我想到 Simon——他拿了諾貝爾獎，不是因為他做了完美決策，而是因為他知道「夠好」是什麼。',
    mood: 'thinking',
  },
  {
    condition: (ctx) => ctx.stats.decisionPower < 20 && ctx.completedModules.length === 0,
    message:
      '你還沒有開始訓練決策力。這是正常的——但在這個資訊爆炸的時代，不訓練決策力，你就只是在被決策。',
    mood: 'warning',
  },
  // Influence
  {
    condition: (ctx) => ctx.stats.influence >= 50,
    message:
      '影響力達到 {value}。你知道亞里士多德把說服分成三種嗎？Logos、Ethos、Pathos。你現在用哪一種最多？',
    mood: 'challenge',
    followup: '想想你最近一次說服別人的經驗——你用的是邏輯、信譽，還是情感？',
  },
  // Social capital
  {
    condition: (ctx) => ctx.stats.socialCapital >= 50,
    message:
      '社會資本 {value}。Granovetter 說弱連結比強連結更有力——你的人脈網絡有多少是你平時不常聯繫的人？',
    mood: 'thinking',
    followup: '你上一次主動聯繫一個「弱連結」，是多久以前的事？',
  },
  // Org wisdom
  {
    condition: (ctx) => ctx.stats.orgWisdom >= 50,
    message:
      '組織智慧 {value}。你已經開始用系統眼光看組織了。問問自己：你看到的問題是「人的問題」，還是「結構的問題」？',
    mood: 'challenge',
  },
  // Balanced stats
  {
    condition: (ctx) => {
      const vals = Object.values(ctx.stats);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const max = Math.max(...vals);
      return max - avg < 15 && avg > 15;
    },
    message:
      '你的各項能力發展得相當均衡。這很罕見——大多數人都有明顯的強項和弱點。均衡是一種選擇，也是一種策略。',
    mood: 'thinking',
  },
  // High overall
  {
    condition: (ctx) => {
      const vals = Object.values(ctx.stats);
      return vals.reduce((a, b) => a + b, 0) / vals.length >= 50;
    },
    message:
      '整體能力值已經相當高了。記住 Dunning-Kruger：最危險的時刻往往是你覺得自己都懂的時候。',
    mood: 'warning',
    hint: '繼續挑戰更難的 Boss 關卡，保持對知識的謙遜。',
  },
];

// ── Category B: WRONG_PENALTY ───────────────────────────────────────────────

const WRONG_PENALTY_TEMPLATES: StatReactionTemplate[] = [
  // Boss-specific (check first — more specific)
  {
    condition: (ctx) => (ctx.wrongCount ?? 0) >= 1 && ctx.currentQuestType === 'boss',
    message:
      '這是 Boss 戰。允許自己慢下來——Boss 的問題通常在考你「整合理解」，不是記憶背誦。',
    mood: 'thinking',
    hint: '把所有選項都讀完再選。Boss 題的干擾項設計得特別像正確答案。',
  },
  // Wrong count escalation
  {
    condition: (ctx) => (ctx.wrongCount ?? 0) === 1,
    message:
      '第一次答錯很正常。重要的是你知道為什麼答錯——是沒讀到，還是讀了但直覺判斷錯誤？',
    mood: 'normal',
    hint: '試著找出「哪個選項表面上最合理但實際上是陷阱」。',
  },
  {
    condition: (ctx) => (ctx.wrongCount ?? 0) === 2,
    message:
      '兩次了。我要換個方式幫你——不是告訴你答案，而是告訴你應該思考什麼問題。',
    mood: 'challenge',
    hint: '先排除「感覺最直覺」的選項。直覺在這裡通常是陷阱。',
  },
  {
    condition: (ctx) => (ctx.wrongCount ?? 0) >= 3,
    message:
      '三次。好，我們直說。這題的核心是：你需要用「反直覺」的方式思考。最像正確答案的，往往不是正確答案。',
    mood: 'warning',
    hint: '回到題目，找出哪個選項「看起來太完美」——通常那個是錯的。',
  },
  // Got it right after struggling
  {
    condition: (ctx) => ctx.recentQuestCorrect === true && (ctx.wrongCount ?? 0) > 0,
    message:
      '你最終答對了。但注意——你之前的錯誤不是運氣，是思維模式的問題。下次遇到類似的題，試著第一次就這樣思考。',
    mood: 'thinking',
  },
];

// ── Category C: PROFILE_VOICE ───────────────────────────────────────────────

interface ProfileTemplate {
  playerType: string | null;
  moduleId?: number;
  message: string;
  mood: LuluResponse['mood'];
  hint?: string;
  followup?: string;
}

const PROFILE_VOICE_TEMPLATES: ProfileTemplate[] = [
  // Manager
  {
    playerType: 'manager',
    moduleId: 2,
    message:
      'Simon 的有限理性，在你的工作裡天天上演。你每次在時間壓力下做決定，就是在實踐「滿意化」。',
    mood: 'normal',
  },
  {
    playerType: 'manager',
    moduleId: 6,
    message:
      '代理理論對你特別切身——你同時是別人的代理人（對上司），也是別人的委託人（對下屬）。你在哪一端更費力？',
    mood: 'challenge',
    followup: '你現在最難管理的「代理問題」是什麼？',
  },
  {
    playerType: 'manager',
    message:
      '作為管理者，你思考的不只是「答案是什麼」，而是「這個概念在我的組織裡如何落地」。這才是真正的管理學習。',
    mood: 'thinking',
  },
  // Student
  {
    playerType: 'student',
    moduleId: 3,
    message:
      '影響力這門課對學生特別重要——你現在最需要說服的，可能是教授、同學、或未來的面試官。',
    mood: 'normal',
  },
  {
    playerType: 'student',
    moduleId: 1,
    message:
      '認知偏誤在考試壓力下特別容易出現。你有沒有過「感覺這個答案對，但仔細想想是錯的」的經驗？那就是系統一在作怪。',
    mood: 'challenge',
  },
  {
    playerType: 'student',
    message:
      '你還有最寶貴的資源：時間和可塑性。大多數管理者要花十年才能學到這些，你在課堂上就遇到了——關鍵是你能不能記住。',
    mood: 'excited',
  },
  // Entrepreneur
  {
    playerType: 'entrepreneur',
    moduleId: 2,
    message:
      '創業者天生就在用有限理性——資源不足、資訊不完整、時間不夠。Simon 的理論不是學術，是你每天的現實。',
    mood: 'challenge',
  },
  {
    playerType: 'entrepreneur',
    moduleId: 5,
    message:
      'Porter 的五力分析和 VRIN，對你意味著：你的商業模式是否真的難以模仿？競爭者要多久才能複製你？',
    mood: 'thinking',
    followup: '你的核心競爭優勢，現在有幾個競爭者能在一年內追上？',
  },
  {
    playerType: 'entrepreneur',
    message:
      '創業者最常死於「選擇過多」——方向太多，資源分散。Barry Schwartz 說的悖論，在創業裡更致命。',
    mood: 'warning',
    hint: '聚焦：找到你的「滿意解」，然後全力執行，而不是不停追求最優解。',
  },
  // Analyst
  {
    playerType: 'analyst',
    moduleId: 1,
    message:
      '分析師最常犯的是：用完美的數據分析，得出一個被錨定效應扭曲的結論。你的數據起點在哪裡，決定了結論在哪裡。',
    mood: 'challenge',
  },
  {
    playerType: 'analyst',
    message:
      '你的分析能力是武器，但武器需要知道指向哪裡。記住測量尺度：你用了哪種尺度，決定你能做什麼運算、得出什麼結論。',
    mood: 'thinking',
  },
  // No profile
  {
    playerType: null,
    message:
      '你還沒告訴我你的背景。不同角色的人，從這些理論裡學到的東西完全不同。',
    mood: 'normal',
    hint: '可以去個人資料設定你的角色，讓我能給你更精準的建議。',
  },
];

// ── Category D: QUEST_RECAP ─────────────────────────────────────────────────

interface RecapTemplate {
  moduleId?: number;
  condition: (ctx: LuluContext) => boolean;
  message: string;
  mood: LuluResponse['mood'];
  followup?: string;
}

const QUEST_RECAP_TEMPLATES: RecapTemplate[] = [
  // ── Module-specific review (matched when currentModuleId is set) ──
  {
    moduleId: 1,
    condition: () => true,
    message:
      '認知迷霧模組的核心是 Kahneman 的雙系統理論：系統一快速直覺、系統二緩慢理性。管理者的挑戰是知道「何時信任哪個系統」。錨定效應、代表性捷思、可得性偏誤——這三種偏誤在你的日常決策裡天天作祟。',
    mood: 'thinking',
    followup: '你最容易受哪種偏誤影響？注意力有限是前提——你把注意力花在哪裡，決定了你「看見」什麼。',
  },
  {
    moduleId: 2,
    condition: () => true,
    message:
      '決策峰頂的主角是 Herbert Simon。有限理性告訴我們：人不追求最優解，只追求「夠好的解」——這叫滿意化（Satisficing）。Barry Schwartz 的選擇悖論則說：選項越多，幸福感越低。',
    mood: 'normal',
    followup: '你上一次做重要決策，你在找「最好的答案」，還是「夠用的答案」？兩者的代價有什麼不同？',
  },
  {
    moduleId: 3,
    condition: () => true,
    message:
      '影響力廊的核心是說服理論。亞里士多德的三路徑：Logos（邏輯）、Ethos（信譽）、Pathos（情感）。Petty & Cacioppo 的精細化可能性模型（ELM）說明人在高涉入時走中央路徑，低涉入時走邊緣路徑。',
    mood: 'challenge',
    followup: '你最常用哪條說服路徑？你說服的對象目前是高涉入還是低涉入——這決定你該怎麼設計你的訊息。',
  },
  {
    moduleId: 4,
    condition: () => true,
    message:
      '群體引力模組的核心：社會資本（你認識誰，比你知道什麼更重要）、沉默螺旋（弱勢意見因害怕孤立而消失）、群體迷思（避免衝突導致從眾決策）。強連結帶來信任，弱連結帶來新資訊——兩者都需要。',
    mood: 'thinking',
    followup: '你最近一次在群體壓力下選擇了沉默？當時是什麼讓你退縮？如果重來，你會怎麼做？',
  },
  {
    moduleId: 5,
    condition: () => true,
    message:
      '策略高地模組涵蓋三個核心：公平理論（Adams, 1963）——人們比較投入與產出的比例，感到不公平時會減少付出或離職；Tuckman 群體動力五階段（形成→風暴→規範→執行→解散）；Arrow 不可能定理——選項超過三個時不存在令所有人滿意的投票系統。',
    mood: 'challenge',
    followup: '你現在帶領的團隊（或你所在的團隊）處於 Tuckman 的哪個階段？這個階段最需要什麼樣的領導策略？',
  },
  {
    moduleId: 6,
    condition: () => true,
    message:
      '組織迷宮模組的核心：委託人—代理人理論（目標不一致 + 資訊不對稱 = 代理問題，最優解是對齊利益而非單純監控）；彼得原理（人會被升遷到無法勝任的位置——解法是雙軌升遷，而非以升遷為唯一獎勵）；Web 2.0 組織（倒三角結構，讓最了解客戶的第一線員工參與策略）。',
    mood: 'thinking',
    followup: '你的組織最符合哪種結構？你見過彼得原理的真實案例嗎？代理問題在你的工作中如何顯現？',
  },
  // ── Progress-based review (matched when no moduleId specified) ──
  // All modules done
  {
    condition: (ctx) => ctx.completedModules.length >= 6,
    message:
      '你完成了所有模組。但我要警告你：知道理論，和在壓力下還能用理論，是兩回事。真正的考驗在課堂之外。',
    mood: 'thinking',
    followup: '你覺得這些理論中，哪一個你最容易忘記在真實情境裡使用？',
  },
  // Just completed M5 (策略高地)
  {
    condition: (ctx) => ctx.completedModules.includes(5) && !ctx.completedModules.includes(6),
    message:
      '策略高地通關了。公平是感覺，不是數學——今天有沒有人因為你的決定感到不公平？Tuckman 說群體需要時間成熟，不能揠苗助長。你知道你的團隊現在在哪個階段嗎？',
    mood: 'challenge',
    followup: '你見過「選項設計影響投票結果」的真實案例嗎？Arrow 的不可能定理在你的決策環境裡是什麼樣子？',
  },
  // Just completed M4 (群體引力)
  {
    condition: (ctx) => ctx.completedModules.includes(4) && !ctx.completedModules.includes(5),
    message:
      '群體引力通關了。沉默螺旋最可怕的地方是：你可能正在沉默，卻不自知。弱連結比強連結更能帶你看見新世界——你上一次主動聯繫一個不熟的業界朋友，是多久前的事？',
    mood: 'thinking',
    followup: '有沒有一個你「知道自己想說但沒說」的場合？是什麼讓你選擇沉默？如果重來你會怎麼做？',
  },
  // Just completed M3
  {
    condition: (ctx) => ctx.completedModules.includes(3) && !ctx.completedModules.includes(4),
    message:
      '影響力廊通過了。記住：說服不是技巧的問題，是理解對方的問題。你說服過最難說服的人是誰？用的是哪條路徑？',
    mood: 'challenge',
  },
  // Just completed M2
  {
    condition: (ctx) => ctx.completedModules.includes(2) && !ctx.completedModules.includes(3),
    message:
      '決策峰頂攻克了。Simon 說的有限理性不是藉口，是設計前提——承認限制，才能設計更好的決策流程。',
    mood: 'excited',
    followup: '你現在遇到需要決策的事，會先問自己「我需要最優解，還是夠好的解」嗎？',
  },
  // Just completed M1
  {
    condition: (ctx) => ctx.completedModules.includes(1) && !ctx.completedModules.includes(2),
    message:
      '霧谷清除了。你學到的是：你的大腦有兩個系統在競爭控制權。系統一快但容易被騙，系統二慢但準確。管理者的工作，是知道什麼時候信任哪一個。',
    mood: 'thinking',
    followup: '在你的日常決策裡，你有多少次是讓系統一替你做主？',
  },
  // Halfway
  {
    condition: (ctx) => ctx.completedModules.length === 3,
    message:
      '三個模組了，你在 Cognitia 的中點。現在是個好時機問問自己：你學到的這些理論，有哪一個已經改變了你看事情的方式？',
    mood: 'thinking',
    followup: '是認知偏誤、有限理性、還是影響力理論？哪一個讓你「啊，原來如此」？',
  },
  // Just started
  {
    condition: (ctx) => ctx.completedModules.length === 0,
    message:
      '你剛抵達 Cognitia。這片大陸每個區域都代表一種管理能力的試煉。從霧谷（M1）開始——那是所有後續理論的基礎。',
    mood: 'normal',
  },
];

// ── Category E: REFLECTION_FEEDBACK ────────────────────────────────────────

interface ReflectionTemplate {
  moduleId: number;
  message: string;
  mood: LuluResponse['mood'];
  followup: string;
}

const REFLECTION_TEMPLATES: ReflectionTemplate[] = [
  {
    moduleId: 1,
    message:
      '你剛才描述了自己的注意力模式。大多數人從不這樣做——他們只是隨波逐流，被演算法決定看什麼。你已經比大多數人清醒了一點。',
    mood: 'thinking',
    followup: '如果你要為自己的注意力設計一個「防火牆」，它長什麼樣子？',
  },
  {
    moduleId: 2,
    message:
      '決策的反思往往比決策本身更有價值。你剛才分析了自己的決策慣性——這需要勇氣，因為大多數人不願意承認自己「沒想清楚」。',
    mood: 'excited',
    followup: '下一次面臨重要決策，你會改變哪一個步驟？',
  },
  {
    moduleId: 3,
    message:
      '說服力的自我覺察是第一步。很多人以為說服是天賦，其實是技術——而技術可以練習。',
    mood: 'normal',
    followup: '你剛才描述的那個說服策略，如果用 Logos/Ethos/Pathos 分類，比例是什麼？',
  },
  {
    moduleId: 4,
    message:
      '組織的問題，通常不是壞人造成的，而是好人被糟糕的結構逼出來的行為。你的觀察指向結構問題，還是人的問題？',
    mood: 'challenge',
    followup: '如果你能改變你描述的那個組織裡的一個規則，你會改哪一個？',
  },
  {
    moduleId: 5,
    message:
      '動機是個人的，但管理者的工作是設計讓動機得以發揮的環境。你剛才反思的，更多是你自己的動機，還是你周圍人的動機？',
    mood: 'thinking',
    followup: '如果 Maslow 能看到你的工作環境，他會說你目前在哪個層次？',
  },
  {
    moduleId: 6,
    message:
      '策略思維的本質是取捨——你選擇做什麼，就是選擇不做什麼。你剛才的反思顯示你已經開始用策略眼光看事情了。',
    mood: 'excited',
    followup: '你最近一個「策略性放棄」是什麼？放棄了它，你得到了什麼？',
  },
];

// ── Main function ───────────────────────────────────────────────────────────

export function getLuluResponse(
  category: 'stat' | 'wrong' | 'profile' | 'recap' | 'reflection',
  ctx: LuluContext,
): LuluResponse {
  function interpolate(msg: string): string {
    const maxStat = Math.max(...Object.values(ctx.stats));
    return msg
      .replace('{value}', String(
        category === 'stat' ? maxStat : ctx.wrongCount ?? 0,
      ))
      .replace('{playerType}', ctx.playerType ?? '管理者')
      .replace('{module}', String(ctx.currentModuleId ?? ''))
      .replace('{level}', String(ctx.level));
  }

  const FALLBACKS: Record<string, LuluResponse> = {
    stat:       { message: '繼續訓練，每個 stat 都是你管理能力的一面鏡子。', mood: 'normal' },
    wrong:      { message: '再想想——答案就在你已知的知識裡。', mood: 'challenge' },
    profile:    { message: '不同背景的人，從管理理論裡學到的東西不一樣。', mood: 'normal' },
    recap:      { message: '每個模組都是一塊拼圖。繼續前進。', mood: 'excited' },
    reflection: { message: '你的反思是成長的起點。帶著這個問題繼續走。', mood: 'thinking' },
  };

  switch (category) {
    case 'stat': {
      const tpl = STAT_REACTION_TEMPLATES.find((t) => t.condition(ctx));
      if (!tpl) return FALLBACKS.stat;
      return {
        message: interpolate(tpl.message),
        mood: tpl.mood,
        hint: tpl.hint ? interpolate(tpl.hint) : undefined,
        followup: tpl.followup ? interpolate(tpl.followup) : undefined,
      };
    }

    case 'wrong': {
      const tpl = WRONG_PENALTY_TEMPLATES.find((t) => t.condition(ctx));
      if (!tpl) return FALLBACKS.wrong;
      return {
        message: interpolate(tpl.message),
        mood: tpl.mood,
        hint: tpl.hint ? interpolate(tpl.hint) : undefined,
        followup: tpl.followup ? interpolate(tpl.followup) : undefined,
      };
    }

    case 'profile': {
      // First try module-specific match, then general match
      const moduleMatch = PROFILE_VOICE_TEMPLATES.find(
        (t) => t.playerType === ctx.playerType && t.moduleId === ctx.currentModuleId,
      );
      const generalMatch = PROFILE_VOICE_TEMPLATES.find(
        (t) => t.playerType === ctx.playerType && t.moduleId === undefined,
      );
      const tpl = moduleMatch ?? generalMatch;
      if (!tpl) return FALLBACKS.profile;
      return {
        message: interpolate(tpl.message),
        mood: tpl.mood,
        hint: tpl.hint ? interpolate(tpl.hint) : undefined,
        followup: tpl.followup ? interpolate(tpl.followup) : undefined,
      };
    }

    case 'recap': {
      // Prefer module-specific template when currentModuleId is set
      const tpl = ctx.currentModuleId != null
        ? (QUEST_RECAP_TEMPLATES.find((t) => t.moduleId === ctx.currentModuleId) ??
           QUEST_RECAP_TEMPLATES.find((t) => t.moduleId == null && t.condition(ctx)))
        : QUEST_RECAP_TEMPLATES.find((t) => t.moduleId == null && t.condition(ctx));
      if (!tpl) return FALLBACKS.recap;
      return {
        message: interpolate(tpl.message),
        mood: tpl.mood,
        followup: tpl.followup ? interpolate(tpl.followup) : undefined,
      };
    }

    case 'reflection': {
      const tpl = REFLECTION_TEMPLATES.find((t) => t.moduleId === ctx.currentModuleId);
      if (!tpl) return FALLBACKS.reflection;
      return {
        message: interpolate(tpl.message),
        mood: tpl.mood,
        followup: interpolate(tpl.followup),
      };
    }
  }
}

// ── Helper: getLuluMood ─────────────────────────────────────────────────────

export function getLuluMood(ctx: LuluContext): LuluResponse['mood'] {
  if ((ctx.wrongCount ?? 0) >= 2) return 'challenge';
  if (ctx.completedModules.length >= 5) return 'excited';
  if (ctx.recentQuestCorrect === false) return 'challenge';
  if (ctx.stats.cognition > 50) return 'thinking';
  if (ctx.currentQuestType === 'boss') return 'challenge';
  if (ctx.completedModules.length >= 3) return 'thinking';
  return 'normal';
}

// ── Helper: getLuluMemoryObservations ───────────────────────────────────────

export function getLuluMemoryObservations(ctx: LuluContext): string[] {
  const obs: string[] = [];

  // Progress
  if (ctx.completedModules.length >= 6) {
    obs.push('你已完成全部六個模組——Cognitia 歷史上少數達到此里程碑的旅者。');
  } else if (ctx.completedModules.length >= 3) {
    obs.push(`你完成了 ${ctx.completedModules.length}/6 個模組，進度領先大多數學習者。`);
  } else if (ctx.completedModules.length === 1) {
    obs.push('你完成了第一個模組，認知防禦的基礎已建立。');
  } else {
    obs.push('你剛踏上 Cognitia，旅程才剛開始。');
  }

  // Stat insights
  const { cognition, decisionPower, influence, socialCapital, orgWisdom } = ctx.stats;
  const statEntries: [string, number][] = [
    ['認知力', cognition], ['決策力', decisionPower], ['影響力', influence],
    ['社會資本', socialCapital], ['組織智慧', orgWisdom],
  ];
  const highest = statEntries.reduce((a, b) => (a[1] >= b[1] ? a : b));
  const lowest  = statEntries.reduce((a, b) => (a[1] <= b[1] ? a : b));

  if (highest[1] >= 40) {
    obs.push(`你的 ${highest[0]} 特別突出（${highest[1]}）——這是你的核心優勢，也是你的認知盲點所在。`);
  }
  if (lowest[1] <= 15 && lowest[0] !== highest[0]) {
    obs.push(`${lowest[0]} 偏低（${lowest[1]}）——對應的模組值得優先完成。`);
  }

  // Cognition vs decisionPower gap
  if (cognition - decisionPower >= 20) {
    obs.push('高認知、低決策力——典型的「分析癱瘓」傾向。你看得清楚，但行動時猶豫。');
  } else if (decisionPower - cognition >= 20) {
    obs.push('決策力強、但認知力相對低——你行動果斷，但可能低估了認知偏誤對判斷的影響。');
  }

  // Wrong count
  if ((ctx.wrongCount ?? 0) >= 3) {
    obs.push(`本題已答錯 ${ctx.wrongCount} 次——直覺陷阱對你仍有效力，建議強化 System 2 思維。`);
  } else if ((ctx.wrongCount ?? 0) === 2) {
    obs.push('答錯兩次——這不是壞事，說明你在真正挑戰自己的邊界。');
  }

  // Player type specific
  if (ctx.playerType === 'manager') {
    obs.push('身為管理者，你比其他玩家更早把理論連結到真實情境——這是你的優勢。');
  } else if (ctx.playerType === 'student') {
    obs.push('學生身分給你一個罕見的機會：在沒有代價的環境裡練習高代價的決策。');
  } else if (ctx.playerType === 'entrepreneur') {
    obs.push('創業者的直覺往往比學術訓練快，但也更容易被確認偏誤強化。保持自我懷疑。');
  } else if (ctx.playerType === null) {
    obs.push('你尚未設定角色——設定後，我能給你更個性化的洞察。');
  }

  // Achievements
  if (ctx.achievements.length >= 5) {
    obs.push(`你已解鎖 ${ctx.achievements.length} 個成就——收藏癖和學習深度正相關。繼續。`);
  }

  // Level
  if (ctx.level >= 7) {
    obs.push(`Lv.${ctx.level}——你已經進入 Cognitia 的資深探索者行列。`);
  }

  // Social capital & influence gap
  if (socialCapital >= 40 && influence < 20) {
    obs.push('你建立了人脈，但尚未學會有效運用影響力——弱連結的價值還有待挖掘。');
  }

  return obs.slice(0, 5);
}

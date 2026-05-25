// Quest data types for Module 4+ (extended quest schemas)

export interface StoryQuestData {
  pages: Array<{
    title: string;
    body: string;
    visual?: string;
    mood: string;
  }>;
  xpReward?: number;
}

export interface ChoiceQuestData {
  scenario: string;
  choices: Array<{
    text: string;
    // Module 4 schema
    outcome?: string;
    xpBonus?: number;
    isOptimal?: boolean;
    // Module 5+ schema
    isCorrect?: boolean;
    feedback?: string;
  }>;
  luluComment?: string;
}

export interface SimQuestData {
  // Module 4 schema
  title?: string;
  description?: string;
  luluComment?: string;
  // Module 5+ schema
  intro?: string;
  steps: Array<{
    situation?: string;
    description?: string;
    choices: Array<{
      text: string;
      // Module 4 schema
      consequence?: string;
      isGood?: boolean;
      // Module 5+ schema
      feedback?: string;
      isOptimal?: boolean;
    }>;
  }>;
}

export interface MatchQuestData {
  title?: string;
  pairs: Array<{
    // Module 4 schema
    term?: string;
    definition?: string;
    // Module 5+ schema
    left?: string;
    right?: string;
  }>;
  xpReward?: number;
}

export interface ReflectionQuestData {
  question: string;
  // Module 4 schema
  prompt?: string;
  luluComment?: string;
  // Module 5+ schema
  placeholder?: string;
  minLength?: number;
  xpReward?: number;
}

export interface BossQuestData {
  // Module 4 schema
  bossName?: string;
  bossDescription?: string;
  scenario?: string;
  bossDefeatedMessage?: string;
  // Module 5+ schema
  intro?: string;
  choices: Array<{
    text: string;
    isCorrect: boolean;
    // Module 4 schema
    explanation?: string;
    // Module 5+ schema
    feedback?: string;
  }>;
  xpReward?: number;
}

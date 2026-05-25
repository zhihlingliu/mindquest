import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────

export interface PlayerStats {
  cognition: number;
  decisionPower: number;
  influence: number;
  socialCapital: number;
  orgWisdom: number;
}

export interface PlayerState {
  // Identity
  playerType: string | null;

  // Progression
  xp: number;
  level: number;

  // RPG stats (0–100)
  stats: PlayerStats;

  // Completion tracking
  completedModules: number[];
  completedQuests: string[];   // e.g. "m1q0", "m1q1"
  achievements: string[];

  // Map inventory
  inventory: string[];         // collected itemId list (allows duplicates)
  collectedItemIds: string[];  // instance ids of picked-up map items (prevents re-pickup)
  activeXPBoost: number;       // multiplier for next quest (1 = no boost)

  // Exploration tracking
  discoveredFragments: string[];   // theory fragment ids
  completedEncounters: string[];   // mini encounter ids
  talkedNPCs: string[];            // npc ids spoken to

  // ── Actions ──
  addXP: (amount: number) => void;
  addStats: (delta: Partial<PlayerStats>) => void;
  completeQuest: (questId: string) => void;
  completeModule: (moduleId: number) => void;
  unlockAchievement: (name: string) => void;
  setPlayerType: (type: string) => void;
  collectItem: (instanceId: string, itemId: string) => void;
  consumeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  setXPBoost: (mult: number) => void;
  discoverFragment: (id: string) => void;
  completeEncounter: (id: string) => void;
  talkToNPC: (id: string) => void;
  reset: () => void;
}

// ── Level thresholds (XP needed to reach each level) ──────────────────────

const LEVEL_THRESHOLDS = [
  0,    // Lv 1
  300,  // Lv 2
  700,  // Lv 3
  1200, // Lv 4
  1800, // Lv 5
  2600, // Lv 6
  3500, // Lv 7
  4600, // Lv 8
  6000, // Lv 9
  8000, // Lv 10
];

export const LEVEL_TITLES: Record<number, string> = {
  1: '新生 Apprentice',
  2: '見習管理者',
  3: '分析師',
  4: '決策者',
  5: '策略師',
  6: '影響者',
  7: '網絡建構者',
  8: '組織設計師',
  9: '管理哲學家',
  10: '試煉完成者',
};

function calcLevel(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 10);
}

export function xpForLevel(level: number) {
  return LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)];
}

export function xpForNextLevel(level: number) {
  return LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)];
}

// ── Initial state ──────────────────────────────────────────────────────────

const INITIAL_STATS: PlayerStats = {
  cognition: 10,
  decisionPower: 10,
  influence: 10,
  socialCapital: 10,
  orgWisdom: 10,
};

// ── Store ──────────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      playerType: null,
      xp: 0,
      level: 1,
      stats: { ...INITIAL_STATS },
      completedModules: [],
      completedQuests: [],
      achievements: [],
      inventory: [],
      collectedItemIds: [],
      activeXPBoost: 1,
      discoveredFragments: [],
      completedEncounters: [],
      talkedNPCs: [],

      addXP(amount) {
        set((s) => {
          const newXP = s.xp + amount;
          return { xp: newXP, level: calcLevel(newXP) };
        });
      },

      addStats(delta) {
        set((s) => ({
          stats: {
            cognition:     Math.min(100, s.stats.cognition     + (delta.cognition     ?? 0)),
            decisionPower: Math.min(100, s.stats.decisionPower + (delta.decisionPower ?? 0)),
            influence:     Math.min(100, s.stats.influence     + (delta.influence     ?? 0)),
            socialCapital: Math.min(100, s.stats.socialCapital + (delta.socialCapital ?? 0)),
            orgWisdom:     Math.min(100, s.stats.orgWisdom     + (delta.orgWisdom     ?? 0)),
          },
        }));
      },

      completeQuest(questId) {
        set((s) => ({
          completedQuests: s.completedQuests.includes(questId)
            ? s.completedQuests
            : [...s.completedQuests, questId],
        }));
      },

      completeModule(moduleId) {
        const MODULE_ACHIEVEMENTS: Record<number, string> = {
          1: '直覺免疫',
          2: 'Simon 滿意者',
          3: '說服建築師',
          4: '社群智者',
          5: '策略制定者',
          6: '組織解謎師',
        };
        const achievement = MODULE_ACHIEVEMENTS[moduleId];
        set((s) => ({
          completedModules: s.completedModules.includes(moduleId)
            ? s.completedModules
            : [...s.completedModules, moduleId],
          achievements: achievement && !s.achievements.includes(achievement)
            ? [...s.achievements, achievement]
            : s.achievements,
        }));
      },

      unlockAchievement(name) {
        set((s) => ({
          achievements: s.achievements.includes(name)
            ? s.achievements
            : [...s.achievements, name],
        }));
      },

      setPlayerType(type) {
        set({ playerType: type });
      },

      collectItem(instanceId, itemId) {
        set((s) => ({
          collectedItemIds: s.collectedItemIds.includes(instanceId)
            ? s.collectedItemIds
            : [...s.collectedItemIds, instanceId],
          inventory: [...s.inventory, itemId],
        }));
      },

      consumeItem(itemId) {
        set((s) => {
          const idx = s.inventory.indexOf(itemId);
          if (idx === -1) return {};
          const next = [...s.inventory];
          next.splice(idx, 1);
          return { inventory: next };
        });
      },

      hasItem(itemId) {
        return get().inventory.includes(itemId);
      },

      setXPBoost(mult) {
        set({ activeXPBoost: mult });
      },

      discoverFragment(id) {
        set((s) => ({
          discoveredFragments: s.discoveredFragments.includes(id)
            ? s.discoveredFragments
            : [...s.discoveredFragments, id],
        }));
      },

      completeEncounter(id) {
        set((s) => ({
          completedEncounters: s.completedEncounters.includes(id)
            ? s.completedEncounters
            : [...s.completedEncounters, id],
        }));
      },

      talkToNPC(id) {
        set((s) => ({
          talkedNPCs: s.talkedNPCs.includes(id)
            ? s.talkedNPCs
            : [...s.talkedNPCs, id],
        }));
      },

      reset() {
        set({
          playerType: null, xp: 0, level: 1,
          stats: { ...INITIAL_STATS },
          completedModules: [], completedQuests: [], achievements: [],
          inventory: [], collectedItemIds: [], activeXPBoost: 1,
          discoveredFragments: [], completedEncounters: [], talkedNPCs: [],
        });
      },
    }),
    {
      name: 'mq-player-v2',
    }
  )
);


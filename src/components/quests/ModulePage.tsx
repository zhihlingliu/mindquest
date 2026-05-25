'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePlayerStore, LEVEL_TITLES, xpForLevel, xpForNextLevel } from '@/store/playerStore';
import QuestLayout from './QuestLayout';
import ChoiceQuest from './ChoiceQuest';
import SimulationQuest from './SimulationQuest';
import DialogueQuest from './DialogueQuest';
import BossQuest from './BossQuest';
import StoryQuest from './StoryQuest';
import ReflectionQuest from './ReflectionQuest';
import MatchQuest from './MatchQuest';
import MultiStepSimQuest from './MultiStepSimQuest';
import type { SimStep } from './MultiStepSimQuest';
import type { ModuleQuest } from '@/data/modules/module1';
import type { ChoiceQuestProps } from './ChoiceQuest';
import type { LuluContext } from '@/lib/lulu-intelligence';
import type { SimulationQuestProps } from './SimulationQuest';
import type { DialogueQuestProps } from './DialogueQuest';
import type { BossQuestProps } from './BossQuest';
import type { StoryQuestProps } from './StoryQuest';
import type { ReflectionQuestProps } from './ReflectionQuest';
import type { MatchQuestProps } from './MatchQuest';

interface ModuleConfig {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  statsGain: Record<string, number>;
  quests: ModuleQuest[];
}

interface ModulePageProps {
  module: ModuleConfig;
  onExit?: () => void;
}

type View = 'map' | 'quest' | 'complete';

export default function ModulePage({ module, onExit }: ModulePageProps) {
  const router = useRouter();
  const store = usePlayerStore();
  const [view, setView] = useState<View>('map');
  const [activeQuestIdx, setActiveQuestIdx] = useState<number | null>(null);
  const moduleQuestIds = module.quests.map((q) => q.id);
  const completedInModule = moduleQuestIds.filter((id) =>
    store.completedQuests.includes(id)
  );
  const moduleProgress = completedInModule.length / module.quests.length;
  const moduleAlreadyDone = store.completedModules.includes(module.id);

  const MODULE_ACHIEVEMENT_MAP: Record<number, { name: string; emoji: string }> = {
    1: { name: '直覺免疫',    emoji: '🧠' },
    2: { name: 'Simon 滿意者', emoji: '⚖️' },
    3: { name: '說服建築師',  emoji: '🎭' },
    4: { name: '社群智者',    emoji: '🕸️' },
    5: { name: '策略制定者',  emoji: '🗻' },
    6: { name: '組織解謎師',  emoji: '🏛️' },
  };

  function startQuest(idx: number) {
    setActiveQuestIdx(idx);
    setView('quest');
  }

  function handleQuestComplete(xp: number) {
    const quest = module.quests[activeQuestIdx!];
    store.completeQuest(quest.id);
    store.addXP(xp);

    // Boss quest unlocks achievement
    if (quest.type === 'boss') {
      const achievement = MODULE_ACHIEVEMENT_MAP[module.id];
      if (achievement) {
        store.unlockAchievement(achievement.name);
      }
    }

    // Check if all quests done
    const newCompleted = [...store.completedQuests, quest.id];
    const allDone = moduleQuestIds.every((id) => newCompleted.includes(id));
    if (allDone && !moduleAlreadyDone) {
      store.completeModule(module.id);
      store.addStats(
        Object.fromEntries(
          Object.entries(module.statsGain).map(([k, v]) => [k, v])
        ) as Parameters<typeof store.addStats>[0]
      );
      setView('complete');
    } else {
      setView('map');
      setActiveQuestIdx(null);
    }
  }

  const xpCurrent = store.xp - xpForLevel(store.level);
  const xpNext = xpForNextLevel(store.level) - xpForLevel(store.level);

  /* ── Quest view ── */
  if (view === 'quest' && activeQuestIdx !== null) {
    const q = module.quests[activeQuestIdx];
    const luluCtx: LuluContext = {
      stats: store.stats,
      playerType: store.playerType,
      level: store.level,
      completedModules: store.completedModules,
      achievements: store.achievements,
      currentModuleId: module.id,
      currentQuestType: q.type,
    };
    return (
      <QuestLayout
        moduleName={`Module ${module.id}：${module.name}`}
        questName={q.name}
        progress={(activeQuestIdx + 1) / module.quests.length}
        currentXP={xpCurrent}
        maxXP={xpNext}
        level={store.level}
        levelTitle={LEVEL_TITLES[store.level] ?? '管理者'}
      >
        <QuestRenderer
          quest={q}
          onComplete={handleQuestComplete}
          achievement={MODULE_ACHIEVEMENT_MAP[module.id] ?? { name: '成就', emoji: '★' }}
          inventory={store.inventory}
          consumeItem={store.consumeItem}
          playerStats={store.stats as unknown as Record<string, number>}
          luluContext={luluCtx}
        />
      </QuestLayout>
    );
  }

  /* ── Module complete view ── */
  if (view === 'complete') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          style={{
            width: '100px',
            height: '100px',
            background: 'var(--accent-gold)',
            boxShadow: [
              '0 -4px 0 0 #B8860B', '4px 0 0 0 #B8860B', '0 4px 0 0 #B8860B', '-4px 0 0 0 #B8860B',
              '0 0 40px 10px rgba(255,215,0,0.45)',
            ].join(', '),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}
        >
          🏆
        </motion.div>

        <div>
          <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', letterSpacing: '3px', margin: '0 0 8px' }}>
            MODULE {module.id} COMPLETE
          </p>
          <h1 style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 'clamp(14px, 4vw, 22px)', color: 'var(--accent-gold)', margin: '0 0 8px', letterSpacing: '2px' }}>
            {module.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.7, margin: 0 }}>
            {module.subtitle} 已攻略！
          </p>
        </div>

        {/* Stat gains */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(module.statsGain).map(([stat, val]) => (
            <div key={stat} style={{ background: 'var(--bg-secondary)', padding: '10px 16px', boxShadow: pixelShadow('var(--accent-green)') }}>
              <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: 'var(--accent-green)', margin: '0 0 4px', letterSpacing: '1px' }}>
                {statLabel(stat)}
              </p>
              <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '12px', color: 'var(--accent-gold)', margin: 0 }}>
                +{val}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => onExit ? onExit() : router.push('/dashboard')}
          style={{
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '11px',
            color: '#0D1B2A',
            background: 'var(--accent-gold)',
            border: 'none',
            padding: '14px 32px',
            cursor: 'pointer',
            letterSpacing: '2px',
            boxShadow: '4px 4px 0 0 rgba(0,0,0,0.5)',
          }}
        >
          ◀ 返回地圖
        </button>
      </div>
    );
  }

  /* ── Module map view ── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '4px solid var(--accent-blue)', padding: '16px 24px' }}>
        <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', letterSpacing: '2px', margin: '0 0 4px' }}>
          MODULE {module.id}
        </p>
        <h1 style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 'clamp(12px, 3vw, 18px)', color: 'var(--accent-gold)', margin: '0 0 4px', letterSpacing: '2px' }}>
          {module.name}
        </h1>
        <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '13px', color: 'var(--text-primary)', opacity: 0.65, margin: 0 }}>
          {module.description}
        </p>
      </header>

      <main style={{ flex: 1, maxWidth: '680px', width: '100%', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', letterSpacing: '2px', margin: 0 }}>
          QUEST LOG &#9656; {completedInModule.length}/{module.quests.length} 完成
        </p>

        {module.quests.map((quest, idx) => {
          const isDone = store.completedQuests.includes(quest.id);
          const isUnlocked = idx === 0 || store.completedQuests.includes(module.quests[idx - 1].id);
          const isBoss = quest.type === 'boss';

          return (
            <motion.button
              key={quest.id}
              onClick={() => isUnlocked && !isDone && startQuest(idx)}
              whileHover={isUnlocked && !isDone ? { x: 6 } : {}}
              style={{
                textAlign: 'left',
                background: isDone ? 'rgba(76,175,80,0.1)' : isBoss ? 'rgba(255,107,107,0.06)' : 'var(--bg-secondary)',
                border: 'none',
                cursor: isUnlocked && !isDone ? 'pointer' : 'default',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: pixelShadow(
                  isDone ? 'var(--accent-green)' :
                  isBoss ? 'var(--accent-red)' :
                  isUnlocked ? 'var(--accent-blue)' : '#2D3748'
                ),
                opacity: isUnlocked ? 1 : 0.45,
                transition: 'box-shadow 0.15s ease',
              }}
            >
              <span style={{ fontSize: '22px', flexShrink: 0 }}>
                {isDone ? '✓' : isBoss ? '⚔' : QUEST_ICONS[quest.type]}
              </span>

              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                  {quest.name}
                </p>
                <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: isBoss ? 'var(--accent-red)' : 'var(--accent-blue)', margin: 0, letterSpacing: '1px' }}>
                  {isBoss ? 'BOSS' : QUEST_TYPE_LABELS[quest.type]} &#9656; {quest.xpReward} XP
                </p>
              </div>

              {isUnlocked && !isDone && (
                <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', flexShrink: 0 }}>&#9654;</span>
              )}
              {!isUnlocked && (
                <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: '#4A5568', flexShrink: 0 }}>&#128274;</span>
              )}
              {isDone && (
                <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-green)', flexShrink: 0 }}>DONE</span>
              )}
            </motion.button>
          );
        })}

        {moduleAlreadyDone && (
          <div style={{ background: 'rgba(76,175,80,0.1)', padding: '14px 20px', boxShadow: pixelShadow('var(--accent-green)'), textAlign: 'center', marginTop: '8px' }}>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: 'var(--accent-green)', margin: 0, letterSpacing: '2px' }}>
              ✓ 本模組已全部完成！
            </p>
          </div>
        )}

        <button
          onClick={() => onExit ? onExit() : router.push('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '10px',
            color: 'var(--text-primary)',
            opacity: 0.5,
            padding: '8px 0',
            textAlign: 'left',
            letterSpacing: '1px',
          }}
        >
          ◀ 返回地圖
        </button>
      </main>
    </div>
  );
}

/* ── Quest renderer ── */
function QuestRenderer({ quest, onComplete, achievement, inventory, consumeItem, playerStats, luluContext }: {
  quest: ModuleQuest;
  onComplete: (xp: number) => void;
  achievement: { name: string; emoji: string };
  inventory: string[];
  consumeItem: (itemId: string) => void;
  playerStats?: Record<string, number>;
  luluContext?: LuluContext;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = quest.data as Record<string, any>;

  switch (quest.type) {
    case 'story': {
      const pages = (data.pages as StoryQuestProps['pages']).map((p) => ({
        ...p,
        mood: normalizeMood(p.mood as string),
      }));
      return <StoryQuest pages={pages} xpReward={quest.xpReward} onComplete={onComplete} />;
    }

    case 'choice': {
      // Module 4-6 schema: has `scenario` + `choices[]`
      if ('scenario' in data) {
        const choices = data.choices as Array<{
          text: string; isOptimal?: boolean; isCorrect?: boolean;
          feedback?: string; outcome?: string;
        }>;
        const correctChoice = choices.find((c) => c.isOptimal || c.isCorrect);
        const wrongChoice = choices.find((c) => !c.isOptimal && !c.isCorrect);
        return (
          <ChoiceQuest
            question={data.scenario as string}
            options={choices.map((c) => ({
              text: c.text,
              isCorrect: !!(c.isOptimal ?? c.isCorrect),
              feedback: c.feedback ?? c.outcome,
            }))}
            xpReward={quest.xpReward}
            luluFeedback={{
              correct: correctChoice?.feedback ?? correctChoice?.outcome ?? '正確決策！',
              wrong: wrongChoice?.feedback ?? wrongChoice?.outcome ?? '再想想看。',
            }}
            hasRevealItem={inventory.includes('insight_crystal')}
            onUseRevealItem={() => consumeItem('insight_crystal')}
            playerStats={playerStats}
            luluContext={luluContext}
            onComplete={onComplete}
          />
        );
      }
      // Module 1-3 schema: has `question` + `options` + `luluFeedback`
      return (
        <ChoiceQuest
          {...(data as Omit<ChoiceQuestProps, 'onComplete'>)}
          hasRevealItem={inventory.includes('insight_crystal')}
          onUseRevealItem={() => consumeItem('insight_crystal')}
          playerStats={playerStats}
          luluContext={luluContext}
          onComplete={onComplete}
        />
      );
    }

    case 'sim': {
      // Module 4-6 schema: has `steps` array (multi-step)
      if ('steps' in data) {
        return (
          <MultiStepSimQuest
            intro={data.intro as string | undefined}
            title={data.title as string | undefined}
            description={data.description as string | undefined}
            steps={data.steps as SimStep[]}
            xpReward={quest.xpReward}
            luluComment={data.luluComment as string | undefined}
            onComplete={onComplete}
          />
        );
      }
      // Module 1-3 schema: flat scenario + choices
      return <SimulationQuest {...(data as Omit<SimulationQuestProps, 'onComplete'>)} onComplete={onComplete} />;
    }

    case 'dialogue':
      return <DialogueQuest {...(data as Omit<DialogueQuestProps, 'onComplete'>)} onComplete={onComplete} />;

    case 'boss': {
      // Module 4-6 schema: has `choices[]` with single scenario (no `questions` array)
      if ('choices' in data && !('questions' in data)) {
        const choices = data.choices as Array<{
          text: string; isCorrect: boolean; explanation?: string; feedback?: string;
        }>;
        const scenario = (data.scenario ?? data.intro ?? '') as string;
        const correctChoice = choices.find((c) => c.isCorrect);
        return (
          <BossQuest
            bossName={(data.bossName ?? '最終Boss') as string}
            achievementName={achievement.name}
            achievementEmoji={achievement.emoji}
            luluVictoryLine={(data.bossDefeatedMessage ?? '你用知識擊敗了挑戰，這就是管理者的力量！') as string}
            questions={[{
              question: scenario,
              options: choices.map((c) => ({ text: c.text, isCorrect: c.isCorrect })),
              explanation: correctChoice?.explanation ?? correctChoice?.feedback ?? '',
            }]}
            xpReward={quest.xpReward}
            hasShield={inventory.includes('cognition_shield')}
            onUseShield={() => consumeItem('cognition_shield')}
            hasFocusRune={inventory.includes('focus_rune')}
            onUseFocusRune={() => consumeItem('focus_rune')}
            onComplete={onComplete}
          />
        );
      }
      // Module 1-3 schema
      return <BossQuest {...(data as Omit<BossQuestProps, 'onComplete'>)} onComplete={onComplete} />;
    }

    case 'reflection':
      return (
        <ReflectionQuest
          question={data.question as string}
          prompt={(data.prompt ?? data.placeholder ?? '') as string}
          luluComment={(data.luluComment ?? '寫下你的想法，這就是成長的開始。') as string}
          xpReward={quest.xpReward}
          onComplete={onComplete}
        />
      );

    case 'match': {
      // Normalize pairs: module 5 uses `left`/`right`, module 4 uses `term`/`definition`
      const pairs = (data.pairs as Array<{
        term?: string; definition?: string; left?: string; right?: string;
      }>).map((p) => ({
        term: p.term ?? p.left ?? '',
        definition: p.definition ?? p.right ?? '',
      }));
      return (
        <MatchQuest
          title={(data.title ?? '概念配對') as string}
          pairs={pairs}
          xpReward={quest.xpReward}
          onComplete={onComplete}
        />
      );
    }

    default:
      return null;
  }
}

function normalizeMood(mood: string): 'normal' | 'dramatic' | 'warning' | 'success' {
  if (mood === 'warning') return 'warning';
  if (mood === 'success' || mood === 'enlightened') return 'success';
  if (mood === 'dramatic' || mood === 'tense') return 'dramatic';
  return 'normal';
}

/* ── Helpers ── */
const QUEST_ICONS: Record<string, string> = {
  choice: '❓', sim: '🌐', dialogue: '💬', boss: '⚔', drag: '🔀',
  story: '📖', reflection: '✏️', match: '🔗',
};
const QUEST_TYPE_LABELS: Record<string, string> = {
  choice: '選擇題', sim: '情境模擬', dialogue: '對話', boss: 'Boss 戰',
  drag: '拖拉排序', story: '故事', match: '配對', reflection: '反思書寫', multi: '多步模擬',
};

function pixelShadow(color: string): string {
  return ['0 -4px 0 0','4px 0 0 0','0 4px 0 0','-4px 0 0 0','4px -4px 0 0','4px 4px 0 0','-4px 4px 0 0','-4px -4px 0 0'].map(s => s + ' ' + color).join(', ');
}

function statLabel(key: string): string {
  const labels: Record<string, string> = {
    cognition: 'COGNITION', decisionPower: 'DECISION', influence: 'INFLUENCE',
    socialCapital: 'SOCIAL', orgWisdom: 'ORG WISDOM',
  };
  return labels[key] ?? key.toUpperCase();
}

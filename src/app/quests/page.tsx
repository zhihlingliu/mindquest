'use client';

import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';
import { MODULE1 } from '@/data/modules/module1';
import { MODULE2 } from '@/data/modules/module2';
import { MODULE3 } from '@/data/modules/module3';
import { MODULE4 } from '@/data/modules/module4';
import { MODULE5 } from '@/data/modules/module5';
import { MODULE6 } from '@/data/modules/module6';
import type { ModuleQuest } from '@/data/modules/module1';

const ALL_MODULES = [MODULE1, MODULE2, MODULE3, MODULE5, MODULE6, MODULE4];

const QUEST_ICONS: Record<string, string> = {
  choice: '❓', sim: '🌐', dialogue: '💬', boss: '⚔️',
  drag: '🔀', story: '📖', reflection: '✏️', match: '🔗',
};
const QUEST_TYPE_LABELS: Record<string, string> = {
  choice: '選擇題', sim: '情境模擬', dialogue: '對話任務', boss: 'BOSS',
  drag: '拖拉配對', story: '故事推進', reflection: '反思書寫', match: '概念配對',
};

interface FlatQuest {
  quest: ModuleQuest;
  moduleName: string;
  moduleId: number;
}

export default function QuestsPage() {
  const router = useRouter();
  const { completedQuests } = usePlayerStore();

  const flat: FlatQuest[] = ALL_MODULES.flatMap((mod) =>
    mod.quests.map((q) => ({ quest: q, moduleName: mod.name, moduleId: mod.id }))
  );

  const done  = flat.filter(({ quest }) => completedQuests.includes(quest.id));
  const todo  = flat.filter(({ quest }) => !completedQuests.includes(quest.id));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '4px solid var(--accent-gold)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--text-primary)', opacity: 0.55, letterSpacing: '1px', padding: 0, flexShrink: 0 }}
        >
          ← 返回學院
        </button>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', letterSpacing: '3px' }}>
          QUEST LOG
        </span>
        <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: 'var(--accent-green)', letterSpacing: '1px', marginLeft: 'auto' }}>
          {done.length} / {flat.length} 完成
        </span>
      </header>

      <main style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Completed */}
        {done.length > 0 && (
          <section>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-green)', letterSpacing: '2px', margin: '0 0 14px' }}>
              ✓ 已完成 ({done.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {done.map(({ quest, moduleName, moduleId }) => (
                <QuestRow key={quest.id} quest={quest} moduleName={moduleName} moduleId={moduleId} done />
              ))}
            </div>
          </section>
        )}

        {/* Todo */}
        {todo.length > 0 && (
          <section>
            <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', letterSpacing: '2px', margin: '0 0 14px' }}>
              ❑ 待完成 ({todo.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todo.map(({ quest, moduleName, moduleId }) => (
                <QuestRow key={quest.id} quest={quest} moduleName={moduleName} moduleId={moduleId} done={false} />
              ))}
            </div>
          </section>
        )}

        {flat.length === 0 && (
          <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', color: 'var(--text-primary)', opacity: 0.5 }}>
            尚無任務資料。
          </p>
        )}
      </main>
    </div>
  );
}

function QuestRow({ quest, moduleName, moduleId, done }: FlatQuest & { done: boolean }) {
  const isBoss = quest.type === 'boss';
  const accent = done ? 'var(--accent-green)' : isBoss ? 'var(--accent-red)' : 'var(--accent-blue)';

  return (
    <div style={{
      background: done ? 'rgba(76,175,80,0.07)' : 'var(--bg-secondary)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      boxShadow: pixelShadow(done ? 'var(--accent-green)' : isBoss ? 'var(--accent-red)' : '#4A5568'),
      opacity: done ? 0.75 : 1,
    }}>
      {/* Type icon */}
      <span style={{ fontSize: '18px', flexShrink: 0 }}>
        {done ? '✓' : QUEST_ICONS[quest.type] ?? '❓'}
      </span>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: accent, letterSpacing: '1px', flexShrink: 0 }}>
            M{moduleId} {moduleName}
          </span>
          {isBoss && (
            <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-red)', letterSpacing: '1px' }}>
              BOSS
            </span>
          )}
        </div>
        <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '3px 0 0', lineHeight: 1.3 }}>
          {quest.name}
        </p>
      </div>

      {/* Type label */}
      <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: accent, letterSpacing: '1px', flexShrink: 0 }}>
        {QUEST_TYPE_LABELS[quest.type] ?? quest.type}
      </span>

      {/* XP */}
      <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-gold)', flexShrink: 0 }}>
        {quest.xpReward} XP
      </span>
    </div>
  );
}

function pixelShadow(color: string): string {
  return [
    `0 -4px 0 0 ${color}`, `4px 0 0 0 ${color}`,
    `0 4px 0 0 ${color}`,  `-4px 0 0 0 ${color}`,
    `4px -4px 0 0 ${color}`, `4px 4px 0 0 ${color}`,
    `-4px 4px 0 0 ${color}`, `-4px -4px 0 0 ${color}`,
  ].join(', ');
}

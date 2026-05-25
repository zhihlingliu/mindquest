'use client';

import { useState } from 'react';
import ChoiceQuest from '@/components/quests/ChoiceQuest';
import DragDropQuest from '@/components/quests/DragDropQuest';
import DialogueQuest from '@/components/quests/DialogueQuest';
import SimulationQuest from '@/components/quests/SimulationQuest';
import BossQuest from '@/components/quests/BossQuest';
import StoryQuest from '@/components/quests/StoryQuest';
import ReflectionQuest from '@/components/quests/ReflectionQuest';
import MatchQuest from '@/components/quests/MatchQuest';

type QuestId = 'choice' | 'drag' | 'dialogue' | 'sim' | 'boss' | 'story' | 'reflection' | 'match';

const TABS: { id: QuestId; label: string; color: string }[] = [
  { id: 'choice',   label: 'ChoiceQuest',    color: 'var(--accent-blue)'  },
  { id: 'drag',     label: 'DragDropQuest',  color: 'var(--accent-gold)'  },
  { id: 'dialogue', label: 'DialogueQuest',  color: 'var(--accent-green)' },
  { id: 'sim',      label: 'SimulationQuest',color: 'var(--accent-red)'   },
  { id: 'boss',     label: 'BossQuest',      color: '#C084FC'             },
  { id: 'story',      label: 'StoryQuest',      color: 'var(--accent-green)' },
  { id: 'reflection', label: 'ReflectionQuest', color: '#F9A825'             },
  { id: 'match',      label: 'MatchQuest',      color: 'var(--accent-red)'   },
];

export default function TestQuestsPage() {
  const [active, setActive] = useState<QuestId>('choice');
  const [log, setLog] = useState<string[]>([]);

  function done(type: QuestId, xp: number) {
    setLog((prev) => [`[${type}] 完成，獲得 ${xp} XP`, ...prev.slice(0, 4)]);
  }

  const tab = TABS.find((t) => t.id === active)!;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '4px solid #4A5568', padding: '12px 24px' }}>
        <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-blue)', letterSpacing: '3px', margin: '0 0 12px' }}>
          QUEST TEMPLATE TEST PAGE
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                fontFamily: 'var(--font-pixel), monospace',
                fontSize: '10px',
                letterSpacing: '1px',
                color: active === t.id ? '#0D1B2A' : t.color,
                background: active === t.id ? t.color : 'transparent',
                border: 'none',
                padding: '6px 14px',
                cursor: 'pointer',
                boxShadow: `0 -2px 0 0 ${t.color}, 2px 0 0 0 ${t.color}, 0 2px 0 0 ${t.color}, -2px 0 0 0 ${t.color}`,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* XP log */}
      {log.length > 0 && (
        <div style={{ background: 'rgba(76,175,80,0.12)', padding: '8px 24px', borderBottom: '2px solid var(--accent-green)' }}>
          {log.map((l, i) => (
            <p key={i} style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '10px', color: 'var(--accent-green)', margin: '2px 0', opacity: 1 - i * 0.18 }}>
              {l}
            </p>
          ))}
        </div>
      )}

      {/* Quest area */}
      <main style={{ flex: 1, maxWidth: '680px', width: '100%', margin: '0 auto', padding: '32px 20px' }}>
        <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: '9px', color: tab.color, letterSpacing: '2px', margin: '0 0 20px' }}>
          {tab.label} — 範例
        </p>

        {active === 'choice' && (
          <ChoiceQuest
            key="choice"
            question="下列哪一項最符合「注意力的選擇性」這個概念？"
            options={[
              { text: '人類可以同時完美處理多項複雜任務。', isCorrect: false },
              { text: '人類的注意力是有限的，必須主動選擇關注的對象。', isCorrect: true },
              { text: '注意力只受外部刺激影響，無法主動控制。', isCorrect: false },
              { text: '數位工具可以完全補足人類注意力的不足。', isCorrect: false },
            ]}
            xpReward={80}
            luluFeedback={{
              correct: '完全正確！注意力的三大特性：有限性、選擇性、移動性。選擇性意味著你必須主動決定「不看什麼」。',
              wrong: '再想想——人類每次真的能同時專注在多件事上嗎？研究告訴我們：那叫做「任務切換」，不是真正的多工。',
            }}
            onComplete={(xp) => done('choice', xp)}
          />
        )}

        {active === 'drag' && (
          <DragDropQuest
            key="drag"
            instruction="請將下列四種測量尺度，拖曳到正確的說明框中。"
            items={[
              { id: 'nominal',  label: '名目尺度' },
              { id: 'ordinal',  label: '順序尺度' },
              { id: 'interval', label: '等距尺度' },
              { id: 'ratio',    label: '比率尺度' },
            ]}
            zones={[
              { id: 'z1', label: '只能分類，無順序（如性別、部門）',         acceptsId: 'nominal'  },
              { id: 'z2', label: '有順序，但間距不等（如滿意度 1–5 分）',    acceptsId: 'ordinal'  },
              { id: 'z3', label: '有等距，但無真正零點（如攝氏溫度）',       acceptsId: 'interval' },
              { id: 'z4', label: '有等距且有真正零點（如收入、年齡）',       acceptsId: 'ratio'    },
            ]}
            xpReward={100}
            onComplete={(xp) => done('drag', xp)}
          />
        )}

        {active === 'dialogue' && (
          <DialogueQuest
            key="dialogue"
            dialogues={[
              { message: '你有沒有想過——你每天做的決定，大概有多少是真正「想清楚」的？\n\n研究顯示：人一天要做 35,000 個決定，其中大多數是自動的、無意識的。', mood: 'normal' },
              {
                message: '所以，問題不是「我要不要理性決策」，而是「我知不知道自己哪裡不理性」。\n\n你覺得你最大的決策盲點是什麼？',
                mood: 'thinking',
                choice: {
                  prompt: '選一個你最認同的盲點：',
                  options: [
                    { text: '我容易被第一個聽到的數字影響（錨定偏誤）', next: 3 },
                    { text: '我傾向找支持自己想法的資訊（確認偏誤）',   next: 4 },
                  ],
                },
              },
              { message: '（這條路沒有用到）', mood: 'normal' },
              {
                message: '錨定偏誤——你看穿了自己。\n\n第一個數字之所以那麼有力量，是因為大腦用它當「基準點」，後續所有判斷都在它附近調整。\n\n解法是：在看到任何數字之前，先問自己「我認為合理的範圍是什麼？」',
                mood: 'excited',
              },
              {
                message: '確認偏誤——這是最普遍的偏誤。\n\n我們傾向於搜尋、解讀、記憶那些支持我們既有信念的資訊。這讓我們感覺「自己是對的」，但其實是在縮小視野。\n\n解法是：主動尋找「反例」——找一個會讓你的想法站不住腳的證據。',
                mood: 'excited',
              },
            ]}
            xpReward={70}
            onComplete={(xp) => done('dialogue', xp)}
          />
        )}

        {active === 'sim' && (
          <SimulationQuest
            key="sim"
            scenario="你是一家 50 人新創公司的 CEO。公司剛完成 A 輪融資，董事會要求你在三個月內讓月營收翻倍。你有三個策略可以選擇。"
            context="資源限制：你的團隊已滿載，追加人力至少需要兩個月才能到位。"
            choices={[
              {
                text: '全力衝刺現有客戶的增購（Upsell），短期增收最快。',
                outcome: '你的銷售團隊在三個月內成功讓現有客戶的平均訂單提升了 40%，達到了董事會的目標。\n\n代價：三個月後，你的團隊燃燒殆盡，有兩位核心業務離職。短期贏了，但組織出現裂縫。',
                xp: 75,
                luluComment: '短期目標達成，長期人才流失——這是很多高速成長公司共同的宿命。你的決定在財務上是對的，但有沒有想過人的成本？',
              },
              {
                text: '快速開發一個新的低價產品線，攻打更大的市場。',
                outcome: '新產品線三個月內無法完成開發，營收目標未達成。董事會對你的判斷提出質疑。\n\n但六個月後，新產品線上線，成為公司最大的收入來源。\n\n問題是：你還有機會等到六個月後嗎？',
                xp: 60,
                luluComment: '長遠來看這是對的，但管理不只是做對的決定，還要在對的時機做對的決定。時機，本身就是決策的一部分。',
              },
              {
                text: '誠實告訴董事會：三個月翻倍不現實，提出六個月的穩健成長計畫。',
                outcome: '董事會有兩位成員不滿意，但最終接受了你的計畫。\n\n六個月後，公司營收成長了 80%，團隊穩定，也贏得了董事會的長期信任。\n\n這個選擇需要勇氣，但也需要你對自己的判斷有信心。',
                xp: 90,
                luluComment: '說真話，是最難的管理決策之一。你不只在管理公司，你在管理期待。這個選擇，我給你加分。',
              },
            ]}
            onComplete={(xp) => done('sim', xp)}
          />
        )}

        {active === 'boss' && (
          <BossQuest
            key="boss"
            bossName="認知偏誤魔王 The Bias Overlord"
            achievementName="偏誤獵人"
            achievementEmoji="🏹"
            luluVictoryLine="你擊敗了認知偏誤魔王。但記住——它沒有死，它只是被你暫時壓制了。每次你在壓力下快速決策，它就會回來。"
            xpReward={150}
            questions={[
              {
                question: '「可用性啟發法」最可能導致哪種管理錯誤？',
                options: [
                  { text: '高估近期發生的事件，低估長期趨勢的重要性。', isCorrect: true },
                  { text: '過度依賴數據，忽略直覺判斷。', isCorrect: false },
                  { text: '在充分資訊下仍無法做出決定。', isCorrect: false },
                  { text: '傾向選擇最保守的選項以規避風險。', isCorrect: false },
                ],
                explanation: '可用性啟發法：大腦用「記憶中容易浮現的例子」來評估事件頻率。剛發生過的事（如裁員、爆紅）會被高估；緩慢累積的趨勢（如文化崩壞）則被低估。',
              },
              {
                question: 'Herbert Simon 的「滿意化（Satisficing）」策略，最適合哪種情境？',
                options: [
                  { text: '時間充裕、資訊完整、決策影響深遠的戰略規劃。', isCorrect: false },
                  { text: '時間有限、資訊不完整，但需要快速行動的日常決策。', isCorrect: true },
                  { text: '純粹的數學最佳化問題，有唯一正確解。', isCorrect: false },
                  { text: '只影響個人、不影響他人的私人決定。', isCorrect: false },
                ],
                explanation: '滿意化的核心邏輯：在有限理性下，尋找「夠好的解」然後停止搜尋。它最適合需要在資訊不完整和時間壓力下快速行動的情境——這幾乎是所有真實管理場景。',
              },
              {
                question: '一位主管觀察到：每次他批評員工，下次那位員工的表現就變好了。他下結論說「批評是最有效的管理工具」。這個推論犯了什麼錯？',
                options: [
                  { text: '確認偏誤——他只記住了批評有效的例子。', isCorrect: false },
                  { text: '回歸均值——表現極差後自然回歸，與批評無因果關係。', isCorrect: true },
                  { text: '錨定偏誤——他以第一次批評的效果作為基準。', isCorrect: false },
                  { text: '可用性啟發法——批評的場景比表揚更容易被記住。', isCorrect: false },
                ],
                explanation: '回歸均值：當表現處於極端（極差或極好）時，下一次自然會趨向平均——無論你做了什麼。主管把「統計必然」誤認成「管理介入的效果」，這是 Kahneman 最著名的管理案例之一。',
              },
            ]}
            onComplete={(xp) => done('boss', xp)}
          />
        )}

        {active === 'story' && (
          <StoryQuest
            key="story"
            xpReward={60}
            onComplete={(xp) => done('story', xp)}
            pages={[
              {
                title: '第一章：決策的起點',
                body: '每天早上你睜開眼睛，就已經開始做決策了。\n\n要不要按下貪睡鍵？先看手機還是先刷牙？吃什麼早餐？\n\n這些看似微不足道的選擇，其實正在塑造你是誰。',
                visual: '🌅',
                mood: 'normal',
              },
              {
                title: '決策疲勞',
                body: '問題在於——大腦的決策能量是有限的。\n\n研究指出，一個人每天要做高達 35,000 個決定。隨著決策數量累積，品質會逐漸下滑。\n\n這就是為什麼 Obama、Zuckerberg 都選擇穿一樣的衣服。',
                visual: '🧠',
                mood: 'dramatic',
              },
              {
                title: '警告：常見誤區',
                body: '很多人以為「多想一下就能做更好的決定」。\n\n但在資訊超載的狀態下，思考越多往往越焦慮，最後反而什麼都不做——這叫做分析癱瘓（Analysis Paralysis）。',
                visual: '⚠️',
                mood: 'warning',
              },
              {
                title: '解方：滿意化策略',
                body: 'Herbert Simon 提出「滿意化（Satisficing）」——\n\n不追求最完美的選項，而是找到「夠好的解」然後行動。\n\n完成永遠勝過完美。',
                visual: '✅',
                mood: 'success',
              },
            ]}
          />
        )}

        {active === 'reflection' && (
          <ReflectionQuest
            key="reflection"
            question="回想一個你最近做過的決定——你是怎麼做的？是快速直覺，還是反覆分析？結果如何？"
            prompt="試著描述那個決定的情境、你的思考過程，以及事後的感受……"
            luluComment="謝謝你願意寫下這些。注意到自己的決策模式，是改變的第一步。不管那個決定好不好，你現在能夠反思它，就已經比大多數人走得更遠了。"
            xpReward={70}
            onComplete={(xp) => done('reflection', xp)}
          />
        )}

        {active === 'match' && (
          <MatchQuest
            key="match"
            title="將下列管理學概念與正確定義配對"
            pairs={[
              { term: '系統一思考',   definition: '快速、直覺、自動化的思考模式' },
              { term: '系統二思考',   definition: '緩慢、理性、需要刻意投入的思考模式' },
              { term: '確認偏誤',     definition: '傾向尋找支持既有信念的資訊' },
              { term: '錨定效應',     definition: '決策時過度依賴第一個接收到的資訊' },
              { term: '滿意化策略',   definition: '在有限理性下尋找「夠好的解」而非最優解' },
            ]}
            xpReward={90}
            onComplete={(xp) => done('match', xp)}
          />
        )}
      </main>
    </div>
  );
}

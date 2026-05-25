import type { ModuleQuest } from './module1';

export const MODULE4 = {
  id: 6,
  name: '組織迷宮',
  subtitle: 'Organization Labyrinth',
  description: '每個組織都有看不見的規則。代理關係、彼得陷阱、倒三角革命——你準備好解開這座迷宮了嗎？',
  color: '#9C27B0',
  statsGain: { orgWisdom: 25, socialCapital: 10 },
  quests: [
    {
      id: 'm6q0',
      name: '迷宮入口',
      type: 'story',
      xpReward: 30,
      data: {
        pages: [
          {
            title: '歡迎來到組織迷宮',
            body: 'Lulu 看著你推開一扇古老的石門。\n\n「這裡，是每個組織內部真正的樣子。」\n\n牆壁上刻著三個謎題：',
            visual: '🏛️',
            mood: 'mysterious',
          },
          {
            title: '第一個謎題：信任的代價',
            body: '你委託了一個人幫你完成任務。\n\n但他有自己的利益。你有你的目標。\n\n當目標衝突時，誰會贏？\n\n——這就是「代理理論」要問你的問題。',
            visual: '🤝',
            mood: 'tense',
          },
          {
            title: '第二個謎題：升遷的詛咒',
            body: '你是公司裡最厲害的工程師。\n\n老闆決定升你為經理。\n\n恭喜？\n\n還是詛咒的開始？\n\n——彼得原理說：人會被升遷到自己無法勝任的位置。',
            visual: '📈',
            mood: 'warning',
          },
          {
            title: '第三個謎題：誰該決定策略？',
            body: '傳統組織：高層制訂策略，基層執行。\n\nWeb 2.0 組織：最了解客戶的人，應該決定策略。\n\n問題是：最了解客戶的，是誰？\n\n——是每天面對客戶的第一線員工。',
            visual: '🔄',
            mood: 'enlightened',
          },
          {
            title: 'Lulu 的提示',
            body: 'Lulu 微笑說：\n\n「組織不是機器，而是人的集合。\n\n每個人都有自己的目標、能力極限、與獨特的視角。\n\n真正的管理者，是能看懂這座迷宮的人。」',
            visual: '🧭',
            mood: 'mentor',
          },
        ],
      } satisfies import('../quest-types').StoryQuestData,
    },
    {
      id: 'm6q1',
      name: '代理困境',
      type: 'choice',
      xpReward: 60,
      data: {
        scenario: '你是一家新創公司的創辦人（委託人）。\n\n你聘了一位設計師（代理人）幫你設計 App 介面，並承諾兩週內交件。\n\n一週後，進度嚴重落後。設計師說：「素材廠商延誤了。」\n\n但你無法驗證這是否屬實。\n\n你該怎麼做？',
        choices: [
          {
            text: '加強監控：每天要求設計師提交進度報告',
            outcome: '監控成本上升，但進度變得透明。設計師感覺不被信任，效率略降。\n\n→ 代理理論告訴我們：這是「委託人監控成本」，是管理代理風險的正當工具，但過度監控可能傷害關係。',
            xpBonus: 0,
            isOptimal: false,
          },
          {
            text: '訂定懲罰條款：延誤每天扣款 5%',
            outcome: '設計師開始加班趕工，但品質略有下降。\n\n→ 這是「代理人擔保成本」，透過契約規範投機行為。有效但可能引發「只求準時不求品質」的偏差。',
            xpBonus: 0,
            isOptimal: false,
          },
          {
            text: '整合利益：提供準時完工獎金，完成後加碼合作機會',
            outcome: '設計師因看到長期合作的可能，主動加快進度，並主動溝通瓶頸。\n\n→ 這是代理理論最推薦的解法：「尋求共同目標」，以長期誘因對齊雙方利益。\n\n⭐ 代理成本最低、關係最佳。',
            xpBonus: 20,
            isOptimal: true,
          },
          {
            text: '相信對方：繼續等待，相信設計師會做到',
            outcome: '最終設計師延誤了三天。你沒有任何保障。\n\n→「用人不疑」是一種選擇，但代理理論提醒我們：害人之心不可有，防人之心不可無。',
            xpBonus: 0,
            isOptimal: false,
          },
        ],
        luluComment: '代理問題的本質是「資訊不對稱」加上「目標衝突」。最好的管理者，不是靠監控壓制代理人，而是讓代理人「願意」和你站在同一邊。',
      } satisfies import('../quest-types').ChoiceQuestData,
    },
    {
      id: 'm6q2',
      name: '彼得的電梯',
      type: 'sim',
      xpReward: 80,
      data: {
        title: '彼得原理模擬器',
        description: '你是一家科技公司的 HR 總監。請做出一系列升遷決策，看看會發生什麼結果。',
        steps: [
          {
            situation: '阿明是公司最強的前端工程師，連續三年績效 A+。\n\n他非常擅長處理細節邏輯、解 bug、優化效能。\n\n現在工程部門需要一位新主管。你打算怎麼做？',
            choices: [
              { text: '升阿明為工程主管，他最優秀應該當主管', consequence: '阿明接任主管後，發現自己要開會、協調跨部門、處理人際衝突——這些他不擅長。三個月後，他的團隊效率下降，阿明也很痛苦。', isGood: false },
              { text: '讓阿明繼續做工程師，但給他更高薪資與資深頭銜', consequence: '阿明繼續做自己最擅長的事，薪資提升反映他的貢獻。公司另外找了擅長協調的人當主管。兩人都在自己的位置發光。', isGood: true },
            ],
          },
          {
            situation: '小玲是你最好的客服人員，客戶滿意度全公司最高。\n\n現在客服部門主管離職，出缺了。\n\n你考慮升小玲為客服主管。',
            choices: [
              { text: '直接升小玲，她服務好應該能管好客服', consequence: '小玲升任主管後，從第一線退到後台管人。第一線客服變成新手，客戶滿意度下降。小玲也覺得「管人比服務客戶難多了」。', isGood: false },
              { text: '先問小玲：她想升主管嗎？還是繼續做客服？', consequence: '小玲表示她更喜歡直接服務客戶。你幫她設計了「資深客服顧問」的職位，並加薪。她繼續在第一線發光，同時指導新人。', isGood: true },
            ],
          },
          {
            situation: '結論：你觀察了這些案例後，彼得原理給你最大的啟示是什麼？',
            choices: [
              { text: '升遷是最好的獎勵方式，表現好就應該升官', consequence: '你仍然以傳統升遷邏輯管理公司。幾年後，你的組織充滿了被升到不適任位置的員工。彼得原理的詛咒應驗了。', isGood: false },
              { text: '升遷不是唯一的獎勵，應該讓人在最擅長的位置發揮', consequence: '你建立了「雙軌升遷」系統：技術軌與管理軌分開，讓每個人在適合自己的路上成長。組織效率大幅提升。\n\n⭐ 換了位置，不一定要換腦袋——重要的是讓對的人在對的位置。', isGood: true },
            ],
          },
        ],
        luluComment: '彼得原理最大的啟示不是「不要升遷」，而是「不要用升遷作為唯一的獎勵」。組織應該讓每個人在自己能力最大化的位置上貢獻。',
      } satisfies import('../quest-types').SimQuestData,
    },
    {
      id: 'm6q3',
      name: '組織詞典',
      type: 'match',
      xpReward: 50,
      data: {
        title: '配對組織理論關鍵概念',
        pairs: [
          { term: '委託人（Principal）', definition: '將工作委託給他人的一方，如雇主或買方' },
          { term: '代理人（Agent）', definition: '受委託執行工作的一方，如員工或供應商' },
          { term: '逆選擇（Adverse Selection）', definition: '因資訊不對稱，導致選到劣質代理人的風險' },
          { term: '彼得原理', definition: '人會被升遷到自己無法勝任的位置為止' },
          { term: '管理三角形', definition: '高層規劃策略、中層控制、基層執行的傳統組織結構' },
          { term: 'Web 2.0 組織', definition: '倒三角結構，由第一線員工制訂策略，高層提供支援' },
        ],
      } satisfies import('../quest-types').MatchQuestData,
    },
    {
      id: 'm6q4',
      name: '你的組織觀察',
      type: 'reflection',
      xpReward: 40,
      data: {
        question: '想想你曾經身處的組織（學校社團、打工、家庭、班級）：',
        prompt: '你有沒有見過「彼得原理」的案例？有人被升到不適合的位置，結果反而變差了？\n\n或者，你的組織比較像「管理三角形」還是「Web 2.0 倒三角」？\n\n請分享你的觀察與感受。',
        luluComment: '管理理論不是教科書裡的名詞。它們就發生在你身邊，每一天。能看見它，你就比別人多一雙眼睛。',
      } satisfies import('../quest-types').ReflectionQuestData,
    },
    {
      id: 'm6boss',
      name: '迷宮最深處',
      type: 'boss',
      xpReward: 120,
      data: {
        bossName: '組織幻象',
        bossDescription: '它看起來像一個完美運作的組織——直到你仔細看。',
        scenario: '你是一家傳統製造業的新任 CEO。\n\n公司面臨以下問題：\n\n① 業務部門（代理人）為了拿到業績獎金，開始承諾客戶不切實際的交期\n② 工廠最強的技師被升為廠長，但他完全不會管人，生產效率下降 30%\n③ 客戶需求快速變化，但所有策略都由高層制訂，第一線員工無法反映\n\n你有三個月解決這些問題。你的計畫是？',
        choices: [
          {
            text: '解法A：強化合約與監控，對業務設嚴格規範；讓技師回到基層；在公司設「客戶委員會」讓顧客參與策略',
            isCorrect: true,
            explanation: '⭐ 完美整合三個理論！\n\n① 透過契約修正代理問題（代理理論）\n② 讓人回到最適任的位置（彼得原理的解方）\n③ 讓最了解客戶的人參與策略（Web 2.0 組織）\n\n你成功解開了組織迷宮！',
          },
          {
            text: '解法B：開除業務主管，找外部顧問重新設計組織架構',
            isCorrect: false,
            explanation: '治標不治本。換人不換制度，問題會在下一個人身上重演。\n\n代理理論告訴我們：問題在制度設計，不在個人。',
          },
          {
            text: '解法C：維持現狀，相信員工會自己找到方法',
            isCorrect: false,
            explanation: '過度樂觀。沒有適當的制度設計，人的自私本能和能力限制會讓問題持續惡化。',
          },
        ],
        bossDefeatedMessage: '組織幻象碎裂了。\n\nLulu 鼓掌：「你看穿了它。\n\n真正的組織大師，不是靠權威控制，而是設計出讓每個人都能發揮最大價值的系統。\n\n恭喜你——你已經走出了組織迷宮。」',
      } satisfies import('../quest-types').BossQuestData,
    },
  ] satisfies ModuleQuest[],
} as const;

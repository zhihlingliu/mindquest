# MindQuest：管理者的試煉

> *Where Theory Becomes Mastery*

**MindQuest** 是一個以「管理理論與實務」課程為核心，結合高質感 Pixel RPG 遊戲機制打造的互動式數位教材平台。玩家不是單純閱讀教材，而是進入管理者訓練系統的角色——透過任務、互動與決策，真正內化管理學知識。

---

## 🎮 功能特色

- **Pixel World Map**：26×15 格可探索地圖，支援鍵盤方向鍵移動與碰撞偵測
- **6 大學習模組**：每個模組對應一個管理學主題，包含序章故事、互動任務與 Boss 戰
- **6 種 Quest 類型**：Story、Choice、Simulation、Match、Reflection、Boss
- **XP 升級系統**：完成任務獲得經驗值，解鎖角色屬性與成就
- **AI 導師盧哲人（Lulu）**：引導式教學、即時回饋、連結現實情境
- **玩家進度持久化**：離開後可從斷點繼續

---

## 📚 課程內容對應

| Module | 主題 | 核心理論 |
|---|---|---|
| M1 認知迷霧 | Mist Valley | Kahneman 雙系統、注意力經濟、錨定效應、選擇過載 |
| M2 決策峰頂 | Decision Peak | 有限理性、滿意化、測量尺度、回歸均值 |
| M3 影響力廊 | Influence Corridor | Narrative 敘事力、ELM 說服、Logos/Ethos/Pathos、媒體依賴 |
| M4 社群引力場 | Social Gravity Field | 社會資本、強弱連結、沉默螺旋、群體迷思 |
| M5 策略高地 | Strategic Heights | 公平理論、Tuckman 五階段、Arrow 不可能定理 |
| M6 組織迷宮 | Organization Labyrinth | 代理理論、彼得原理、Web 2.0 倒三角組織 |

---

## 🛠 技術架構

```
Next.js 15 + React 19 + TypeScript
Tailwind CSS + CSS Variables（設計 Token 系統）
Zustand（玩家狀態管理）
Framer Motion（動畫）
Press Start 2P（Pixel 字型）
```

### 專案結構

```
mindquest/
├── src/
│   ├── app/                # Next.js App Router 頁面
│   │   ├── dashboard/      # 玩家儀表板
│   │   ├── map/            # Pixel 世界地圖
│   │   ├── modules/[id]/   # 各模組入口
│   │   ├── quests/         # Quest 任務系統
│   │   ├── achievements/   # 成就頁面
│   │   ├── lulu/           # AI 導師對話
│   │   └── onboarding/     # 新手引導
│   ├── components/
│   │   ├── map/            # 地圖相關元件（GameMap、HUD、NPC 對話框）
│   │   ├── quests/         # 各 Quest 類型元件
│   │   ├── lulu/           # Lulu AI 導師元件
│   │   └── ui/             # 共用 UI 元件（PixelBox、XPBar）
│   ├── data/
│   │   ├── modules/        # 6 個模組的課程內容資料
│   │   └── map/            # 世界地圖、觸發點、道具資料
│   ├── store/
│   │   └── playerStore.ts  # Zustand 玩家狀態
│   ├── hooks/
│   │   └── useGameMap.ts   # 地圖控制 Hook
│   └── lib/
│       └── lulu-intelligence.ts  # Lulu 情緒與回饋系統
```

---

## 🚀 本地開發

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝與啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

打開瀏覽器前往 [http://localhost:3000](http://localhost:3000)

### 其他指令

```bash
npm run build    # 建置正式版本
npm run start    # 啟動正式伺服器
npm run lint     # 執行 ESLint 檢查
```

---

## 📄 License

本專案為學術用途，課程期末報告作品。

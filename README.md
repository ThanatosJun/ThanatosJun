# ThanatosJun Portfolio v2

沉浸式宇宙主題個人作品集網站，整合 AI 對話、互動名片、多空間內容管理。

## 架構概覽

```
ThanatosJun/  (v2 branch)
├── frontend/          # React SPA
├── backend/           # Express API
├── ai-service/        # FastAPI AI 服務（僅內部）
├── shared/types/      # 前後端共用 TypeScript 型別
└── docker-compose.yml
```

### 技術棧

| 層級 | 技術 |
|---|---|
| Frontend | React 19 + Vite 6 + TypeScript + Tailwind CSS v4 |
| Backend | Node.js + Express + TypeScript + better-sqlite3 |
| AI Service | Python + FastAPI + ChromaDB + Ollama |
| 認證 | JWT + httpOnly Cookie |
| 開場動畫 | GSAP + Canvas API（星空粒子）|
| Live2D | Live2D Cubism Web SDK 5-r.5 + Hiyori 角色模型（元件保留，未掛載）|
| 狀態管理 | Zustand |
| 部署 | GitHub Pages（前端靜態）+ Docker Compose（本地全棧）|

---

## 功能說明

### 沉浸式開場動畫
- Canvas 星空粒子背景，帶有閃爍與緩慢飄移效果
- 點擊後星粒加速噴射，左右幕布 GSAP 展開
- 開場期間鎖定頁面捲動，避免背景內容位移
- 開場完成後主內容淡入（Hero 各元素錯開動畫）

### 五大空間路由（HashRouter）

| 路由 | 名稱 | 說明 |
|---|---|---|
| `/` | 星夜之間 | 個人首頁（Hero、About、Projects、Showreel、Poetry）|
| `/tech-city` | 科技之都 | GitHub 公開 Repositories 列表，附語言色標與更新時間 |
| `/culture-city` | 文明之城 | 文化內容空間（Phase 2）|
| `/writing-wall` | 書寫之牆 | 文章/詩作空間（Phase 2）|
| `/travel-path` | 旅遊之路 | 旅遊記錄空間（Phase 2）|

### 星夜之間（首頁）

- **Hero**：Avatar、標語、標籤群、查看作品 / 名片按鈕
- **About**：個人簡介與興趣標籤（攝影、音樂、旅行、遊戲、創作）
- **Projects**：作品卡片 hover 顯示連結（部分支援雙連結，如 GitHub + itch.io）
- **Showreel**：影片作品展示
- **Poetry**：詩作三首，附圖與日文小標

### 個人名片 Modal（BusinessCard）
- 點擊 Hero 區「名片」按鈕開啟
- 支援 **GitHub / Instagram / Email** 三個平台切換
  - GitHub / Instagram：顯示 QR Code + 連結
  - Email：顯示地址 + 一鍵複製
- **3D 翻轉**：點擊卡片任意空白處翻面，背面顯示原始底圖
- **抽卡光效**：翻面時觸發彩虹光暈爆閃 + 斜向光條掃過卡面
- **背面螢光脈衝**：背面持續紫色霓虹邊框動畫
- **右上角放射光暈**：圖片右上角紫色光球，為名字提供背景光效
- 點擊遮罩或關閉按鈕關閉

### 星圖導覽（StarMap）
- SVG 星座線條連接五個空間節點
- 滑鼠視差效果（Parallax offset）
- 各節點縮圖 + 中日文標籤

### AI 對話（ChatPanel）
- 後端代理至 FastAPI AI 服務
- RAG 知識庫查詢 + Ollama LLM
- 串流回應（SSE）

### Navbar
- 固定頂部，捲動後毛玻璃背景
- 品牌 Logo 點擊重新播放開場動畫
- 音樂播放器整合

---

## Live2D 相關說明

### SDK 版本
- **Live2D Cubism Web SDK**：`5-r.5`（2026-04-02 發布）
- 原始 SDK 位於 `CubismSdkForWeb-5-r.5/`（main branch，不納入 v2 編譯）

### 使用的角色模型
- **模型名稱**：Hiyori
- **來源**：Live2D Cubism Web SDK 5-r.5 附帶的官方範例模型（`Samples/Resources/Hiyori/`）
- **授權**：Live2D Open Software License（詳見 SDK 內 LICENSE.md）
- **模型檔案位置**：`frontend/public/live2d/Hiyori/`

> **注意**：Live2D 元件（`Live2DCanvas.tsx`、`useLive2D.ts`）已實作完成，目前未掛載至頁面。元件支援 WebGL 渲染、Idle 動作循環、物理演算、點擊互動與 Web Speech API 日文語音朗讀。

### SDK 整合架構

```
frontend/
├── public/live2d/
│   ├── live2dcubismcore.min.js   # Cubism Core（全域載入）
│   └── Hiyori/                   # 角色模型資源
│       ├── Hiyori.model3.json
│       ├── Hiyori.moc3
│       ├── Hiyori.physics3.json
│       ├── Hiyori.pose3.json
│       ├── Hiyori.2048/
│       └── motions/
└── src/
    ├── lib/
    │   ├── live2d/               # Framework 原始碼（從 SDK 複製）
    │   ├── live2dApp.js
    │   └── live2dApp.d.ts
    └── components/live2d/
        ├── Live2DCanvas.tsx
        └── useLive2D.ts
```

---

## 本地開發

**前置條件：**
- Docker Desktop（執行中）
- Ollama（模型請參考 `.env.example`）
- 複製 `.env.example` → `.env` 並填入值

```bash
# 啟動全部服務
docker compose up
```

**純前端開發（不需 Docker）：**

```bash
cd frontend
npm install
npm run dev
```

---

## 專案結構

### Frontend (`frontend/src/`)

```
src/
├── components/
│   ├── BusinessCard/  # 個人名片 Modal（3D 翻轉、QR Code、抽卡光效）
│   ├── chat/          # AI 對話元件
│   ├── layout/        # Navbar、路由保護
│   ├── live2d/        # Live2D Canvas 與 Hook（未掛載）
│   ├── opening/       # 開場動畫
│   ├── starmap/       # 星圖導覽
│   └── ui/            # 通用 UI 元件
├── lib/
│   ├── audioManager.ts
│   ├── live2d/        # Cubism Framework 原始碼
│   ├── live2dApp.js
│   └── live2dApp.d.ts
├── pages/
│   ├── StarNight/     # 星夜之間（首頁）
│   ├── TechCity/      # 科技之都（GitHub Repos）
│   └── ...            # 其他空間（Phase 2）
├── stores/            # Zustand 狀態管理
├── styles/            # 全域 CSS
└── utils/
    ├── asset.ts       # 資源路徑輔助
    └── sseParser.ts   # SSE 串流解析
```

### Backend (`backend/src/`)

```
src/
├── routes/     # API 路由處理
├── middleware/  # 驗證、錯誤處理
├── db/          # 資料庫初始化與 migration
└── services/   # 業務邏輯服務層
```

### AI Service (`ai-service/app/`)

```
app/
├── routers/    # FastAPI 路由
├── services/   # RAG pipeline、向量庫、LLM 整合
├── models/     # Pydantic schema
└── data/       # 向量資料庫持久化
```

---

## 命名規範

| 項目 | 規範 | 範例 |
|---|---|---|
| DB 欄位 | `snake_case` | `created_at` |
| React 元件 | `PascalCase` | `ChatPanel.tsx` |
| 非元件 TS | `camelCase` | `useConversationStore.ts` |
| Python 檔 | `snake_case` | `rag_service.py` |
| Error code | `SCREAMING_SNAKE_CASE` | `ARTICLE_NOT_FOUND` |

---

## 授權聲明

- **Live2D Cubism Web SDK**：Live2D Inc. 的 Live2D Open Software License
- **Hiyori 角色模型**：Live2D Inc. 的 Live2D Open Software License（僅供開發/展示用途）
- **其他原始碼**：MIT（除另有說明外）

詳見 `CubismSdkForWeb-5-r.5/CubismSdkForWeb-5-r.5/LICENSE.md`

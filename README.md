# ThanatosJun Portfolio v2

沉浸式宇宙主題個人作品集網站，整合 Live2D 角色、AI 對話、多空間內容管理。

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
| Live2D | Live2D Cubism Web SDK 5-r.5 + Hiyori 角色模型 |
| 狀態管理 | Zustand |
| 部署 | GitHub Pages（前端靜態）+ Docker Compose（本地全棧）|

---

## 功能說明

### 沉浸式開場動畫
- Canvas 星空粒子背景，帶有閃爍與緩慢飄移效果
- 點擊後星粒加速噴射，左右幕布 GSAP 展開
- 開場完成後主內容淡入

### 五大空間路由（HashRouter）

| 路由 | 名稱 | 說明 |
|---|---|---|
| `/` | 星夜之間 | 個人首頁（Hero、About、Projects、Showreel、Poetry、Contact）|
| `/tech-city` | 科技之都 | 技術文章空間（Phase 2）|
| `/culture-city` | 文明之城 | 文化內容空間（Phase 2）|
| `/writing-wall` | 書寫之牆 | 文章/詩作空間（Phase 2）|
| `/travel-path` | 旅遊之路 | 旅遊記錄空間（Phase 2）|

### 星圖導覽（StarMap）
- SVG 星座線條連接五個空間節點
- 滑鼠視差效果（Parallax offset）
- 各節點縮圖 + 中日文標籤

### Live2D 角色系統
- **角色模型**：Hiyori（Live2D Cubism Web SDK 5-r.5 附帶範例模型）
- **渲染**：WebGL + `CubismRenderer_WebGL`，透明背景，固定右下角
- **動畫**：Idle 動作循環（共 9 組 motion3 檔案輪播）
- **物理演算**：`CubismPhysics` 頭髮/衣物模擬
- **自動眨眼**：`CubismEyeBlink`
- **呼吸動畫**：`CubismBreath`
- **降級機制**：WebGL 不支援時顯示靜態備用圖

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

### SDK 整合架構

```
frontend/
├── public/live2d/
│   ├── live2dcubismcore.min.js   # Cubism Core（全域載入）
│   └── Hiyori/                   # 角色模型資源
│       ├── Hiyori.model3.json    # 模型設定
│       ├── Hiyori.moc3           # 模型數據（二進位）
│       ├── Hiyori.physics3.json  # 物理演算設定
│       ├── Hiyori.pose3.json     # 姿勢設定
│       ├── Hiyori.2048/          # 紋理（2048px）
│       └── motions/              # 動作檔案（Idle 9 組 + TapBody 1 組）
└── src/
    ├── lib/
    │   ├── live2d/               # Framework 原始碼（從 SDK 複製，排除 tsc 編譯）
    │   ├── live2dApp.js          # Live2D 初始化、渲染迴圈、模型管理
    │   └── live2dApp.d.ts        # TypeScript 型別宣告
    └── components/live2d/
        ├── Live2DCanvas.tsx      # React 元件（canvas + fallback）
        └── useLive2D.ts          # Hook（呼叫 initLive2D，管理生命週期）
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
│   ├── chat/         # AI 對話元件
│   ├── layout/       # Navbar、路由保護、佔位元件
│   ├── live2d/       # Live2D Canvas 與 Hook
│   ├── opening/      # 開場動畫
│   ├── starmap/      # 星圖導覽
│   └── ui/           # 通用 UI 元件
├── lib/
│   ├── audioManager.ts
│   ├── live2d/       # Cubism Framework 原始碼
│   ├── live2dApp.js  # Live2D 整合實作
│   └── live2dApp.d.ts
├── pages/            # 各空間頁面
├── stores/           # Zustand 狀態管理
├── styles/           # 全域 CSS 與動畫
└── utils/
    ├── asset.ts      # 資源路徑輔助
    └── sseParser.ts  # SSE 串流解析
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

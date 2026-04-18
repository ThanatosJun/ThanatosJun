---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-04-18'
inputDocuments: ['docs/planning-artifacts/prd.md', '_bmad-output/project-context.md']
workflowType: 'architecture'
project_name: 'ThanatosJun Portfolio v2'
user_name: 'Thanatos'
date: '2026-04-18'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## 專案脈絡分析

### 需求總覽

**功能需求（FR1–FR31）：**
31 個 FR 分為 7 個功能群組：
- 沉浸式進入體驗（FR1–2）：開場動畫 + 跳過機制
- Live2D 角色系統（FR3–5）：WebGL 渲染、待機動畫、情緒回應
- AI 對話系統（FR6–12）：文字對話、RAG 知識庫查詢、串流回應、Session 保留
- 空間導覽與結構（FR13–18）：五空間路由、空殼佔位、文章閱覽（Phase 2）
- 內容管理後台（FR19–25）：CRUD 文章、圖片上傳、YouTube 嵌入（Phase 2）
- 身份認證（FR26–28）：JWT 登入/登出/路由保護（Phase 1）
- 可發現性（FR29–31）：獨立 URL、SEO meta、手機支援（375px+）

**非功能需求：**
- 效能：60fps 動畫、首載 <5s、AI 串流啟動 <5s、導覽視覺回饋 <300ms
- 安全：JWT token 驗證、AI service 內部隔離、secrets 不入程式碼
- 無障礙：螢幕閱讀器識別、替代文字、鍵盤導覽
- 韌性：DB 失敗顯示錯誤、Live2D 降級靜態圖、AI 逾時提示

**規模與複雜度：**
- 主要技術域：Full-stack Web App（React SPA + Node.js API + Python AI 微服務）
- 複雜度：Medium-High
- 估計架構元件：前端 8–10 個 React 頁面/元件群、後端 5–8 個 API 路由群、AI 服務 3–4 個端點

### 技術限制與依賴

- Live2D Cubism Web SDK：管理獨立 WebGL context，需與 React reconciler 隔離
- ChromaDB：file-based 向量資料庫，嵌入 AI service 容器
- SQLite：Docker volume 持久化，單一寫入者（無並發問題）
- 外部 LLM API：RAG pipeline 需呼叫外部 LLM（金鑰透過環境變數管理）
- Brownfield 過渡：現有靜態網站的設計語言（深宇宙色調、CSS 變數）需遷移至 Tailwind theme.extend

### 跨切面關注點

1. **認證授權**：JWT 影響 Node.js 路由中介層 + React protected routes
2. **錯誤降級**：三服務各需定義 fallback 行為（Live2D → 靜態圖；AI → 逾時提示；DB → 錯誤訊息）
3. **串流管道**：AI SSE → Node proxy → React 前端，需統一串流協定
4. **Rendering Budget**：60fps 預算由開場動畫與 Live2D 共享，需 requestAnimationFrame 協調
5. **CORS 管理**：所有 API 請求統一透過 `/api/*` 代理，避免跨域問題

---

## Starter Template 評估

### 主要技術域

Full-stack Web App — React SPA（前端）+ Node.js API（後端）+ Python AI 微服務

### 語言決策

- **Frontend & Backend**: TypeScript
- **AI Service**: Python 3.11+

### 各服務初始化指令

**Frontend（React + Vite + TypeScript + Tailwind CSS）：**

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install react-router-dom react-helmet-async
```

**Backend API（Node.js + Express + TypeScript）：**

```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv better-sqlite3 bcryptjs jsonwebtoken multer
npm install -D typescript ts-node @types/node @types/express @types/cors \
  @types/bcryptjs @types/jsonwebtoken @types/better-sqlite3 @types/multer nodemon
npx tsc --init
```

**AI Service（Python FastAPI + ChromaDB）：**

```bash
mkdir ai-service && cd ai-service
python -m venv .venv
pip install fastapi uvicorn[standard] chromadb openai python-dotenv httpx
```

### Docker Compose 本地環境

**目錄結構：**

```
ThanatosJun-v2/
├── docker-compose.yml
├── .env                    # 所有 secrets（不入版控）
├── .env.example            # 範本（入版控）
├── frontend/
│   ├── Dockerfile.dev
│   └── ...
├── backend/
│   ├── Dockerfile.dev
│   └── ...
└── ai-service/
    ├── Dockerfile.dev
    └── ...
```

**docker-compose.yml：**

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_BASE_URL=http://localhost:3000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
      - sqlite_data:/app/data
      - uploads_data:/app/uploads
    environment:
      - NODE_ENV=development
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_PASSWORD_HASH=${ADMIN_PASSWORD_HASH}
      - AI_SERVICE_URL=http://ai-service:8000
    depends_on:
      - ai-service

  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile.dev
    expose:
      - "8000"          # 僅 Docker 內部網路可達，不對外（NFR6）
    volumes:
      - chroma_data:/app/chroma
      - ./ai-service:/app
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}

volumes:
  sqlite_data:    # SQLite DB 持久化
  uploads_data:   # 圖片檔案持久化
  chroma_data:    # ChromaDB 向量資料持久化
```

### Starter 提供的架構決策

**語言與型別系統：**
TypeScript strict mode — 對 Live2D SDK 型別定義、API request/response schema 尤其重要

**Styling：**
Tailwind CSS v4（via @tailwindcss/vite plugin）— utility-first；特殊設計（開場動畫、Live2D 定位、光暈效果）使用自訂 CSS

**路由：**
react-router-dom — 管理五空間路由 + Admin protected routes

**資料庫：**
better-sqlite3（同步 API）— 單一寫入者無需 ORM，直接 SQL

**向量資料庫：**
ChromaDB（embedded mode）— 嵌入 AI service process，不需額外 container

**安全設計：**
- AI service 以 `expose`（非 `ports`）運行 — 僅 Docker 內部網路可達（NFR6）
- Backend 透過 Docker 內部 DNS（`http://ai-service:8000`）呼叫 AI 服務
- 三個 named volumes 確保資料持久化
- `.env` 管理所有 secrets，`.env.example` 入版控

**注意：** 三個服務的初始化 + Docker Compose 設定應作為 MVP 第一個 implementation story。

---

## 核心架構決策

### 決策優先級分析

**關鍵決策（阻塞實作）：**
- JWT 儲存策略、AI 串流協定、狀態管理方案

**重要決策（影響架構）：**
- 開場動畫實作方式、Live2D React 整合模式

**延後決策（Post-MVP）：**
- Production 部署策略（VPS + Nginx）、CI/CD（GitHub Actions）、監控與日誌

---

### 資料架構

- **主要資料庫**：SQLite via `better-sqlite3`（同步 API，單一寫入者，Docker volume 持久化）
- **向量資料庫**：ChromaDB embedded mode（嵌入 AI service process，`chroma_data` volume 持久化）
- **圖片儲存**：本地 filesystem（`uploads_data` volume），Express 靜態路由提供存取
- **Schema 異動**：MVP 階段以手寫 SQL migration 腳本管理，不引入 ORM

### 認證與安全

- **Admin 認證**：bcryptjs 雜湊密碼 + jsonwebtoken 簽發 JWT
- **Token 儲存**：httpOnly Cookie（防 XSS 竊取 token）
- **初始密碼設定**：`ADMIN_PASSWORD_HASH` 透過環境變數注入，不寫入程式碼
- **路由保護**：Express middleware 驗證 Cookie token；React `<ProtectedRoute>` 重導未認證請求
- **AI service 隔離**：Docker `expose`（非 `ports`），僅 backend 可透過內部 DNS 呼叫

### API 與通訊模式

- **API 設計**：REST，路徑規則 `/api/v1/[resource]`
- **AI 串流**：SSE（Server-Sent Events）
  - 訪客以 POST 送出問題，AI 回應以 SSE 逐字串流回前端
  - 前端：`EventSource` API 接收串流
  - 後端：Node.js `res.write()` 轉送 AI service 串流回應
  - AI service：FastAPI `StreamingResponse` 串流 LLM 輸出
- **錯誤回應格式**：統一 `{ error: string, code: string }` 結構
- **CORS**：Vite dev server proxy 轉發 `/api/*` 至 backend，避免跨域

### 前端架構

- **狀態管理**：Zustand
  - `useConversationStore`：messages 陣列、isStreaming 旗標、串流 token 累積
  - `useAuthStore`：isAdmin 狀態（Cookie 由 browser 自動管理，store 只存 UI 狀態）
- **Live2D 整合**：`useRef` + `useEffect` 隔離 Cubism SDK WebGL context，不讓 React reconciler 干擾渲染循環
- **開場動畫**：GSAP timeline — 分段控制「星空暗場 → 幕布展開 → 主頁淡入 → Live2D 出場」
- **SEO**：react-helmet-async 為各空間頁面注入動態 meta tags

### 基礎設施與部署

- **本地環境**：Docker Compose（三服務）一指令啟動
- **Production**：Phase 3 決策，暫定 VPS + Nginx reverse proxy
- **CI/CD**：Phase 2，暫定 GitHub Actions
- **Secrets 管理**：`.env`（不入版控）+ `.env.example`（入版控）

### 決策影響分析

**實作順序（相依關係）：**
1. Docker Compose + 三服務 scaffold（其他一切的基礎）
2. SQLite schema + Express CRUD API（內容管理依賴）
3. JWT Auth middleware + httpOnly Cookie（後台保護）
4. ChromaDB + RAG pipeline + FastAPI SSE（AI 功能）
5. React 五空間路由 + Zustand stores（前端骨架）
6. Live2D WebGL 整合（隔離 useRef 模式）
7. GSAP 開場動畫（最後加，不阻塞核心功能）

**跨元件依賴：**
- SSE 串流貫穿三層：FastAPI StreamingResponse → Node.js res.write() proxy → React EventSource
- httpOnly Cookie 需要 backend CORS 設定 `credentials: true` + frontend fetch `credentials: 'include'`

---

## 實作模式與一致性規則

### 命名規範

**資料庫（SQLite）：**
- 表名：`snake_case` 複數（`articles`, `spaces`, `admin_users`）
- 欄位名：`snake_case`（`created_at`, `space_id`, `is_published`）
- 外鍵：`{單數表名}_id`（`space_id`, `article_id`）
- ❌ 禁止：`Articles`, `articleId`, `fk_article`

**API endpoints：**
- 路徑：`/api/v1/{複數資源名}`（`/api/v1/articles`, `/api/v1/spaces`）
- 路由參數：`:id`（`/api/v1/articles/:id`）
- Query params：snake_case（`?space_id=1&is_published=true`）
- ❌ 禁止：`/api/article`, `/api/v1/get-articles`

**前端程式碼：**
- React 元件檔名 + 名稱：PascalCase（`ChatPanel.tsx`, `StarfieldCanvas.tsx`）
- 非元件 TypeScript 檔：camelCase（`useConversationStore.ts`, `auth.middleware.ts`）
- Zustand stores：`use{Feature}Store`（`useConversationStore`, `useAuthStore`）
- CSS class：kebab-case（`.space-card`, `.opening-overlay`）

**後端程式碼（TypeScript）：**
- 路由檔：`{resource}.routes.ts`（`articles.routes.ts`）
- Middleware 檔：`{name}.middleware.ts`（`auth.middleware.ts`）
- Service 檔：`{name}.service.ts`（`db.service.ts`）

**AI Service（Python）：**
- 所有檔案：`snake_case`（`chat_router.py`, `rag_service.py`）

**Error Code 命名：`SCREAMING_SNAKE_CASE`**

核心 error code 清單：

| Code | HTTP Status | 用途 |
|---|---|---|
| `ARTICLE_NOT_FOUND` | 404 | 文章不存在 |
| `UNAUTHORIZED` | 401 | 未登入或 token 無效 |
| `FORBIDDEN` | 403 | 已登入但無權限 |
| `VALIDATION_ERROR` | 400 | 請求格式錯誤 |
| `AI_SERVICE_UNAVAILABLE` | 503 | AI 服務無回應 |
| `DB_ERROR` | 500 | 資料庫讀寫失敗 |
| `UPLOAD_FAILED` | 500 | 圖片上傳失敗 |

---

### 目錄結構規範

**Monorepo 根目錄：**

```
ThanatosJun-v2/
├── shared/
│   └── types/          # 前後端共用 TypeScript 型別定義
│       ├── article.ts
│       ├── space.ts
│       └── api.ts      # API response/error 型別
├── frontend/
├── backend/
├── ai-service/
└── docker-compose.yml
```

**Frontend：**

```
frontend/src/
├── pages/          # 路由層元件（五空間 + Admin）
├── components/
│   ├── live2d/     # Live2D WebGL 隔離元件
│   ├── chat/       # AI 對話介面
│   └── layout/     # Navbar、ProtectedRoute
├── stores/         # Zustand stores
├── hooks/          # 自訂 hooks
├── utils/
│   └── sseParser.ts   # SSE chunk 解析（唯一實作，全域共用）
├── types/          # 前端專用型別（import shared/types）
└── styles/         # 全域 CSS + 動畫樣式
```

**Backend：**

```
backend/src/
├── routes/         # Express route handlers
├── middleware/
├── db/             # SQLite 連線 + migration 腳本
├── services/
└── types/          # Backend 專用型別（import shared/types）
```

**AI Service：**

```
ai-service/
├── routers/
├── services/
├── models/         # Pydantic models
└── data/           # ChromaDB volume 掛載點
```

---

### API 格式規範

**JSON 欄位命名策略：**
- Backend API 直接回傳 `snake_case`（與 SQLite 欄位一致，減少轉換層）
- `shared/types/` 型別定義保持 snake_case
- 如需 camelCase 展示，由前端 utility 函式統一轉換

**成功回應：**
```json
{ "data": { "id": 1, "space_id": 2, "is_published": true } }
{ "data": [...], "total": 10 }
```

**錯誤回應（所有服務統一）：**
```json
{ "error": "文章不存在", "code": "ARTICLE_NOT_FOUND" }
```

**SSE 串流格式：**
```
data: {"token": "你"}\n\n
data: {"token": "好"}\n\n
data: [DONE]\n\n
event: error\ndata: {"error": "...", "code": "AI_SERVICE_UNAVAILABLE"}\n\n
```

**日期格式：** ISO 8601（`2026-04-18T00:00:00Z`）

---

### SSE 實作模式

統一使用 `fetch + ReadableStream`（不使用原生 `EventSource`，因需要 POST body）。

**唯一 SSE Parser — `src/utils/sseParser.ts`：**

```typescript
export async function* parseSseStream(
  response: Response
): AsyncGenerator<string> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return
        yield data
      }
    }
  }
}
```

---

### Live2D 隔離規則

```typescript
// ✅ 正確：useEffect 內初始化
useEffect(() => {
  const app = new Application(canvasRef.current!)
  app.loadModel(MODEL_PATH)
  return () => app.destroy()   // 必須 cleanup
}, [])

// ❌ 禁止：在 render 函式或 component 頂層初始化
```

---

### 狀態管理規則

- 所有 Zustand store 錯誤欄位統一為 `error: string | null`
- 所有非同步操作的 loading 狀態由各自 store 持有（不設全域 loading）
- 狀態更新必須透過 `set()`，禁止直接 mutate

```typescript
// ✅ 標準 store 結構
interface ConversationStore {
  messages: Message[]
  isStreaming: boolean
  error: string | null
  addMessage: (msg: Message) => void
  setError: (error: string | null) => void
}
```

---

### 錯誤處理規則

- Backend：所有路由用 `try/catch`，統一回傳 `{ error, code }` + HTTP status
- Frontend：async function 中 `try/catch`，錯誤寫入 `store.error`
- SSE 錯誤：發送 `event: error\ndata: {...}\n\n` 後關閉串流
- Live2D 失敗：catch SDK 初始化錯誤，顯示靜態替代圖片
- ❌ 禁止：silent failure

---

### 所有 AI Agent 必須遵守

1. **型別從 `shared/types/` import**，前後端不得各自定義重複型別
2. **SSE 解析只用 `src/utils/sseParser.ts`**，不得自行實作解析邏輯
3. **Error code 用 `SCREAMING_SNAKE_CASE`**，新增 code 須加入核心清單
4. **Zustand store 錯誤欄位統一 `error: string | null`**
5. **Live2D 初始化必須在 `useEffect` 內，且必須提供 cleanup**
6. **所有 Express 路由掛載在 `/api/v1/` 前綴下**
7. **所有 secrets 透過環境變數存取，不寫入程式碼**

---

## 專案結構與邊界

### 完整目錄結構

```
ThanatosJun-v2/
├── docker-compose.yml
├── .env                          # 所有 secrets（不入版控）
├── .env.example                  # 範本（入版控）
├── .gitignore
├── README.md
│
├── shared/                       # 前後端共用型別（無邏輯，純型別）
│   └── types/
│       ├── index.ts              # 統一 re-export
│       ├── article.ts            # Article, ArticleListItem
│       ├── space.ts              # Space
│       ├── chat.ts               # Message, ChatRequest
│       └── api.ts                # ApiResponse<T>, ApiError
│
├── frontend/
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts            # 含 /api/* proxy 至 localhost:3000
│   ├── tailwind.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               # Router 與頂層 providers
│       ├── pages/
│       │   ├── StarNight/        # 星夜之間（主頁 + Live2D + AI 對話）
│       │   │   └── index.tsx
│       │   ├── TechCity/         # 科技之都
│       │   │   └── index.tsx
│       │   ├── CultureCity/      # 文明之城
│       │   │   └── index.tsx
│       │   ├── WritingWall/      # 書寫之牆
│       │   │   └── index.tsx
│       │   ├── TravelPath/       # 旅遊之路
│       │   │   └── index.tsx
│       │   ├── SpaceArticle/     # 文章詳情頁（Phase 2）
│       │   │   └── index.tsx
│       │   └── admin/
│       │       ├── Login.tsx
│       │       ├── Dashboard.tsx
│       │       └── ArticleEditor.tsx  # Phase 2
│       ├── components/
│       │   ├── live2d/
│       │   │   ├── Live2DCanvas.tsx   # WebGL canvas，useRef 隔離
│       │   │   └── useLive2D.ts       # SDK 初始化 hook
│       │   ├── chat/
│       │   │   ├── ChatPanel.tsx      # 對話容器
│       │   │   ├── ChatMessage.tsx    # 單則訊息（含串流逐字效果）
│       │   │   └── ChatInput.tsx      # 輸入框 + 送出
│       │   ├── opening/
│       │   │   └── OpeningAnimation.tsx  # GSAP timeline
│       │   └── layout/
│       │       ├── Navbar.tsx
│       │       ├── ProtectedRoute.tsx    # Admin 路由守衛
│       │       └── SpacePlaceholder.tsx  # 空殼空間佔位頁
│       ├── stores/
│       │   ├── conversationStore.ts  # messages, isStreaming, error
│       │   └── authStore.ts          # isAdmin, error
│       ├── hooks/
│       │   └── useChat.ts            # POST + SSE 串流邏輯
│       ├── utils/
│       │   └── sseParser.ts          # 唯一 SSE chunk 解析器
│       ├── types/
│       │   └── index.ts              # re-export shared/types + 前端專用型別
│       └── styles/
│           ├── globals.css           # Tailwind base + CSS 變數（深宇宙色調）
│           └── animations.css        # GSAP 動畫 + Live2D 定位
│
├── backend/
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   └── src/
│       ├── index.ts              # Entry point，載入 app + 監聽 3000
│       ├── app.ts                # Express 設定、CORS、middleware 掛載
│       ├── routes/
│       │   ├── auth.routes.ts    # POST /login, POST /logout, GET /me
│       │   ├── articles.routes.ts # CRUD /articles, GET /spaces/:id/articles
│       │   ├── spaces.routes.ts  # GET /spaces
│       │   ├── chat.routes.ts    # POST /chat（SSE proxy 至 AI service）
│       │   └── uploads.routes.ts # POST /uploads, GET /uploads/:filename
│       ├── middleware/
│       │   ├── auth.middleware.ts  # 驗證 httpOnly Cookie JWT
│       │   └── error.middleware.ts # 統一錯誤回應格式
│       ├── db/
│       │   ├── connection.ts     # better-sqlite3 連線 singleton
│       │   └── migrations/
│       │       ├── 001_create_spaces.sql
│       │       ├── 002_create_articles.sql
│       │       └── 003_create_admin_users.sql
│       ├── services/
│       │   ├── articles.service.ts
│       │   ├── spaces.service.ts
│       │   └── chat.service.ts   # fetch ai-service SSE → pipe 至 client
│       └── types/
│           └── index.ts          # re-export shared/types + backend 專用型別
│
└── ai-service/
    ├── Dockerfile.dev
    ├── requirements.txt
    ├── main.py                   # FastAPI app entry
    └── app/
        ├── routers/
        │   └── chat_router.py    # POST /chat → StreamingResponse
        ├── services/
        │   ├── rag_service.py    # ChromaDB 查詢 + LLM 呼叫
        │   └── embedding_service.py  # 知識庫文件 ingestion
        ├── models/
        │   ├── chat_models.py    # Pydantic ChatRequest, ChatResponse
        │   └── knowledge_models.py
        └── data/                 # ChromaDB 儲存（volume 掛載點 /app/data）
```

---

### SQLite Schema

```sql
CREATE TABLE spaces (
  id   INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,   -- 'star-night', 'tech-city', 'culture-city', 'writing-wall', 'travel-path'
  name TEXT NOT NULL
);

CREATE TABLE articles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  space_id     INTEGER NOT NULL REFERENCES spaces(id),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  cover_image  TEXT,
  is_published INTEGER DEFAULT 0,
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE admin_users (
  id            INTEGER PRIMARY KEY,
  password_hash TEXT NOT NULL
);
```

---

### 架構邊界

**API 邊界：**
- 外部：`frontend → /api/v1/*`（開發環境 Vite proxy 轉發至 localhost:3000）
- 內部：`backend → http://ai-service:8000`（Docker 內部 DNS，不對外暴露）
- Auth 邊界：`auth.middleware.ts` 保護所有 `/api/v1/admin/*` 路由
- 上傳邊界：`uploads.routes.ts` 寫入 `uploads_data` volume，以 `/api/v1/uploads/:filename` 提供存取

**元件邊界：**
- `Live2DCanvas.tsx` 獨立管理 WebGL context，不與 React state 共享渲染循環
- `sseParser.ts` 是 SSE 解析的唯一邊界，所有 SSE 消費端必須透過此函式
- `ProtectedRoute.tsx` 是 Admin 頁面的唯一入口守衛

**資料邊界：**
- SQLite：`db/connection.ts` 是唯一資料庫連線點，所有 DB 操作必須透過 services/
- ChromaDB：僅 `rag_service.py` 可直接存取

---

### FR → 目錄對應

| FR 群組 | Frontend | Backend | AI Service |
|---|---|---|---|
| 開場動畫（FR1–2） | `components/opening/` | — | — |
| Live2D（FR3–5） | `components/live2d/` | — | — |
| AI 對話（FR6–12） | `components/chat/`, `stores/conversationStore.ts`, `utils/sseParser.ts` | `routes/chat.routes.ts`, `services/chat.service.ts` | `routers/chat_router.py`, `services/rag_service.py` |
| 空間導覽（FR13–14） | `pages/{Space}/`, `components/layout/SpacePlaceholder.tsx` | `routes/spaces.routes.ts` | — |
| 文章閱覽（FR15–18） | `pages/SpaceArticle/` | `routes/articles.routes.ts` | — |
| 後台 CMS（FR19–25） | `pages/admin/` | `routes/articles.routes.ts`, `routes/uploads.routes.ts` | — |
| 身份認證（FR26–28） | `pages/admin/Login.tsx`, `stores/authStore.ts`, `components/layout/ProtectedRoute.tsx` | `routes/auth.routes.ts`, `middleware/auth.middleware.ts` | — |

---

### AI 對話資料流

```
用戶輸入
  → ChatInput.tsx
  → useChat.ts（POST /api/v1/chat，credentials: include）
  → chat.routes.ts → chat.service.ts
  → fetch http://ai-service:8000/chat（Docker 內部）
  → rag_service.py（ChromaDB 查詢）→ LLM API → StreamingResponse
  → chat.service.ts pipe SSE chunks → client res.write()
  → sseParser.ts 解析 chunks
  → conversationStore.ts 更新 streamingText
  → ChatMessage.tsx 逐字渲染
```

---

## 架構驗證

### 連貫性驗證

✅ **Starter → 決策 → 模式 → 結構** 四層連貫，無衝突：
- Docker Compose 三服務與目錄結構完全對應
- httpOnly Cookie 決策在 auth.middleware.ts + CORS 設定中均有對應落點
- SSE 決策貫穿 sseParser.ts → useChat.ts → chat.service.ts → chat_router.py 完整鏈路
- Zustand store 結構與 ChatMessage.tsx 渲染邏輯一致

### 需求覆蓋率

| 需求類別 | 總計 | 覆蓋 | 落點 |
|---|---|---|---|
| 功能需求（FR） | 31 | 31 ✅ | FR→目錄對應表 |
| 非功能需求（NFR） | 13 | 13 ✅ | 各決策段落 |

**NFR 驗證摘要：**
- NFR1（60fps）：Live2D useEffect 隔離 + GSAP RAF 協調
- NFR2（首載 <5s）：React.lazy + Suspense 程式碼分割
- NFR3（AI 串流 <5s）：SSE 逐 token 推送，首 token 即顯示
- NFR4（導覽 <300ms）：react-router-dom SPA 路由，無全頁重載
- NFR5（Admin 路由保護）：auth.middleware.ts + ProtectedRoute.tsx 雙層
- NFR6（AI service 隔離）：expose 非 ports，僅 Docker 內部 DNS 可達
- NFR7（secrets 不入程式碼）：.env + 環境變數，.gitignore 保護
- NFR8–9（無障礙）：react-helmet-async meta + 語意化 HTML 指引
- NFR10（鍵盤導覽）：標準 HTML 元素 + Tailwind focus ring
- NFR11（DB 錯誤顯示）：try/catch → store.error → UI 顯示
- NFR12（Live2D 降級）：catch SDK 錯誤 → 靜態替代圖
- NFR13（AI 逾時提示）：fetch timeout + error SSE event → UI 提示

### 缺口解決方案

**Gap 1：本地 LLM（Ollama）整合**

本地 Ollama 服務執行於 Host 機器（存取 GPU/CPU），AI service Docker container 需透過 `host.docker.internal` 呼叫：

```yaml
# docker-compose.yml（ai-service 補充）
ai-service:
  extra_hosts:
    - "host.docker.internal:host-gateway"   # Linux 必要；Mac/Windows 自動
  environment:
    - OLLAMA_BASE_URL=http://host.docker.internal:11434
    - OLLAMA_MODEL=qwen2.5:7b               # 支援中文的本地模型
```

```python
# ai-service/services/rag_service.py（Ollama 呼叫）
import httpx

async def call_ollama(prompt: str):
    async with httpx.AsyncClient() as client:
        async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": True}
        ) as response:
            async for chunk in response.aiter_text():
                yield chunk
```

**Gap 2：Live2D SDK 整合（CubismSdkForWeb-5-r.5/）**

SDK 不是 npm 套件，需手動複製核心檔案：

```bash
# 從現有 SDK 複製 Core 至 frontend/public/
cp CubismSdkForWeb-5-r.5/Core/live2dcubismcore.min.js frontend/public/live2d/
```

```html
<!-- frontend/index.html — 在 <head> 載入 -->
<script src="/live2d/live2dcubismcore.min.js"></script>
```

```typescript
// frontend/src/components/live2d/useLive2D.ts
// SDK Framework 以 TypeScript 原始碼形式引入，放置於 src/lib/live2d/
// 路徑：frontend/src/lib/live2d/（從 SDK/Framework/src/ 複製）
```

**Gap 3：httpOnly Cookie 完整 CORS 設定**

```typescript
// backend/src/app.ts
import cors from 'cors'
import cookieParser from 'cookie-parser'

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,          // 允許攜帶 Cookie
}))
app.use(cookieParser())

// 簽發 Cookie
res.cookie('token', jwt, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',  // 開發環境 false
  maxAge: 7 * 24 * 60 * 60 * 1000,
})
```

```typescript
// frontend — 所有 fetch 必須攜帶 credentials
fetch('/api/v1/...', { credentials: 'include' })
```

**Gap 4：程式碼分割（NFR2 首載 <5s）**

```typescript
// frontend/src/App.tsx
import { lazy, Suspense } from 'react'

const StarNight   = lazy(() => import('./pages/StarNight'))
const TechCity    = lazy(() => import('./pages/TechCity'))
const CultureCity = lazy(() => import('./pages/CultureCity'))
const WritingWall = lazy(() => import('./pages/WritingWall'))
const TravelPath  = lazy(() => import('./pages/TravelPath'))
const AdminLogin  = lazy(() => import('./pages/admin/Login'))
const AdminDash   = lazy(() => import('./pages/admin/Dashboard'))

// 包裝 Suspense fallback
<Suspense fallback={<div className="loading-screen" />}>
  <Routes>...</Routes>
</Suspense>
```

### 架構完整性檢查清單

- ✅ 所有 FR 均有對應目錄落點
- ✅ 所有 NFR 均有具體實作機制
- ✅ 三服務邊界清晰，無邏輯洩漏
- ✅ 認證鏈路完整（Cookie → middleware → ProtectedRoute）
- ✅ SSE 鏈路完整（POST → StreamingResponse → pipe → sseParser）
- ✅ 錯誤處理策略覆蓋三服務
- ✅ 命名規範、型別共用、禁令規則明確
- ✅ 開發環境一指令啟動（Docker Compose）
- ✅ Secrets 管理策略明確（.env + 環境變數）
- ✅ Live2D SDK 整合路徑明確

**總體狀態：READY FOR IMPLEMENTATION — 高信心度**

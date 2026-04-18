---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
status: complete
completedAt: '2026-04-18'
inputDocuments: ['_bmad-output/project-context.md', 'CLAUDE.md']
workflowType: 'prd'
projectType: 'brownfield'
classification:
  projectType: web_app
  domain: general_creative_personal_platform
  complexity: medium
  projectContext: brownfield
  infrastructure:
    local: docker-compose (frontend Vite:5173, backend Node:3000, ai Python:8000)
    production: TBD (VPS + Nginx)
    database: SQLite (Docker volume) + ChromaDB (Docker volume, AI service)
---

# Product Requirements Document — ThanatosJun Portfolio v2

**Author:** Thanatos
**Date:** 2026-04-17

> Brownfield 重構：現有靜態作品集 → 沉浸式全端個人數位宇宙。

---

## Executive Summary

ThanatosJun Portfolio v2 將現有靜態個人作品集重構為**沉浸式個人數位宇宙**的全端 Web App。訪客進入的不是展示頁面，而是 Thanatos 的世界——透過五個各有特色的空間，從技術觀點、文化品味、個人創作、旅遊紀錄多個維度完整認識這個人。網站同時作為 Thanatos 記錄自我成長的個人平台。

**Target Users:** 對 Thanatos 有興趣的人（潛在合作者、閱讀者、追蹤者）；Thanatos 本人（內容創作與管理）。

**Core Problem:** 傳統作品集是靜態單向展示，無法傳遞個人溫度與多元面向；社群媒體過於碎片化，無法形成完整個人品牌形象。

### What Makes This Special

**Live2D 數位分身 + AI 對話：** 訪客透過口語對話認識 Thanatos，了解他的作品與思想——不是查詢系統，而是像在與人交流。未來加入好感度機制，隨互動深度調整語氣，把「看作品集」轉化為「認識一個人」。

**五空間世界觀架構：**
- **星夜之間**（主頁）— 個人形象入口，Live2D 數位分身常駐於此
- **科技之都** — 對新技術的理解與學習筆記
- **文明之城** — 小說、影劇等作品的觀後感與評論
- **書寫之牆** — 個人文字創作
- **旅遊之路** — 旅遊記錄與紀行

訪客從星夜之間出發，根據興趣進入各個空間，每個空間呈現不同面向的 Thanatos。

**Core Insight:** 個人品牌不該是靜態簡歷，而是一個有溫度、持續生長的數位存在。

## Project Classification

- **Type:** Web App — React SPA，全端
- **Domain:** General / Creative Personal Platform
- **Complexity:** Medium（Live2D、AI/RAG、後台 CMS、Docker）
- **Context:** Brownfield — 現有靜態作品集 → 全端重構
- **Infrastructure（MVP）:** docker-compose 本地（Vite + Node.js + Python FastAPI）+ SQLite + ChromaDB（全本地，無雲端依賴）

---

## Success Criteria

### User Success
- 訪客從星夜之間順利導覽至五個空間中任一個
- 訪客與 Live2D 角色完成至少一次完整的 AI 對話互動

### Business Success
- 後台可在不碰程式碼的情況下新增、編輯、刪除各空間文章
- 文章編輯器支援圖片上傳與 YouTube 連結嵌入

### Technical Success
- 開場動畫流暢，具備明顯動態感（60fps）
- AI 對話功能正常運作（有回應，無長時間無反應）
- Docker Compose 本地環境一鍵啟動三個服務

### MVP Measurable Outcome
- 開場動畫 + 星夜之間主頁 + Live2D + AI 對話可在本地正常運行

---

## Product Scope & Phased Development

### MVP Strategy
**Approach:** Experience MVP — 驗證「個人網站角色化」核心體驗是否成立
**Resource:** 單一開發者（Thanatos 本人）

### Phase 1 — MVP

**Core User Journeys:** Journey 1（訪客初次探索）、Journey 2（空殼空間）

**Must-Have Capabilities:**
- 開場動畫（星空幕布開門效果）
- 星夜之間主頁（Live2D 模板角色常駐 + AI/RAG 對話）
- 五空間基礎導覽架構（其餘四個空間為空殼 + 佔位提示）
- docker-compose 本地環境（Vite + Node.js + Python FastAPI）
- SQLite（內容資料庫）+ ChromaDB（向量資料庫）+ JWT Auth（單一管理員）

### Phase 2 — Growth（Post-MVP）
- 科技之都、文明之城、書寫之牆、旅遊之路 完整內容系統
- 後台 CMS（富文字編輯器 + 圖片上傳 + YouTube 嵌入）
- Firebase Auth 後台登入
- GitHub CICD 自動部署

### Phase 3 — Vision（Future）
- 好感度系統（訪客登入 + 語氣切換）
- 多用戶後台支援
- 自製 Live2D 角色替換模板
- 生產環境部署（VPS + Nginx）

### Risk Mitigation

| 風險 | 緩解策略 |
|---|---|
| Live2D SDK 整合複雜 | 先用官方範例模板，確認渲染流程後再優化 |
| AI/RAG 回應品質 | MVP 手動整理 10–20 條個人資訊與作品摘要作知識庫 |
| Docker 多服務協調 | 先讓三服務各自跑通，再整合 docker-compose |
| 單人開發資源限制 | MVP 嚴格限縮於星夜之間主頁，避免範圍蔓延 |
| Live2D 整合卡關 | 降級至靜態圖片 + CSS 動畫，不阻塞 AI 對話開發 |

---

## User Journeys

### Journey 1：訪客 — 初次探索（Success Path）

**角色：** Kai，設計師，聽朋友提起 Thanatos，想了解這個人。

**Opening Scene：** Kai 打開連結，螢幕出現星空——兩扇星幕從中間展開，露出背後的星夜之間。Live2D 角色站在畫面一側輕輕動了一下。Kai 愣了一秒：「這不太像一般的作品集。」

**Rising Action：** Kai 問角色：「你是誰？」角色以口語回應，介紹 Thanatos 同時喜歡寫程式和看小說，並提到文明之城有最近的觀後感。Kai 點進去，意外發現 Thanatos 看過同一部劇，繼續讀下去。

**Climax：** Kai 回到星夜之間繼續對話，角色的回應帶著一點個性，不像冰冷查詢系統。

**Resolution：** Kai 對 Thanatos 有了立體印象——不只是技術人，也是有文化品味的人。存進書籤。

**需求揭示：** 開場動畫、Live2D 常駐、AI 自然對話、五空間導覽、文章瀏覽

---

### Journey 2：訪客 — 邊緣情境（空殼空間）

Kai 點進科技之都，空間有明確的「建設中」佔位提示，不出現 404 錯誤，不影響主頁體驗。

**需求揭示：** 空殼空間佔位提示

---

### Journey 3：Thanatos — 後台內容管理（Admin Path）

**角色：** Thanatos 剛讀完一部小說，想在文明之城新增觀後感。

**Opening Scene：** 進入後台登入頁，Firebase Auth 登入，進入管理介面。

**Rising Action：** 選擇「文明之城」→「新增文章」，輸入標題與正文，插入截圖，嵌入 YouTube 連結。

**Climax：** 按下發布，文章立即出現在文明之城列表。切換至前台確認排版正常。

**Resolution：** 全程不碰程式碼，5 分鐘內完成發布。

**需求揭示：** Firebase Auth 後台登入、富文字 CMS（圖片 + YouTube）、即時發布、前後台同步

---

### Journey Requirements Summary

| 能力 | 來源 |
|---|---|
| 開場動畫（星空開門） | J1 |
| Live2D 角色常駐 + AI 對話 | J1 |
| 五空間基礎導覽架構 | J1 |
| 文章瀏覽頁 | J1 |
| 空殼空間佔位提示 | J2 |
| Firebase Auth 後台登入 | J3 |
| 富文字 CMS（圖片 + YouTube） | J3 |
| 前後台內容即時同步 | J3 |

---

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. 個人網站角色化（Portfolio as Character Experience）**
Live2D 角色 + AI/RAG 作為訪客認識網站主人的主要入口——把「看作品集」重新定義為「與人對話」。目前主流個人網站無此設計。

**2. 好感度機制（Affinity System）**（Phase 3）
遊戲中的好感度系統移植至個人品牌網站，隨互動深度改變角色語氣。「關係型個人品牌」概念，個人網站領域尚無先例。

**3. 五空間世界觀架構**
地理/城市隱喻取代傳統導覽列，讓訪客「探索世界」而非「瀏覽分類」，強化沉浸感與品牌一致性。

### Validation Approach
- MVP 核心驗證：AI 對話是否讓訪客感覺「像在認識一個人」
- 指標：訪客與 Live2D 的平均對話輪次（目標：> 3 輪）

### Innovation Risk Mitigation
- AI 回應品質 → MVP 先手動整理知識庫，確保對話有意義
- Live2D 模板模型 → 先驗證互動體驗，角色設計後補

---

## Web App Technical Requirements

### Architecture Overview

React SPA（Vite + Tailwind CSS），三個後端服務以 docker-compose 在本地運行，管理員後台為同一 SPA 的受保護路由。

| 服務 | 技術 | Port |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | 5173 |
| Backend API | Node.js（Express/Fastify） | 3000 |
| AI Service | Python FastAPI | 8000 |
| Database | SQLite（Docker volume） | — |
| Vector DB | ChromaDB（Docker volume，AI service 內） | — |
| File Storage | 本地 filesystem（Docker volume） | — |

### Browser Support

| 瀏覽器 | 支援 |
|---|---|
| Chrome / Edge（最新版） | ✅ |
| Firefox（最新版） | ✅ |
| Safari（最新版） | ✅ |
| IE / 舊版 | ❌ |

### Responsive Design
- 桌面優先；斷點：`≥1024px` / `768–1023px` / `<768px`
- Live2D 角色手機版縮小或移至固定角落
- 開場動畫手機版需維持流暢

### SEO Strategy
- **react-helmet-async** 為各頁面注入動態 meta tags（title、description、og:image）
- 各空間文章頁具備獨立 URL
- 未來 SEO 需求提升時評估遷移 Next.js（SSR）

### CSS Strategy
- **Tailwind CSS** 為基底（utility-first）
- 特殊設計（開場動畫、星空、Live2D 定位、光暈）使用自訂 CSS
- 主題色彩透過 Tailwind `theme.extend` 統一定義

### Implementation Constraints
- API 請求統一透過 `/api/*` 代理至 Node.js，避免 CORS
- AI 服務 API 不對外公開，僅接受來自主 API 服務的內部請求
- SQLite 作為主要內容資料庫；ChromaDB 作為 RAG 向量儲存；圖片儲存於 Docker volume 本地 filesystem

---

## Functional Requirements

### 沉浸式進入體驗
- **FR1:** 訪客可在首次載入時看到動態開場動畫
- **FR2:** 訪客可跳過開場動畫直接進入主頁

### Live2D 角色系統
- **FR3:** 訪客可在星夜之間主頁看到持續渲染的 Live2D 角色
- **FR4:** Live2D 角色在無互動時持續播放待機動畫
- **FR5:** Live2D 角色在 AI 對話過程中有對應表情或動作回應

### AI 對話系統
- **FR6:** 訪客可透過文字輸入框與 Live2D 角色開始對話
- **FR7:** 訪客可詢問 Thanatos 個人資訊相關問題
- **FR8:** 訪客可詢問 Thanatos 作品、筆記相關問題
- **FR9:** 訪客可接收到字數不超過 150 字、以第一人稱口語體撰寫的 AI 回應
- **FR10:** AI 角色從個人知識庫（RAG）檢索答案
- **FR11:** 訪客在 AI 生成期間可看到思考中提示動畫
- **FR12:** 對話歷程在同一瀏覽 session 中保留

### 空間導覽與結構
- **FR13:** 訪客可從星夜之間導覽至五個空間中任一個
- **FR14:** 訪客進入尚無內容的空間時可看到「建設中」佔位提示
- **FR15:** 訪客可在各空間瀏覽文章列表（Phase 2）
- **FR16:** 訪客可閱讀個別文章完整內容（Phase 2）
- **FR17:** 訪客可瀏覽文章中的圖片（Phase 2）
- **FR18:** 訪客可播放文章中嵌入的 YouTube 影片（Phase 2）

### 內容管理後台
- **FR19:** 管理員可在任一空間新增文章（Phase 2）
- **FR20:** 管理員可編輯已發布的文章（Phase 2）
- **FR21:** 管理員可刪除文章（Phase 2）
- **FR22:** 管理員可上傳圖片並附加至文章（Phase 2）
- **FR23:** 管理員可在文章中嵌入 YouTube 連結（Phase 2）
- **FR24:** 管理員可發布或取消發布文章（Phase 2）
- **FR25:** 管理員可更新 AI 知識庫內容（Phase 2）

### 身份認證
- **FR26:** 管理員可透過帳號密碼登入後台（Phase 1）
- **FR27:** 管理員可登出後台（Phase 1）
- **FR28:** 未認證使用者嘗試存取後台時，系統將請求重導至登入頁（Phase 1）

### 可發現性與呈現
- **FR29:** 各空間文章頁具有獨立 URL
- **FR30:** 各頁面具有對應的 SEO meta tags（title、description、og:image）
- **FR31:** 訪客可在螢幕寬度 375px 以上的手機裝置上完成主要操作（空間導覽、文章閱讀、AI 對話輸入）

---

## Non-Functional Requirements

### Performance
- **NFR1:** 開場動畫維持 60fps，無明顯卡頓或掉幀
- **NFR2:** 星夜之間主頁（含 Live2D）首次載入完成時間 < 5 秒（本地開發環境）
- **NFR3:** AI 對話回應開始串流等待時間 < 5 秒；「思考中」動畫延遲 < 0.5 秒
- **NFR4:** 頁面切換（空間導覽）視覺回饋 < 300ms

### Security
- **NFR5:** 後台管理路由驗證認證 token，未認證請求重導至登入頁
- **NFR6:** AI 服務 API 不對外公開，僅接受來自主 API 服務的內部請求
- **NFR7:** 所有外部服務認證資訊與金鑰不得寫入原始碼或版本控制系統

### Accessibility
- **NFR8:** 螢幕閱讀器可正確識別並宣讀主要導覽與內容區域
- **NFR9:** 所有圖片具備描述性替代文字，供螢幕閱讀器使用
- **NFR10:** 基本鍵盤導覽可操作主要功能（導覽列、對話輸入）

### Integration Resilience
- **NFR11:** 資料庫讀寫失敗時，介面顯示明確錯誤訊息，不靜默失敗
- **NFR12:** Live2D Cubism SDK 載入失敗時，頁面降級至靜態圖片，不中斷其他功能
- **NFR13:** AI 服務無回應時，對話介面顯示錯誤提示，不讓使用者長時間等待

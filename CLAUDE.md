# CLAUDE.md

此檔案提供 Claude Code 在 ThanatosJun `v2` branch 中運作時所需的指引。

## 專案概述

個人作品集網站 v2 — 全棧重構版本，以沉浸式宇宙空間為主題，整合 Live2D 角色、AI 對話、多空間內容管理。

**架構文件：** [docs/planning-artifacts/architecture.md](docs/planning-artifacts/architecture.md)（完整架構決策）

## 本地開發

```bash
# 一指令啟動三服務
docker compose up

# 服務 URL
# Frontend:   http://localhost:5173
# Backend:    http://localhost:3000
# AI Service: 僅 Docker 內部可達（port 8000，expose 非 ports）
```

**前置條件：**
- Docker Desktop 已安裝並執行
- Ollama 已安裝並執行（`ollama run qwen2.5:7b`）
- 複製 `.env.example` 為 `.env` 並填入值

## 技術棧

| 層級 | 技術 |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS v4 |
| Backend | Node.js + Express + TypeScript + better-sqlite3 |
| AI Service | Python + FastAPI + ChromaDB + Ollama |
| 認證 | JWT + httpOnly Cookie |
| 動畫 | GSAP（開場）+ Live2D Cubism Web SDK v5 |
| 狀態管理 | Zustand |

## 架構結構

```
ThanatosJun/  (v2 branch)
├── shared/types/       # 前後端共用 TypeScript 型別（唯一來源）
├── frontend/           # React SPA（port 5173）
├── backend/            # Express API（port 3000）
├── ai-service/         # FastAPI AI 服務（port 8000，內部）
└── docker-compose.yml
```

## 強制規則（所有 AI Agent 必須遵守）

1. **型別從 `shared/types/` import**，前後端不得各自定義重複型別
2. **SSE 解析只用 `frontend/src/utils/sseParser.ts`**，不得自行實作
3. **Error code 用 `SCREAMING_SNAKE_CASE`**（`ARTICLE_NOT_FOUND`、`UNAUTHORIZED` 等）
4. **Zustand store 錯誤欄位統一 `error: string | null`**
5. **Live2D 初始化必須在 `useEffect` 內，且必須提供 cleanup**
6. **所有 Express 路由掛載在 `/api/v1/` 前綴下**
7. **所有 secrets 透過環境變數存取，不寫入程式碼**

## 命名規範

- DB 欄位：`snake_case`（`created_at`、`space_id`）
- API 路徑：`/api/v1/{複數資源名}`（`/api/v1/articles`）
- React 元件：`PascalCase`（`ChatPanel.tsx`）
- 非元件 TS 檔：`camelCase`（`useConversationStore.ts`）
- Python 檔：`snake_case`（`rag_service.py`）
- Error code：`SCREAMING_SNAKE_CASE`

## Live2D SDK

原始 SDK 位於 `CubismSdkForWeb-5-r.5/`（同 repo，main branch）。
Core 已複製至 `frontend/public/live2d/live2dcubismcore.min.js`。
Framework 原始碼已複製至 `frontend/src/lib/live2d/`。

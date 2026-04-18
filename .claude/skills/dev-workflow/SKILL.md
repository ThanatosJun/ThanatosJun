---
name: dev-workflow
description: BMAD 開發流程引導。當使用者要開始新功能、規劃專案、或詢問開發流程時使用。引導使用者選擇規模等級，並逐步執行分析→規劃→架構→實現的完整流程。
---

當使用者呼叫此 skill，依照以下流程引導他們進行 BMAD Method 開發。

---

## 首先確認專案規模

詢問使用者目前的任務屬於哪個等級：

| 等級 | 說明 | 範例 |
|---|---|---|
| **Level 0-1** Quick Flow | 簡單功能、bug 修復、1-15 個故事 | 修 bug、加欄位 |
| **Level 2-4** BMad Method | 產品功能、複雜模組、10-50+ 個故事 | 新功能模組 |
| **Enterprise** | 企業系統、合規需求、30+ 個故事 | 多租戶系統 |

---

## Quick Flow（Level 0-1）

適合小型任務，跳過 PRD 與架構，直接進入規劃與實現。

**步驟：**
1. 啟動 PM（John）：載入 `@bmad/bmm/agents/pm.md`
2. 執行技術規範：`@bmad/bmm/workflows/2-planning/tech-spec/workflow.yaml`
3. 建立 Epics 與故事：`@bmad/bmm/workflows/2-planning/create-epics-and-stories/workflow.yaml`
4. 直接進入 **Phase 4 實現循環**

---

## BMad Method（Level 2-4）

### Phase 1 — 分析（可選）

> 適合新專案或需要深入研究的情境，每個工作流程建議開新對話。

| 動作 | 代理 | 工作流程 |
|---|---|---|
| 腦力激蕩 | Analyst (Mary) | `@bmad/bmm/workflows/1-analysis/brainstorm-project/workflow.yaml` |
| 定義產品願景 | Analyst (Mary) | `@bmad/bmm/workflows/1-analysis/product-brief/workflow.yaml` |
| 現有專案掃描 | Analyst (Mary) | `@bmad/bmm/workflows/1-analysis/document-project/workflow.yaml` |

**啟動 Analyst：** 載入 `@bmad/bmm/agents/analyst.md`

---

### Phase 2 — 規劃（必需）

> 每個工作流程建議開新對話。

| 動作 | 代理 | 工作流程 |
|---|---|---|
| 撰寫 PRD | PM (John) | `@bmad/bmm/workflows/2-planning/prd/workflow.yaml` |
| UX 設計（可選） | UX Designer (Sally) | `@bmad/bmm/workflows/2-planning/create-ux-design/workflow.yaml` |
| 拆分 Epics 與故事 | PM (John) | `@bmad/bmm/workflows/2-planning/create-epics-and-stories/workflow.yaml` |

**啟動 PM：** 載入 `@bmad/bmm/agents/pm.md`
**啟動 UX Designer：** 載入 `@bmad/bmm/agents/ux-designer.md`

---

### Phase 3 — 架構（Level 2-4 必需）

> 建議開新對話。

| 動作 | 代理 | 工作流程 |
|---|---|---|
| 系統架構設計 | Architect (Winston) | `@bmad/bmm/workflows/3-solutioning/architecture/workflow.yaml` |
| 驗證實現就緒 | Architect (Winston) | `@bmad/bmm/workflows/3-solutioning/implementation-readiness/workflow.yaml` |

**啟動 Architect：** 載入 `@bmad/bmm/agents/architect.md`

---

### Phase 4 — 實現（迭代循環）

對每個 **Epic** 重複以下流程：

#### Epic 開始
1. SM（Bob）執行：`@bmad/bmm/workflows/4-implementation/epic-tech-context/workflow.yaml`
   → 產出 Epic 技術背景文件

#### 每個 Story 循環
```
SM  →  create-story        建立故事草稿
SM  →  story-context       組裝 Story Context XML
DEV →  develop-story       實現所有任務 + 測試
DEV →  code-review         高級 review
DEV →  story-done          標記完成，推進隊列
```

| 步驟 | 代理 | 工作流程 |
|---|---|---|
| 建立故事 | SM (Bob) | `@bmad/bmm/workflows/4-implementation/create-story/workflow.yaml` |
| 組裝上下文 | SM (Bob) | `@bmad/bmm/workflows/4-implementation/story-context/workflow.yaml` |
| 實現故事 | DEV (Amelia) | `@bmad/bmm/workflows/4-implementation/develop-story/workflow.yaml` |
| 程式碼 Review | DEV (Amelia) | `@bmad/bmm/workflows/4-implementation/code-review/workflow.yaml` |
| 標記完成 | DEV (Amelia) | `@bmad/bmm/workflows/4-implementation/story-done/workflow.yaml` |

#### Epic 結束
- SM 執行：`@bmad/bmm/workflows/4-implementation/epic-retrospective/workflow.yaml`

**啟動 SM：** 載入 `@bmad/bmm/agents/sm.md`
**啟動 DEV：** 載入 `@bmad/bmm/agents/dev.md`

---

## 故事狀態機

```
backlog → drafted → ready → in-progress → review → done
```

- `story-ready`：標記為開發就緒
- `story-done`：標記完成並推進隊列
- `correct-course`：Sprint 中途需調整時使用

---

## 多代理協作（Party Mode）

需要團隊討論、重大決策、或腦力激蕩時啟動：
載入 `@bmad/core/workflows/party-mode`

BMad Master 協調所有代理，每則訊息選出 2-3 個相關代理以角色回應，輸入 `exit` 結束。

---

## 圖表生成

| 用途 | 工作流程 |
|---|---|
| 一般圖表 | `@bmad/bmm/workflows/diagrams/create-excalidraw-diagram/workflow.yaml` |
| 資料流 | `@bmad/bmm/workflows/diagrams/create-excalidraw-dataflow/workflow.yaml` |
| 流程圖 | `@bmad/bmm/workflows/diagrams/create-excalidraw-flowchart/workflow.yaml` |
| 線框圖 | `@bmad/bmm/workflows/diagrams/create-excalidraw-wireframe/workflow.yaml` |

---

## 重要原則

- **每個工作流程開新對話**（特別是腦力激蕩、PRD、架構），確保最大 context 容量
- **一次只做一個故事**，Story Context XML 是實現的唯一真實來源
- **所有 acceptance criteria 必須滿足**，所有測試必須通過，不得繞過
- 輸出語言依 `bmad/bmm/config.yaml` 設定（目前：繁體中文）
- 故事存放於 `stories/`，文件輸出至 `docs/`

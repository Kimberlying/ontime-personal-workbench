# 🎯 如期 | OnTime (Orderly Workbench)

> **定下截止日，万事皆如期 · 智能倒排工期工作台**  
> 融合 SMART BACKWARD 目标倒推、P0 智能推进算法、ADHD 友好 5 分钟微步启动、知识库沉淀与 MCP (Model Context Protocol) 智能体接入的现代化全栈个人工作台。

---

## 🌟 核心特性 (Features)

### 1. ⚡ P0 智能推进提示条 (Dynamic Push Bar)
- **多维紧急度决策**：动态评估 `逾期 > 今日到期 > 3天内到期 > 高优先级 > 最久未推进时间戳`，精准筛选当前唯一最急迫任务；
- **下一步行动提取**：自动提炼任务的“最小启动项”或“第一个未完成行动点”；
- **快速行动闭环**：支持 5 分钟微冲刺启动、就地记录进展、一键候选轮换。

### 2. 🎯 SMART BACKWARD 目标倒排与每日配额 (Goal Section)
- **动态配额公式**：根据目标截止日与当前日期自动倒排：
  $$\text{Daily Quota} = \lceil \frac{\text{剩余节点数}}{\text{剩余天数}} \rceil$$
- **直观推进卡片**：直接在目标卡片勾选完成节点，支持子节点增删与维护。

### 3. 📚 知识库与时间线双视图 (Knowledge Base View)
- **执行与沉淀自由切换**：左侧导航栏一键切换「📅 今天工作台」与「📚 知识库与沉淀」；
- **推进流水线 (Execution Timeline)**：按日期聚合所有任务与目标的推进日志（精确到时分）；
- **沉淀资产库 (Artifacts)**：分类归档「计划文档 (当初打算做什么)」与「复盘思考 (后来想清楚了什么)」；
- **全局搜索与一键导出**：一键导出 Markdown 结构化离线文档。

### 4. 📦 数据与连接中枢 (Data & MCP Hub)
- **📥 智能文本导入**：支持粘贴 ChatGPT / Claude / Gemini 生成的 Markdown 任务大纲，自动识别项目、周期、优先级与截止日，原文自动归档为知识库「计划文档」；
- **📤 全格式数据导出**：
  - 结构化 Markdown 大纲导出（带筛选范围与实时文本预览）；
  - JSON 全量脱机备份（带 LocalStorage 健康度仪表盘）；
  - 标准 UTF-8 BOM CSV 导出（Excel / Numbers 完美兼容）；
- **🔌 MCP (Model Context Protocol) 智能体接入**：
  - 彻底支持中英双语国际化切换；
  - 接入端点 `http://localhost:8644/mcp` 与永久有效访问 Token；
  - 内置 Claude Desktop / Cursor 客户端配置文件一键复制；
  - 内置自然语言指令联调控制台，直接与工作台看板实时联动；
- **🤖 开放 Web API (`window.Workbench`)**：在浏览器 F12 控制台即可调用全套读取与写入接口。

### 5. 🧩 ADHD 友好 5 分钟微步启动器
- 5 分钟极简微动作拆解（物理准备、极简切入、小范围专注），破除启动阻抗与拖延症。

### 6. 🏆 游戏化成就与日常重置
- 成就徽章系统、正向激励与成长记录；
- 每日 00:00 午夜自动重置日常习惯打卡，保持清晨工作台整洁。

---

## 🛠️ 技术栈 (Tech Stack)

- **前端框架**：Vue 3 (Composition API, `<script setup>`)
- **构建工具**：Vite 5
- **状态管理**：Pinia
- **CSS 样式**：TailwindCSS + Neobrutalism 触觉拟物高对比风格
- **国际化**：Vue I18n (完整支持中文 `zh` 与英文 `en`)
- **时间与日期**：Day.js
- **后端/存储**：Supabase + LocalStorage 离线平滑降级
- **智能体协议**：MCP (Model Context Protocol)

---

## 🚀 快速开始 (Quick Start)

### 1. 安装依赖
```bash
npm install
```

### 2. 启动本地开发服务
```bash
npm run dev
```
打开浏览器访问：`http://localhost:5189`

### 3. 运行自动化测试
```bash
npm test
```

### 4. 构建生产产物
```bash
npm run build
```

---

## 📄 许可协议 (License)

MIT License © 2026 Kimberly Qian

# 🎯 如期个人工作台 | OnTime

<div align="center">

🌐 **语言选择**: [English](README.md) | **简体中文**

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MCP Ready](https://img.shields.io/badge/MCP-Protocol_Ready-0d9488?style=flat-square)](https://modelcontextprotocol.io/)
[![License: Non-Commercial](https://img.shields.io/badge/License-仅限个人非商业使用-rose?style=flat-square)](LICENSE)
[![版权所有](https://img.shields.io/badge/版权所有-All_Rights_Reserved-slate?style=flat-square)](LICENSE)

**定下截止日，万事皆如期 · 智能倒排工期与温和交付工作台**

</div>

---

## 📖 项目简介

**如期个人工作台 (OnTime Personal Workbench)** 是一款以“以终为始 (Backward Scheduling)”为核心理念的现代化个人专注工作台。它摒弃了传统 Todo List 堆积任务带来的认知过载与焦虑，结合脑科学认知规律与 ADHD 友好设计，将庞大的战略目标自动倒排拆解为每日轻松可执行的微动作。

---

## 🌟 核心功能特性

### 1. ⚡ P0 智能推进决策条 (`PushBar.vue`)
- **动态决策算法**：根据 `逾期 (0) > 今日到期 (1) > 3天内到期 (2) > 高优先级 (3) > 最久未推进时间戳` 实时筛选当前唯一最急迫任务，告别选择困难症；
- **下一步具体动作提取**：自动提炼任务的“最小启动项”或“第 1 个未完成行动步骤”；
- **一键行动闭环**：支持【⚡ 5 分钟微启动】、【✎ 记录进展打卡】与【换一个】高优任务轮换。

### 2. 🎯 SMART BACKWARD 目标倒排与每日配额 (`GoalSection.vue`)
- **动态配额计算公式**：
  $$\text{每日配额} = \lceil \frac{\text{剩余节点数}}{\text{剩余天数}} \rceil$$
- **直观卡片推进**：卡片上直观陈列里程碑节点，直接勾选打勾完成；
- **节点编辑维护**：支持目标详情弹窗增删子节点与配额周期调整。

### 3. 📚 知识库与推进时间线双视图 (`KnowledgeBaseView.vue`)
- **双视图自由切换**：左侧导航栏一键切换「📅 今天工作台」与「📚 知识库与沉淀」；
- **推进流水线 (Execution Timeline)**：按日期聚合所有任务与目标的推进日志，精确记录至时分与所属项目；
- **沉淀资产库 (Artifacts)**：
  - **计划文档 (Plan Docs)**：记录“当初打算做什么”；
  - **复盘笔记 (Retrospective Notes)**：记录“后来想清楚了什么”；
- **全域即时搜索**：关键词实时筛选任务、计划、笔记与时间线；
- **一键导出 Markdown**：一键生成排版严密、包含概览统计、计划原文、时间线流水与复盘思考的 `.md` 离线文件。

### 4. 📦 数据与连接中枢 (`SmartImportModal.vue` & `exportUtils.js`)
- **📥 智能文本导入**：
  - 支持粘贴 ChatGPT / Claude / Gemini 生成的任务大纲；
  - 自动识别项目、周期、优先级、截止日与最小启动项；
  - 导入时原文自动存为知识库中的「计划文档」，便于日后复盘对照；
  - 支持全局文件拖拽（`.md` / `.txt` / `.json`）；
- **📤 全格式数据导出**：
  - **结构化 Markdown 大纲导出**：支持范围筛选（全部项目 / 指定项目、包含/排除已完成、长线目标），一键下载 `.md` 或复制文本，完美适配 Notion、Obsidian、飞书；
  - **JSON 全量脱机备份**：实时显示 LocalStorage 存储健康度仪表盘，支持一键导出与合并/覆盖恢复；
  - **CSV 任务明细表格**：内置标准 UTF-8 BOM，在 Excel 和 Apple Numbers 中双击打开绝不乱码；
- **🔌 MCP (Model Context Protocol) 智能体接入**：
  - 全面支持中英双语国际化切换；
  - 接入端点 `http://localhost:8644/mcp` 与访问 Token；
  - 内置 Claude Desktop 与 Cursor 客户端配置文件一键复制；
  - 内置自然语言指令联调控制台，直接向智能体下达指令，工作台看板实时变动；
- **🤖 开放控制台接口 (`window.Workbench`)**：在浏览器 F12 控制台即可调用全套读取与写入 API。

### 5. 🧩 ADHD 友好 · 5 分钟微步启动器 (`AdhdMicroStarterModal.vue`)
- **5 分钟无压定律**：告诉自己“只做 5 分钟，随时可以停下”，跨过最初的启动阻抗；
- **三步微步拆解**：物理准备 (30秒) → 极简切入 (2分钟) → 小范围专注 (2.5分钟)；
- **内置 5 分钟沉浸倒计时器**。

### 6. 🏆 游戏化成就墙与日常重置
- **正向激励徽章墙**：每一次推进与结项都有可见的印记，不设惩罚机制；
- **每日午夜 00:00 自动重置**：日常习惯类任务在跨天时自动重置为待办，保持清晨工作台整洁有序。

---

## 🛠️ 技术架构 (Tech Stack)

| 模块 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **核心框架** | Vue 3.5 (Composition API) | 极速响应式组件架构 |
| **构建打包** | Vite 5.4 | 秒级热更新 (HMR) 与生产打包 |
| **状态管理** | Pinia 2.2 | 模块化响应式状态容器 |
| **界面样式** | Tailwind CSS 3.4 | 触觉拟物高对比风格 (Neobrutalism) |
| **国际化** | Vue I18n 9.14 | 完整中英双语即时切换 |
| **时间处理** | Day.js 1.11 | 轻量级日期计算与相对时间 |
| **数据持久化** | Supabase + LocalStorage | 离线优先平滑降级 |
| **智能体协议** | Model Context Protocol (MCP) | 标准 AI Agent 接入端点 |

---

## 🚀 快速上手 (Quick Start)

### 1. 克隆仓库
```bash
git clone https://github.com/Kimberlying/ontime-personal-workbench.git
cd ontime-personal-workbench
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行本地开发服务
```bash
npm run dev
```
打开浏览器访问：`http://localhost:5189`

### 4. 运行自动化测试
```bash
npm test
```

### 5. 生产打包构建
```bash
npm run build
```

---

## 🔌 MCP 客户端配置示例

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "ontime-workbench": {
      "url": "http://localhost:8644/mcp",
      "headers": {
        "Authorization": "Bearer ontime_live_sk_mcp_8888"
      }
    }
  }
}
```

### Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "ontime-workbench": {
      "url": "http://localhost:8644/mcp"
    }
  }
}
```

---

## 📄 版权声明与使用条款 (License & Terms)

版权所有 © 2026 Kimberly Qian (Kimberlying)。保留所有权利。

本项目采用 **严格个人非商业使用协议 (Strict Non-Commercial Personal-Use License)**，详情请见 [LICENSE](LICENSE) 文件：

- 🟢 **允许的个人使用**：欢迎任何个人出于个人学习、研究以及提升个人日常工作/学习效率的目的免费克隆、运行和使用本工作台。
- 🔴 **严禁任何商业用途**：**严格禁止**将本项目的任何源代码、算法逻辑、UI 界面或其衍生作品用于任何形式的商业收费、转售、分许可、闭源封装、SaaS 盈利运营或商业服务推广。
- 🔴 **禁止换皮再分发与擅自修改公开发行**：未经作者事先明确书面授权，任何人不得修改后以个人或商业品牌重新发布或分发衍生版本。

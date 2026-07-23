# Night Nest 夜栖协议

AI 角色关系平台——不止是聊天，是可持续推进关系、剧情与情绪价值的角色互动体验。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Next.js 15 + React 19 + Framer Motion + Lucide Icons |
| 后端 | NestJS + Prisma + SQLite |
| AI | FastAPI + OpenAI 兼容接口（DeepSeek 等） |

## 功能

- **沉浸聊天** — 4 个角色，每人独立人格 AI prompt，关系数值推进，记忆沉淀
- **剧本大厅** — 创建/加入公开剧本，多人同场景互动
- **角色库** — 角色详情编辑，立绘管理
- **创作者后台** — 数据看板，角色关系阶段分布，商业化漏斗
- **用户系统** — 注册/登录/会话管理
- **自定义模型** — 接入任意 OpenAI 兼容 API

## 启动

```powershell
# 一键启动三服务
.\start.ps1
```

- Web: `http://localhost:3000`
- API: `http://localhost:3100/health`
- AI: `http://localhost:8000/v1/pipeline-status`

## 项目结构

```
night-nest/
├── apps/
│   ├── web/          # Next.js 前端
│   ├── api/          # NestJS 后端
│   └── ai/           # FastAPI AI 服务
├── packages/         # 共享类型
├── scripts/          # 数据库脚本
└── showcase/         # 早期展示版
```

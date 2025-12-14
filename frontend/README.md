# CPA Master - AI-Powered CPA Learning Platform

基于 FastAPI + Ionic React + AI 的注册会计师学习平台

---

## 📋 项目概述

CPA Master 是一个采用现代技术栈构建的 AI 驱动学习平台，专注于 CPA（注册会计师）考试备考。

### 核心功能

- 🤖 **AI 智能导师** - RAG + LLM 驱动的个性化学习辅导
- 📸 **OCR 文档识别** - 试题、笔记智能识别与解析
- 📊 **学习诊断系统** - 智能分析学习进度和薄弱环节
- 📱 **跨平台移动应用** - iOS/Android/Web 三端支持
- 🎯 **个性化学习路径** - AI 推荐的学习计划

---

## 🏗️ 技术架构

### 后端技术栈

- **FastAPI** - 高性能异步 Python Web 框架
- **PostgreSQL** - 主数据库 (使用 SQLModel ORM)
- **Redis** - 缓存和消息队列
- **Celery** - 异步任务处理
- **Qdrant** - 向量数据库 (用于 RAG)
- **LangChain** - AI/LLM 集成框架
- **Docker** - 容器化部署

### 前端技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Ionic Framework** - 移动端 UI 组件
- **Capacitor** - 原生能力访问
- **Vite** - 构建工具
- **React Query** - 数据获取和状态管理
- **Zustand** - 轻量级状态管理

### AI/ML 技术栈

- **OpenAI GPT-4 / Claude** - LLM 模型
- **Sentence Transformers** - 文本向量化
- **LangChain** - RAG 框架
- **Qdrant** - 向量检索

---

## 📂 项目结构

\`\`\`
cpa-master/
├── backend/                      # FastAPI 后端
│   ├── app/
│   │   ├── api/                  # API 路由
│   │   ├── core/                 # 核心配置
│   │   │   ├── config.py         # 配置管理
│   │   │   ├── security.py       # 安全相关
│   │   │   └── celery_app.py     # Celery 配置
│   │   ├── models/               # 数据模型
│   │   ├── services/             # 业务服务
│   │   │   └── ai/               # AI 服务
│   │   │       ├── rag/          # RAG 检索
│   │   │       ├── llm/          # LLM 调用
│   │   │       └── ocr/          # OCR 识别
│   │   ├── tasks/                # Celery 异步任务
│   │   └── tests/                # 测试
│   ├── alembic/                  # 数据库迁移
│   └── pyproject.toml            # Python 依赖
│
├── frontend/                     # Ionic React 前端
│   ├── src/
│   │   ├── api/                  # API 客户端
│   │   │   └── generated/        # 自动生成的 TypeScript SDK
│   │   ├── config/               # 配置
│   │   ├── pages/                # 页面组件
│   │   ├── components/           # 通用组件
│   │   └── stores/               # 状态管理
│   ├── capacitor.config.ts       # Capacitor 配置
│   └── package.json
│
├── docker-compose.yml            # Docker 服务编排
├── .env                          # 环境变量
└── README.md                     # 本文档
\`\`\`

---

## 🚀 快速开始

### 前置要求

- **Docker** 和 **Docker Compose** (推荐)
- **Python 3.11+** (本地开发)
- **Node.js 18+** 和 **npm** (前端开发)

### 1. 配置环境变量

\`\`\`bash
# 编辑 .env 文件，配置必要的环境变量
# 重点配置：
# - POSTGRES_PASSWORD
# - SECRET_KEY
# - FIRST_SUPERUSER
# - FIRST_SUPERUSER_PASSWORD
# - OPENAI_API_KEY (可选，用于 AI 功能)
\`\`\`

### 2. 启动后端服务 (Docker 方式)

\`\`\`bash
# 构建并启动所有服务
docker compose up -d

# 查看日志
docker compose logs -f backend
\`\`\`

访问 API 文档: http://localhost:8000/docs

### 3. 启动前端开发服务器

\`\`\`bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
\`\`\`

### 4. 生成前端 API SDK (重要！)

\`\`\`bash
cd frontend

# 确保后端正在运行，然后生成 API 代码
npm run generate-api
\`\`\`

生成的代码位于 \`frontend/src/api/generated/\`

**使用示例**：

\`\`\`typescript
import { UsersService, type User } from '@/api/generated';

// 获取用户列表 - 完整的类型提示
const users: User[] = await UsersService.getUsers();
\`\`\`

---

## 📝 环境变量说明

### 后端环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| \`POSTGRES_SERVER\` | PostgreSQL 服务器地址 | \`db\` |
| \`POSTGRES_USER\` | 数据库用户名 | \`postgres\` |
| \`POSTGRES_PASSWORD\` | 数据库密码 | \`changethis\` |
| \`SECRET_KEY\` | JWT 密钥 | \`changethis\` |
| \`REDIS_URL\` | Redis 连接 URL | \`redis://redis:6379/0\` |
| \`QDRANT_URL\` | Qdrant 连接 URL | \`http://qdrant:6333\` |
| \`OPENAI_API_KEY\` | OpenAI API 密钥 | \`sk-...\` |

---

## 🔧 开发指南

### 添加新的 API 端点

1. 在 \`backend/app/api/v1/\` 创建路由文件
2. 后端会自动更新 OpenAPI schema
3. 前端运行 \`npm run generate-api\` 同步类型

### 添加 Celery 异步任务

在 \`backend/app/tasks/\` 创建任务文件：

\`\`\`python
from app.core.celery_app import celery_app

@celery_app.task(name="my_task")
def my_async_task(param: str) -> dict:
    return {"status": "completed"}
\`\`\`

---

## 📦 服务列表

- **backend** - FastAPI 应用 (http://localhost:8000)
- **db** - PostgreSQL 数据库
- **redis** - Redis 缓存
- **qdrant** - 向量数据库 (http://localhost:6333)
- **celery-worker** - Celery 异步任务
- **celery-beat** - Celery 定时任务

---

## 🆘 常见问题

### 后端启动失败

\`\`\`bash
# 检查数据库连接
docker compose logs db

# 重新创建数据库
docker compose down -v
docker compose up -d
\`\`\`

### 前端无法连接后端

1. 检查 \`.env\` 中的 \`VITE_API_URL\` 配置
2. 检查后端是否正在运行
3. 检查 CORS 配置

---

**Happy Coding! 🚀**

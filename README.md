# 全栈项目启动模板

基于 FastAPI + Ionic React 的现代全栈应用项目模板

---

## 技术栈和特性

### 后端技术栈

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) - Python 异步 Web 框架
  - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) - Python SQL 数据库交互 (ORM)
  - 🔍 [Pydantic](https://docs.pydantic.dev) - 数据验证和设置管理
  - 💾 [PostgreSQL](https://www.postgresql.org) - SQL 数据库
- 🔴 [Redis](https://redis.io) - 缓存和消息队列
- 🌿 [Celery](https://docs.celeryproject.org) - 异步任务处理

### 前端技术栈

- 🚀 [React 18](https://react.dev) - UI 框架
  - 💃 使用 TypeScript、Hooks、[Vite](https://vitejs.dev) 等现代前端技术栈
  - 🎨 [Ionic Framework](https://ionicframework.com) - 跨平台 UI 组件
  - 📱 [Capacitor](https://capacitorjs.com) - 原生能力访问
  - 🤖 自动生成的前端 API 客户端
  - 🧪 [Playwright](https://playwright.dev) - E2E 测试

### 基础设施和开发工具

- 🐋 [Docker Compose](https://www.docker.com) - 开发和生产环境
- 🔒 安全的密码哈希
- 🔑 JWT (JSON Web Token) 认证
- 📫 基于邮件的密码恢复
- ✅ [Pytest](https://pytest.org) 测试
- 📞 [Traefik](https://traefik.io) - 反向代理 / 负载均衡
- 🚢 使用 Docker Compose 的部署说明，包括自动 HTTPS 证书
- 🏭 基于 GitHub Actions 的 CI/CD

### 可选 AI 功能

- 🤖 [LangChain](https://langchain.com) - AI/LLM 集成框架
- 🔍 [Qdrant](https://qdrant.tech) - 向量数据库 (用于 RAG)
- 📸 OCR 文档识别支持

---

## 快速开始

### 🚀 5 分钟快速启动

查看 [快速启动指南](QUICKSTART.md) 了解最快的启动方式。

### 前置要求

- **Docker** 和 **Docker Compose** (推荐)
- **Python 3.11+** (本地开发)
- **Node.js 18+** 和 **npm** (前端开发)

### 基本使用流程

1. **克隆或 fork 此仓库**

```bash
git clone <repository-url> my-project
cd my-project
```

2. **配置环境变量**

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，修改以下关键配置：
# - PROJECT_NAME: 项目名称
# - SECRET_KEY: JWT 密钥
# - POSTGRES_PASSWORD: 数据库密码
# - FIRST_SUPERUSER: 管理员邮箱
# - FIRST_SUPERUSER_PASSWORD: 管理员密码
```

3. **启动服务**

```bash
# 启动所有后端服务
docker compose up -d

# 启动前端开发服务器
cd frontend
npm install
npm run dev
```

4. **访问应用**

- 前端: http://localhost:5173
- API 文档: http://localhost:8000/docs
- 数据库管理: http://localhost:8080 (Adminer)

---

## 生成安全密钥

环境变量文件中的某些值默认为 `changethis`，你需要生成安全的密钥替换它们：

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

复制输出的内容并用作密码/密钥。多次运行以生成多个密钥。

---

## 使用 Copier 生成项目（可选）

这个仓库支持使用 [Copier](https://copier.readthedocs.io) 生成新项目。

### 安装 Copier

```bash
pip install copier
# 或使用 pipx
pipx install copier
```

### 生成项目

```bash
copier copy <this-repository-url> my-awesome-project --trust
```

Copier 会询问你一些配置问题，并自动更新 `.env` 文件。

### 输入变量

- `project_name`: 项目名称
- `stack_name`: Docker Compose 使用的堆栈名称
- `secret_key`: 项目密钥
- `first_superuser`: 第一个超级用户邮箱
- `first_superuser_password`: 超级用户密码
- `postgres_password`: PostgreSQL 密码
- `smtp_host`, `smtp_user`, `smtp_password`: SMTP 邮件配置（可选）
- `emails_from_email`: 发件人邮箱
- `sentry_dsn`: Sentry DSN（可选）

---

## 项目结构

```
项目根目录/
├── backend/                      # FastAPI 后端应用
│   ├── app/
│   │   ├── api/                  # API 路由
│   │   ├── core/                 # 核心配置
│   │   ├── services/             # 业务服务
│   │   │   └── ai/               # AI 服务（可选）
│   │   ├── models.py             # 数据模型
│   │   └── tests/                # 测试
│   └── pyproject.toml            # Python 依赖
│
├── frontend/                     # Ionic React 前端
│   ├── src/
│   │   ├── api/generated/        # 自动生成的 API 客户端
│   │   ├── pages/                # 页面组件
│   │   └── components/           # 通用组件
│   └── package.json
│
├── scripts/                      # 项目脚本
├── .github/workflows/            # GitHub Actions CI/CD
├── docker-compose.yml            # Docker 服务编排
├── .env                          # 环境变量
├── QUICKSTART.md                 # 快速启动指南
├── development.md                # 开发指南
├── deployment.md                 # 部署指南
└── README.md                     # 本文档
```

---

## 开发指南

### 后端开发

查看 [backend/README.md](./backend/README.md) 了解后端开发详情。

### 前端开发

查看 [frontend/README.md](./frontend/README.md) 了解前端开发详情。

### 自动化 API 集成

1. 在后端添加新的 API 端点
2. 后端会自动更新 OpenAPI schema
3. 前端运行 `npm run generate-api` 同步类型
4. 在前端代码中使用生成的 TypeScript 客户端

### 移动端开发

```bash
cd frontend

# 添加移动平台
npx cap add android
npx cap add ios

# 构建并同步
npm run build
npx cap sync

# 打开原生 IDE
npx cap open android
npx cap open ios
```

---

## 部署

查看 [deployment.md](./deployment.md) 了解详细的部署说明。

部署前确保修改以下环境变量：

- `SECRET_KEY`
- `FIRST_SUPERUSER_PASSWORD`
- `POSTGRES_PASSWORD`

建议通过 secrets 传递这些环境变量。

---

## 通用开发

查看 [development.md](./development.md) 了解通用开发文档。

包括使用 Docker Compose、自定义本地域名、`.env` 配置等。

---

## AI 功能（可选）

项目包含可选的 AI 服务框架：

- **LLM 服务**: OpenAI/Claude 集成
- **RAG 服务**: 向量检索增强生成
- **OCR 服务**: 文档识别

启用 AI 功能：

1. 在 `.env` 中配置 `OPENAI_API_KEY` 或 `ANTHROPIC_API_KEY`
2. 启用 Qdrant 服务（已在 docker-compose.yml 中配置）
3. 在后端安装 AI 依赖：`uv sync --extra ai`

---

## 常见问题

### 端口被占用

修改 `docker-compose.yml` 中的端口映射。

### 数据库连接失败

```bash
docker compose restart db
docker compose logs db
```

### 前端无法连接后端

检查 `frontend/.env` 中的 `VITE_API_URL` 配置。

---

## 许可证

本项目基于 MIT 许可证开源。

---

## 相关资源

- [FastAPI 文档](https://fastapi.tiangolo.com)
- [Ionic React 文档](https://ionicframework.com/docs/react)
- [SQLModel 文档](https://sqlmodel.tiangolo.com)
- [Capacitor 文档](https://capacitorjs.com/docs)

---

**开始构建你的下一个项目！🚀**

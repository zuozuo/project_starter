# 🚀 快速启动指南

5分钟快速启动全栈应用项目！

---

## ⚡ 最快启动方式 (Docker)

### 步骤 1: 启动后端

```bash
# 在项目根目录
docker compose up -d

# 等待服务启动完成 (大约 30-60 秒)
docker compose logs -f backend
```

看到类似 "Application startup complete" 的日志表示启动成功。

**访问 API 文档**: http://localhost:8000/docs

### 步骤 2: 启动前端

```bash
# 打开新终端
cd frontend

# 安装依赖 (首次运行)
npm install

# 启动开发服务器
npm run dev
```

**访问前端**: http://localhost:5173

### 步骤 3: 生成 API 客户端 (首次运行)

```bash
# 在 frontend 目录
npm run generate-api
```

这会从后端 API 自动生成 TypeScript 类型和 API 客户端代码。

---

## 📋 验证安装

### 1. 检查后端服务

```bash
# 查看所有服务状态
docker compose ps

# 应该看到以下服务都在运行:
# - db (PostgreSQL)
# - redis
# - backend
```

### 2. 测试 API

```bash
# 测试健康检查
curl http://localhost:8000/api/v1/utils/health-check/

# 查看 API 文档
open http://localhost:8000/docs
```

### 3. 测试前端

访问 http://localhost:5173，应该能看到前端界面。

---

## 🔐 登录后台

默认超级用户凭据 (在 `.env` 文件中配置):

- **邮箱**: `.env` 中的 `FIRST_SUPERUSER`
- **密码**: `.env` 中的 `FIRST_SUPERUSER_PASSWORD`

---

## 🛑 停止服务

```bash
# 停止所有服务
docker compose down

# 停止并删除所有数据 (慎用)
docker compose down -v
```

---

## 📝 下一步

1. **阅读完整文档**: 查看 [README.md](README.md)
2. **配置环境变量**: 在 `.env` 中修改项目配置
3. **开发新功能**: 参考 [开发指南](development.md)
4. **部署到生产**: 参考 [deployment.md](deployment.md)

---

## 🆘 遇到问题？

### 端口被占用

```bash
# 修改 docker-compose.yml 中的端口映射
# 例如将 8000:8000 改为 8001:8000
```

### 数据库连接失败

```bash
# 重启数据库服务
docker compose restart db

# 查看数据库日志
docker compose logs db
```

### 前端无法连接后端

检查 `frontend/.env` 文件中的 `VITE_API_URL` 配置。

---

**需要帮助？** 查看项目文档或提交 Issue

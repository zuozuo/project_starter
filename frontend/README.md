# 前端应用

基于 FastAPI + Ionic React 的现代全栈应用前端

---

## 📋 项目概述

这是一个采用现代技术栈构建的前端应用模板，提供完整的移动端和 Web 端支持。

### 核心特性

- 📱 **跨平台支持** - iOS/Android/Web 三端统一
- 🔐 **完整的认证系统** - JWT 认证，安全可靠
- 🎨 **现代 UI 组件** - 基于 Ionic Framework
- 📡 **自动化 API 集成** - OpenAPI 自动生成 TypeScript SDK
- ⚡ **高性能构建** - Vite 构建工具

---

## 🏗️ 技术架构

### 前端技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Ionic Framework** - 移动端 UI 组件
- **Capacitor** - 原生能力访问
- **Vite** - 构建工具
- **React Query** - 服务器状态管理
- **Zustand** - 客户端状态管理

---

## 📂 项目结构

```
frontend/
├── src/
│   ├── api/                  # API 客户端
│   │   └── generated/        # 自动生成的 TypeScript SDK
│   ├── config/               # 配置
│   ├── pages/                # 页面组件
│   ├── components/           # 通用组件
│   └── stores/               # 状态管理
├── capacitor.config.ts       # Capacitor 配置
└── package.json
```

---

## 🚀 快速开始

### 前置要求

- **Node.js 18+** 和 **npm**
- **后端服务** 已启动并运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev

# 访问 http://localhost:5173
```

### 3. 生成前端 API SDK (重要！)

```bash
# 确保后端正在运行，然后生成 API 代码
npm run generate-api
```

生成的代码位于 `src/api/generated/`

**使用示例**：

```typescript
import { UsersService, type User } from '@/api/generated';

// 获取用户列表 - 完整的类型提示
const users: User[] = await UsersService.getUsers();
```

---

## 🔧 开发指南

### 自动化 API 集成

1. 后端添加新的 API 端点
2. 后端会自动更新 OpenAPI schema
3. 前端运行 `npm run generate-api` 同步类型
4. 在代码中直接使用生成的 TypeScript 客户端

### 移动端开发

```bash
# 添加移动平台
npx cap add android
npx cap add ios

# 同步 web 资源到移动平台
npm run build
npx cap sync

# 打开原生 IDE
npx cap open android
npx cap open ios
```

---

## 📦 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run generate-api` - 生成 API 客户端代码
- `npm run lint` - 运行代码检查

---

## 🆘 常见问题

### 前端无法连接后端

1. 检查 `.env` 中的 `VITE_API_URL` 配置
2. 检查后端是否正在运行
3. 检查 CORS 配置

### API 类型不匹配

```bash
# 重新生成 API 客户端
npm run generate-api
```

---

**Happy Coding! 🚀**

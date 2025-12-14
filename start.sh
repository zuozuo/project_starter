#!/bin/bash

# 快速启动脚本

echo "🚀 启动全栈应用项目..."
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

echo "✅ Docker 正在运行"
echo ""

# 启动后端服务
echo "📦 启动后端服务..."
docker compose up -d

echo ""
echo "⏳ 等待服务启动（30秒）..."
sleep 30

# 检查服务状态
echo ""
echo "🔍 检查服务状态..."
docker compose ps

echo ""
echo "✅ 后端服务已启动！"
echo ""
echo "📖 访问 API 文档: http://localhost:8000/docs"
echo "🗄️  访问数据库管理: http://localhost:8080 (Adminer)"
echo ""
echo "💡 下一步："
echo "   1. cd frontend"
echo "   2. npm run generate-api  # 生成 API 客户端"
echo "   3. npm run dev           # 启动前端"
echo ""

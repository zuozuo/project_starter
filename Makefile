.PHONY: help init dev dev-down test test-local lint clean install-hooks

# 默认目标：显示帮助
help:
	@echo "可用命令："
	@echo "  make init        - 初始化项目（复制环境配置、安装依赖、配置 hooks）"
	@echo "  make dev         - 启动开发环境（Docker Compose）"
	@echo "  make dev-down    - 停止开发环境"
	@echo "  make test        - 运行测试（Docker 环境）"
	@echo "  make test-local  - 运行本地测试"
	@echo "  make lint        - 运行代码检查"
	@echo "  make clean       - 清理临时文件"
	@echo ""
	@echo "依赖安装选项："
	@echo "  make install-base    - 安装基础依赖"
	@echo "  make install-ai      - 安装 AI 功能依赖"
	@echo "  make install-all     - 安装所有依赖"

# 初始化项目
init:
	@echo "正在初始化项目..."
	@[ -f .env ] || cp .env.example .env
	@echo "✓ 环境配置文件已创建"
	cd backend && uv sync
	@echo "✓ 后端依赖已安装"
	cd frontend && npm install
	@echo "✓ 前端依赖已安装"
	uv run pre-commit install
	@echo "✓ Git hooks 已配置"
	@echo ""
	@echo "⚠️  请编辑 .env 文件，修改默认密钥后再启动项目"

# 安装基础后端依赖
install-base:
	cd backend && uv sync

# 安装 AI 功能依赖
install-ai:
	cd backend && uv sync --extra ai

# 安装 OCR 功能依赖
install-ocr:
	cd backend && uv sync --extra ocr

# 安装所有依赖
install-all:
	cd backend && uv sync --extra all

# 启动开发环境
dev:
	docker compose up -d
	@echo "开发环境已启动"
	@echo "  后端: http://localhost:8000"
	@echo "  前端: http://localhost:5173"
	@echo "  Adminer: http://localhost:8080"

# 停止开发环境
dev-down:
	docker compose down

# 运行测试（Docker 环境）
test:
	./scripts/test.sh

# 运行本地测试
test-local:
	./scripts/test-local.sh

# 运行代码检查
lint:
	cd backend && uv run ruff check .
	cd backend && uv run ruff format --check .
	cd frontend && npm run lint

# 格式化代码
format:
	cd backend && uv run ruff check --fix .
	cd backend && uv run ruff format .
	cd frontend && npm run format

# 安装 pre-commit hooks
install-hooks:
	uv run pre-commit install

# 清理临时文件
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name htmlcov -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ 临时文件已清理"

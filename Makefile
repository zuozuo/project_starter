.PHONY: help init dev dev-down stop test test-local lint clean install-hooks

# 默认目标：显示帮助
help:
	@echo "可用命令："
	@echo "  make init        - 初始化项目（复制环境配置、安装依赖、配置 hooks）"
	@echo "  make dev         - 启动开发环境（Docker Compose）"
	@echo "  make stop        - 停止开发环境"
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
	@# 检测并清理损坏的虚拟环境（复制项目后路径会失效）
	@if [ -d backend/.venv ] && ! backend/.venv/bin/python --version >/dev/null 2>&1; then \
		echo "检测到损坏的虚拟环境，正在清理..."; \
		rm -rf backend/.venv; \
	fi
	cd backend && uv sync
	@echo "✓ 后端依赖已安装"
	cd frontend && npm install
	@echo "✓ 前端依赖已安装"
	@# 仅在 Git 仓库中安装 pre-commit hooks
	@if [ -d .git ]; then \
		cd backend && uv run pre-commit install; \
		echo "✓ Git hooks 已配置"; \
	else \
		echo "⚠ 跳过 Git hooks（不是 Git 仓库，请先运行 git init）"; \
	fi
	@echo ""
	@echo "=========================================="
	@echo "✅ 项目初始化完成！"
	@echo "=========================================="
	@echo ""
	@echo "下一步操作："
	@echo "  1. 编辑 .env 文件，修改以下配置："
	@echo "     - SECRET_KEY (必须修改)"
	@echo "     - POSTGRES_PASSWORD (必须修改)"
	@echo "     - FIRST_SUPERUSER_PASSWORD (必须修改)"
	@echo ""
	@echo "  2. 启动开发环境："
	@echo "     make dev"
	@echo ""
	@echo "  3. 访问应用："
	@echo "     - 后端 API: http://localhost:8000"
	@echo "     - API 文档: http://localhost:8000/docs"
	@echo "     - 前端应用: http://localhost:5173"
	@echo ""

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
stop:
	docker compose down
	@echo "开发环境已停止"

# 停止开发环境（别名）
dev-down: stop

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
	cd backend && uv run pre-commit install

# 清理临时文件
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name htmlcov -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ 临时文件已清理"

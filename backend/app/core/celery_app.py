"""
Celery app configuration for async tasks
"""
from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

# 创建 Celery 应用
celery_app = Celery(
    "cpa_master_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Celery 配置
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000,
)

# 任务路由配置
celery_app.conf.task_routes = {
    "app.tasks.email.*": {"queue": "email"},
    "app.tasks.ai.*": {"queue": "ai"},
    "app.tasks.ocr.*": {"queue": "ocr"},
}

# 定时任务配置 (Celery Beat)
celery_app.conf.beat_schedule = {
    # 示例：每天凌晨1点清理过期数据
    "cleanup-expired-data": {
        "task": "app.tasks.maintenance.cleanup_expired_data",
        "schedule": crontab(hour=1, minute=0),
    },
}

# 自动发现任务模块
celery_app.autodiscover_tasks(["app.tasks"])

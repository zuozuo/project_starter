"""
短信验证码服务

功能：
- 生成随机验证码
- 存储验证码到 Redis
- 验证用户输入的验证码
- 调用阿里云短信服务发送短信
"""
import logging
import random
import string

import redis

from app.core.config import settings

logger = logging.getLogger(__name__)

# Redis 客户端
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

# Redis key 前缀
SMS_CODE_PREFIX = "sms:code:"
SMS_RATE_LIMIT_PREFIX = "sms:rate:"


def generate_code(length: int = 6) -> str:
    """生成随机数字验证码"""
    return "".join(random.choices(string.digits, k=length))


def get_sms_key(phone: str) -> str:
    """获取验证码存储的 Redis key"""
    return f"{SMS_CODE_PREFIX}{phone}"


def get_rate_limit_key(phone: str) -> str:
    """获取频率限制的 Redis key"""
    return f"{SMS_RATE_LIMIT_PREFIX}{phone}"


def store_code(phone: str, code: str) -> None:
    """存储验证码到 Redis"""
    key = get_sms_key(phone)
    expire_seconds = settings.SMS_CODE_EXPIRE_MINUTES * 60
    redis_client.setex(key, expire_seconds, code)


def get_stored_code(phone: str) -> str | None:
    """从 Redis 获取存储的验证码"""
    key = get_sms_key(phone)
    return redis_client.get(key)


def delete_code(phone: str) -> None:
    """删除已使用的验证码"""
    key = get_sms_key(phone)
    redis_client.delete(key)


def check_rate_limit(phone: str) -> bool:
    """
    检查是否可以发送短信（频率限制）
    返回 True 表示可以发送，False 表示需要等待
    """
    key = get_rate_limit_key(phone)
    if redis_client.exists(key):
        return False
    return True


def set_rate_limit(phone: str, seconds: int = 60) -> None:
    """设置频率限制（默认60秒内不能重复发送）"""
    key = get_rate_limit_key(phone)
    redis_client.setex(key, seconds, "1")


def verify_code(phone: str, code: str) -> bool:
    """验证用户输入的验证码"""
    stored_code = get_stored_code(phone)
    if stored_code is None:
        return False
    if stored_code != code:
        return False
    # 验证成功后删除验证码
    delete_code(phone)
    return True


async def send_sms(phone: str, code: str) -> bool:
    """
    发送短信验证码

    这里实现阿里云短信服务的调用
    如果没有配置短信服务，在开发环境中直接返回成功
    """
    # 检查是否配置了短信服务
    if not all(
        [
            settings.SMS_ACCESS_KEY_ID,
            settings.SMS_ACCESS_KEY_SECRET,
            settings.SMS_SIGN_NAME,
            settings.SMS_TEMPLATE_CODE,
        ]
    ):
        # 开发环境：直接打印验证码并返回成功
        logger.warning(f"SMS service not configured. Code for {phone}: {code}")
        return True

    try:
        # 阿里云短信服务
        from alibabacloud_dysmsapi20170525 import models as dysmsapi_20170525_models
        from alibabacloud_dysmsapi20170525.client import (
            Client as Dysmsapi20170525Client,
        )
        from alibabacloud_tea_openapi import models as open_api_models

        config = open_api_models.Config(
            access_key_id=settings.SMS_ACCESS_KEY_ID,
            access_key_secret=settings.SMS_ACCESS_KEY_SECRET,
        )
        config.endpoint = "dysmsapi.aliyuncs.com"
        client = Dysmsapi20170525Client(config)

        send_sms_request = dysmsapi_20170525_models.SendSmsRequest(
            phone_numbers=phone,
            sign_name=settings.SMS_SIGN_NAME,
            template_code=settings.SMS_TEMPLATE_CODE,
            template_param=f'{{"code":"{code}"}}',
        )

        response = client.send_sms(send_sms_request)

        if response.body.code == "OK":
            logger.info(f"SMS sent successfully to {phone}")
            return True
        else:
            logger.error(f"SMS send failed: {response.body.message}")
            return False

    except ImportError:
        # 如果没有安装阿里云SDK，在开发环境中直接返回成功
        logger.warning(f"Aliyun SDK not installed. Code for {phone}: {code}")
        return True
    except Exception as e:
        logger.error(f"SMS send error: {e}")
        return False


async def send_verification_code(phone: str) -> tuple[bool, str]:
    """
    发送验证码的完整流程

    返回: (是否成功, 消息)
    """
    # 检查频率限制
    if not check_rate_limit(phone):
        return False, "请求过于频繁，请稍后再试"

    # 生成验证码
    code = generate_code(settings.SMS_CODE_LENGTH)

    # 发送短信
    success = await send_sms(phone, code)

    if success:
        # 存储验证码
        store_code(phone, code)
        # 设置频率限制
        set_rate_limit(phone)
        return True, "验证码已发送"
    else:
        return False, "短信发送失败，请稍后再试"

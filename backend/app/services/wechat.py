"""
微信登录服务

功能：
- 通过 code 换取 access_token 和 openid
- 获取微信用户信息（昵称、头像）
"""
import logging
from dataclasses import dataclass

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# 微信 API 地址
WECHAT_ACCESS_TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/access_token"
WECHAT_USER_INFO_URL = "https://api.weixin.qq.com/sns/userinfo"


@dataclass
class WechatUserInfo:
    """微信用户信息"""

    openid: str
    unionid: str | None = None
    nickname: str | None = None
    avatar: str | None = None


@dataclass
class WechatAccessToken:
    """微信 access_token 响应"""

    access_token: str
    expires_in: int
    refresh_token: str
    openid: str
    scope: str
    unionid: str | None = None


class WechatServiceError(Exception):
    """微信服务异常"""

    pass


async def get_access_token(code: str) -> WechatAccessToken:
    """
    通过 code 换取 access_token

    微信开放平台 APP 登录流程：
    1. APP 端调用微信 SDK 获取 code
    2. 服务端用 code 换取 access_token 和 openid
    """
    if not settings.WECHAT_APP_ID or not settings.WECHAT_APP_SECRET:
        # 开发环境：返回模拟数据
        logger.warning("WeChat service not configured. Using mock data.")
        return WechatAccessToken(
            access_token="mock_access_token",
            expires_in=7200,
            refresh_token="mock_refresh_token",
            openid=f"mock_openid_{code}",
            scope="snsapi_userinfo",
            unionid=f"mock_unionid_{code}",
        )

    params = {
        "appid": settings.WECHAT_APP_ID,
        "secret": settings.WECHAT_APP_SECRET,
        "code": code,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(WECHAT_ACCESS_TOKEN_URL, params=params)
            data = response.json()

            if "errcode" in data:
                logger.error(f"WeChat access_token error: {data}")
                raise WechatServiceError(
                    f"微信授权失败: {data.get('errmsg', '未知错误')}"
                )

            return WechatAccessToken(
                access_token=data["access_token"],
                expires_in=data["expires_in"],
                refresh_token=data["refresh_token"],
                openid=data["openid"],
                scope=data["scope"],
                unionid=data.get("unionid"),
            )
        except httpx.HTTPError as e:
            logger.error(f"WeChat API request error: {e}")
            raise WechatServiceError("微信服务请求失败")


async def get_user_info(access_token: str, openid: str) -> WechatUserInfo:
    """
    获取微信用户信息

    需要 scope 包含 snsapi_userinfo
    """
    if not settings.WECHAT_APP_ID or not settings.WECHAT_APP_SECRET:
        # 开发环境：返回模拟数据
        logger.warning("WeChat service not configured. Using mock user info.")
        return WechatUserInfo(
            openid=openid,
            unionid=f"mock_unionid_{openid}",
            nickname="微信用户",
            avatar="https://thirdwx.qlogo.cn/mmopen/vi_32/mock_avatar/132",
        )

    params = {
        "access_token": access_token,
        "openid": openid,
        "lang": "zh_CN",
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(WECHAT_USER_INFO_URL, params=params)
            data = response.json()

            if "errcode" in data:
                logger.error(f"WeChat user info error: {data}")
                raise WechatServiceError(
                    f"获取用户信息失败: {data.get('errmsg', '未知错误')}"
                )

            return WechatUserInfo(
                openid=data["openid"],
                unionid=data.get("unionid"),
                nickname=data.get("nickname"),
                avatar=data.get("headimgurl"),
            )
        except httpx.HTTPError as e:
            logger.error(f"WeChat API request error: {e}")
            raise WechatServiceError("微信服务请求失败")


async def wechat_login(code: str) -> WechatUserInfo:
    """
    微信登录完整流程

    1. 通过 code 获取 access_token
    2. 获取用户信息
    """
    token_info = await get_access_token(code)
    user_info = await get_user_info(token_info.access_token, token_info.openid)

    # 如果从 access_token 响应中获取到了 unionid，优先使用
    if token_info.unionid and not user_info.unionid:
        user_info.unionid = token_info.unionid

    return user_info

"""
认证路由

包含:
- 短信验证码发送
- 手机号注册/登录
- 微信登录
- 绑定手机号
"""
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.core import security
from app.core.config import settings
from app.models import (
    BindPhoneRequest,
    Message,
    PhoneRegister,
    PhoneSmsLogin,
    SendSmsRequest,
    Token,
    UserPublic,
    WechatLoginRequest,
    WechatLoginResponse,
)
from app.services import sms
from app.services.wechat import WechatServiceError, wechat_login

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/sms/send", response_model=Message)
async def send_sms_code(body: SendSmsRequest) -> Message:
    """
    发送短信验证码

    - 同一手机号60秒内只能发送一次
    - 验证码有效期5分钟
    """
    success, message = await sms.send_verification_code(body.phone)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return Message(message=message)


@router.post("/phone/register", response_model=Token)
async def phone_register(session: SessionDep, body: PhoneRegister) -> Token:
    """
    手机号注册

    - 验证码验证通过后创建新用户
    - 返回 JWT Token
    """
    # 验证验证码
    if not sms.verify_code(body.phone, body.code):
        raise HTTPException(status_code=400, detail="验证码错误或已过期")

    # 检查手机号是否已注册
    existing_user = crud.get_user_by_phone(session=session, phone=body.phone)
    if existing_user:
        raise HTTPException(status_code=400, detail="该手机号已注册")

    # 创建用户
    user = crud.create_user_by_phone(
        session=session, phone=body.phone, nickname=body.nickname
    )

    # 生成 Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/phone/login", response_model=Token)
async def phone_login(session: SessionDep, body: PhoneSmsLogin) -> Token:
    """
    手机号验证码登录

    - 验证码验证通过后登录
    - 如果用户不存在，自动创建新用户
    - 返回 JWT Token
    """
    # 验证验证码
    if not sms.verify_code(body.phone, body.code):
        raise HTTPException(status_code=400, detail="验证码错误或已过期")

    # 查找或创建用户
    user = crud.get_user_by_phone(session=session, phone=body.phone)
    if not user:
        # 自动注册新用户
        user = crud.create_user_by_phone(session=session, phone=body.phone)

    if not user.is_active:
        raise HTTPException(status_code=400, detail="用户已被禁用")

    # 生成 Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/wechat/login", response_model=WechatLoginResponse)
async def wechat_login_endpoint(
    session: SessionDep, body: WechatLoginRequest
) -> WechatLoginResponse:
    """
    微信登录

    - 使用微信 code 换取用户信息
    - 如果是新用户，创建用户记录
    - 返回 JWT Token 和是否已绑定手机号
    """
    try:
        wechat_info = await wechat_login(body.code)
    except WechatServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 先尝试通过 UnionID 查找（跨应用用户识别）
    user = None
    if wechat_info.unionid:
        user = crud.get_user_by_wechat_unionid(
            session=session, unionid=wechat_info.unionid
        )

    # 再尝试通过 OpenID 查找
    if not user:
        user = crud.get_user_by_wechat_openid(
            session=session, openid=wechat_info.openid
        )

    # 如果是新用户，创建用户记录
    if not user:
        user = crud.create_user_by_wechat(session=session, wechat_info=wechat_info)
    else:
        # 更新微信信息（头像、昵称可能变化）
        user = crud.update_user_wechat_info(
            session=session, db_user=user, wechat_info=wechat_info
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="用户已被禁用")

    # 生成 Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )

    # 检查是否已绑定手机号
    is_phone_bound = bool(user.phone and user.is_phone_verified)

    return WechatLoginResponse(
        access_token=access_token,
        is_phone_bound=is_phone_bound,
        user=UserPublic.model_validate(user),
    )


@router.post("/bind-phone", response_model=UserPublic)
async def bind_phone(
    session: SessionDep, current_user: CurrentUser, body: BindPhoneRequest
) -> Any:
    """
    绑定手机号

    - 需要登录状态
    - 验证码验证通过后绑定手机号
    """
    # 验证验证码
    if not sms.verify_code(body.phone, body.code):
        raise HTTPException(status_code=400, detail="验证码错误或已过期")

    # 检查手机号是否已被其他用户使用
    existing_user = crud.get_user_by_phone(session=session, phone=body.phone)
    if existing_user and existing_user.id != current_user.id:
        raise HTTPException(status_code=400, detail="该手机号已被其他账号绑定")

    # 绑定手机号
    user = crud.bind_phone_to_user(
        session=session, db_user=current_user, phone=body.phone
    )

    return user


@router.get("/me", response_model=UserPublic)
def get_current_user(current_user: CurrentUser) -> Any:
    """
    获取当前登录用户信息
    """
    return current_user

import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate
from app.services.wechat import WechatUserInfo


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


# Phone-related CRUD functions
def get_user_by_phone(*, session: Session, phone: str) -> User | None:
    """通过手机号查找用户"""
    statement = select(User).where(User.phone == phone)
    return session.exec(statement).first()


def create_user_by_phone(
    *, session: Session, phone: str, nickname: str | None = None
) -> User:
    """通过手机号创建用户"""
    db_obj = User(
        phone=phone,
        nickname=nickname or f"用户{phone[-4:]}",
        is_phone_verified=True,
        hashed_password="",  # 手机号登录不需要密码
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


# WeChat-related CRUD functions
def get_user_by_wechat_openid(*, session: Session, openid: str) -> User | None:
    """通过微信 OpenID 查找用户"""
    statement = select(User).where(User.wechat_openid == openid)
    return session.exec(statement).first()


def get_user_by_wechat_unionid(*, session: Session, unionid: str) -> User | None:
    """通过微信 UnionID 查找用户"""
    statement = select(User).where(User.wechat_unionid == unionid)
    return session.exec(statement).first()


def create_user_by_wechat(*, session: Session, wechat_info: WechatUserInfo) -> User:
    """通过微信信息创建用户"""
    db_obj = User(
        wechat_openid=wechat_info.openid,
        wechat_unionid=wechat_info.unionid,
        nickname=wechat_info.nickname,
        avatar=wechat_info.avatar,
        hashed_password="",  # 微信登录不需要密码
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user_wechat_info(
    *, session: Session, db_user: User, wechat_info: WechatUserInfo
) -> User:
    """更新用户的微信信息"""
    db_user.wechat_openid = wechat_info.openid
    if wechat_info.unionid:
        db_user.wechat_unionid = wechat_info.unionid
    if wechat_info.nickname and not db_user.nickname:
        db_user.nickname = wechat_info.nickname
    if wechat_info.avatar and not db_user.avatar:
        db_user.avatar = wechat_info.avatar
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def bind_phone_to_user(*, session: Session, db_user: User, phone: str) -> User:
    """绑定手机号到用户"""
    db_user.phone = phone
    db_user.is_phone_verified = True
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

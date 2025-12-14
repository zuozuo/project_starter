import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr | None = Field(
        default=None, unique=True, index=True, max_length=255
    )
    phone: str | None = Field(default=None, unique=True, index=True, max_length=20)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    nickname: str | None = Field(default=None, max_length=100)
    avatar: str | None = Field(default=None, max_length=500)
    wechat_openid: str | None = Field(
        default=None, unique=True, index=True, max_length=100
    )
    wechat_unionid: str | None = Field(default=None, index=True, max_length=100)
    is_phone_verified: bool = False


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


# Phone authentication models
class SendSmsRequest(SQLModel):
    phone: str = Field(min_length=11, max_length=11)


class PhoneRegister(SQLModel):
    phone: str = Field(min_length=11, max_length=11)
    code: str = Field(min_length=4, max_length=6)
    nickname: str | None = Field(default=None, max_length=100)


class PhoneSmsLogin(SQLModel):
    phone: str = Field(min_length=11, max_length=11)
    code: str = Field(min_length=4, max_length=6)


# WeChat authentication models
class WechatLoginRequest(SQLModel):
    code: str = Field(min_length=1)


class WechatLoginResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    is_phone_bound: bool
    user: "UserPublic"


# Bind phone models
class BindPhoneRequest(SQLModel):
    phone: str = Field(min_length=11, max_length=11)
    code: str = Field(min_length=4, max_length=6)

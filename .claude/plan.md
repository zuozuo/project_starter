# 微信+手机号注册功能实现计划

## 需求概述
- **微信登录**: 微信APP登录（通过微信开放平台SDK拉起微信授权）
- **手机号注册**: 需要短信验证码验证
- **账号绑定**: 微信登录后必须绑定手机号才能使用
- **UI风格**: 文艺小清新风格

---

## 一、后端实现

### 1.1 数据库模型修改 (`backend/app/models.py`)

扩展 User 模型，添加以下字段：
```python
# User 模型新增字段
phone: str | None          # 手机号（唯一索引）
wechat_openid: str | None  # 微信 OpenID（唯一索引）
wechat_unionid: str | None # 微信 UnionID（跨应用用户识别）
avatar: str | None         # 用户头像URL
nickname: str | None       # 用户昵称
is_phone_verified: bool    # 手机号是否已验证
```

新增 Pydantic 模型：
- `PhoneRegister`: 手机号注册请求
- `PhoneSmsLogin`: 手机号+验证码登录请求
- `WechatLoginRequest`: 微信登录请求
- `BindPhoneRequest`: 绑定手机号请求
- `SendSmsRequest`: 发送验证码请求

### 1.2 配置文件修改 (`backend/app/core/config.py`)

添加微信和短信相关配置：
```python
# 微信开放平台配置
WECHAT_APP_ID: str | None = None
WECHAT_APP_SECRET: str | None = None

# 短信服务配置 (以阿里云为例)
SMS_ACCESS_KEY_ID: str | None = None
SMS_ACCESS_KEY_SECRET: str | None = None
SMS_SIGN_NAME: str | None = None
SMS_TEMPLATE_CODE: str | None = None

# 验证码配置
SMS_CODE_EXPIRE_MINUTES: int = 5  # 验证码有效期
```

### 1.3 新建短信服务 (`backend/app/services/sms.py`)

功能：
- 生成随机6位验证码
- 存储验证码到 Redis（带过期时间）
- 验证用户输入的验证码
- 调用短信服务商API发送短信

### 1.4 新建微信服务 (`backend/app/services/wechat.py`)

功能：
- 通过 code 换取 access_token 和 openid
- 获取微信用户信息（昵称、头像）
- 微信用户登录/注册逻辑

### 1.5 新建认证路由 (`backend/app/api/routes/auth.py`)

API 端点：

| 方法 | 路径 | 功能 |
|------|------|------|
| POST | `/auth/sms/send` | 发送短信验证码 |
| POST | `/auth/phone/register` | 手机号+验证码注册 |
| POST | `/auth/phone/login` | 手机号+验证码登录 |
| POST | `/auth/wechat/login` | 微信登录（code换token） |
| POST | `/auth/bind-phone` | 绑定手机号（需登录） |
| GET  | `/auth/me` | 获取当前用户信息 |

### 1.6 修改 CRUD 函数 (`backend/app/crud.py`)

新增函数：
- `get_user_by_phone()`: 通过手机号查找用户
- `get_user_by_wechat_openid()`: 通过微信OpenID查找用户
- `create_user_by_phone()`: 通过手机号创建用户
- `create_user_by_wechat()`: 通过微信创建用户
- `bind_phone_to_user()`: 绑定手机号到用户

### 1.7 数据库迁移

运行 Alembic 迁移：
```bash
alembic revision --autogenerate -m "add phone and wechat fields to user"
alembic upgrade head
```

---

## 二、前端实现

### 2.1 项目结构

```
frontend/src/
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx         # 登录页面（主入口）
│   │   ├── PhoneLoginPage.tsx    # 手机号登录
│   │   ├── RegisterPage.tsx      # 手机号注册
│   │   └── BindPhonePage.tsx     # 绑定手机号
│   └── home/
│       └── HomePage.tsx          # 首页
├── components/
│   ├── auth/
│   │   ├── PhoneInput.tsx        # 手机号输入组件
│   │   ├── SmsCodeInput.tsx      # 验证码输入组件
│   │   └── WechatLoginButton.tsx # 微信登录按钮
│   └── common/
│       └── LoadingSpinner.tsx    # 加载组件
├── stores/
│   └── authStore.ts              # 认证状态管理 (Zustand)
├── services/
│   └── authService.ts            # 认证API服务
├── hooks/
│   └── useAuth.ts                # 认证相关hooks
└── theme/
    └── variables.css             # 文艺小清新主题变量
```

### 2.2 UI 设计 - 文艺小清新风格

**配色方案：**
- 主色调: `#7C9A8E` (莫兰迪绿)
- 辅助色: `#E8D5C4` (暖米色)
- 背景色: `#FAF8F5` (象牙白)
- 强调色: `#D4A574` (焦糖色)
- 文字色: `#4A4A4A` (深灰)

**设计特点：**
- 大量留白，呼吸感
- 圆角设计 (16px+)
- 柔和的阴影
- 手写体/衬线字体标题
- 植物、书籍等小插画装饰
- 温暖的渐变背景

### 2.3 页面流程

```
[启动App]
    │
    ▼
[登录页面] ─────────────────────────────────┐
    │                                       │
    ├── [微信登录] ──▶ 微信授权 ──▶ 检查绑定 ─┤
    │                      │                │
    │                      ▼                │
    │              [绑定手机号页面]          │
    │                      │                │
    │                      ▼                │
    ├── [手机号登录] ──────────────────────▶ [首页]
    │                                       │
    └── [注册] ──▶ [注册页面] ──────────────┘
```

### 2.4 状态管理 (Zustand)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isPhoneBound: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### 2.5 路由配置

```typescript
const routes = [
  { path: '/login', component: LoginPage },
  { path: '/phone-login', component: PhoneLoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/bind-phone', component: BindPhonePage, guard: requireAuth },
  { path: '/home', component: HomePage, guard: requireAuthAndPhone },
];
```

---

## 三、文件修改清单

### 后端文件
| 操作 | 文件路径 |
|------|----------|
| 修改 | `backend/app/models.py` |
| 修改 | `backend/app/core/config.py` |
| 修改 | `backend/app/crud.py` |
| 修改 | `backend/app/api/main.py` |
| 新增 | `backend/app/services/sms.py` |
| 新增 | `backend/app/services/wechat.py` |
| 新增 | `backend/app/api/routes/auth.py` |

### 前端文件
| 操作 | 文件路径 |
|------|----------|
| 修改 | `frontend/src/App.tsx` |
| 修改 | `frontend/src/index.css` |
| 新增 | `frontend/src/theme/variables.css` |
| 新增 | `frontend/src/stores/authStore.ts` |
| 新增 | `frontend/src/services/authService.ts` |
| 新增 | `frontend/src/hooks/useAuth.ts` |
| 新增 | `frontend/src/pages/auth/LoginPage.tsx` |
| 新增 | `frontend/src/pages/auth/PhoneLoginPage.tsx` |
| 新增 | `frontend/src/pages/auth/RegisterPage.tsx` |
| 新增 | `frontend/src/pages/auth/BindPhonePage.tsx` |
| 新增 | `frontend/src/pages/home/HomePage.tsx` |
| 新增 | `frontend/src/components/auth/PhoneInput.tsx` |
| 新增 | `frontend/src/components/auth/SmsCodeInput.tsx` |
| 新增 | `frontend/src/components/auth/WechatLoginButton.tsx` |

---

## 四、实现顺序

1. **后端基础** (优先)
   - 修改 User 模型
   - 添加配置项
   - 创建数据库迁移

2. **后端服务层**
   - 实现 SMS 服务
   - 实现微信服务
   - 实现 CRUD 函数

3. **后端 API 层**
   - 实现认证路由
   - 注册路由到主应用

4. **前端基础**
   - 配置主题变量
   - 创建状态管理
   - 配置路由

5. **前端页面**
   - 实现登录页面
   - 实现手机号登录/注册
   - 实现绑定手机号页面
   - 实现首页

6. **测试和调试**
   - 后端 API 测试
   - 前端集成测试
   - 完整流程测试

---

## 五、环境变量

需要在 `.env` 文件中添加：

```env
# 微信开放平台
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 短信服务 (阿里云示例)
SMS_ACCESS_KEY_ID=your_access_key_id
SMS_ACCESS_KEY_SECRET=your_access_key_secret
SMS_SIGN_NAME=your_sign_name
SMS_TEMPLATE_CODE=your_template_code
```

---

## 六、注意事项

1. **安全性**
   - 验证码限流（同一手机号1分钟只能发送1次）
   - 验证码尝试次数限制
   - 微信 access_token 不要返回给前端

2. **用户体验**
   - 验证码输入支持粘贴
   - 倒计时重发按钮
   - 加载状态和错误提示
   - 登录状态持久化

3. **兼容性**
   - iOS/Android 微信SDK兼容
   - 手机号格式验证

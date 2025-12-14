# 移动端开发指南

本文档介绍如何在本项目中测试手机端界面以及如何将应用打包成原生 App。

## 目录

- [技术栈说明](#技术栈说明)
- [环境准备](#环境准备)
- [测试手机端界面](#测试手机端界面)
- [打包成原生 App](#打包成原生-app)
- [常见问题](#常见问题)

---

## 技术栈说明

本项目使用以下技术实现跨平台移动端支持：

- **Ionic Framework v8** - 提供移动端 UI 组件，自动适配 iOS/Android 风格
- **Capacitor v6** - 将 Web 应用打包成原生 App，并提供原生 API 访问能力

## 环境准备

### 通用依赖

```bash
# 确保 Node.js 已安装 (推荐 v18+)
node --version

# 进入前端目录
cd frontend

# 安装依赖
npm install
```

### Android 开发环境

1. **安装 Android Studio**
   - 下载地址：https://developer.android.com/studio
   - 安装时勾选 Android SDK、Android SDK Platform、Android Virtual Device

2. **配置环境变量**（macOS/Linux）
   ```bash
   # 添加到 ~/.zshrc 或 ~/.bashrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **创建模拟器**
   - 打开 Android Studio → Tools → Device Manager
   - 点击 "Create Device" 创建一个虚拟设备（推荐 Pixel 6 + API 33）

### iOS 开发环境（仅 macOS）

1. **安装 Xcode**
   ```bash
   # 从 App Store 安装 Xcode (需要 macOS)
   # 或使用命令行工具
   xcode-select --install
   ```

2. **安装 CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

---

## 测试手机端界面

### 方法一：浏览器开发者工具（推荐日常开发）

最快速的测试方式，无需任何额外配置：

```bash
cd frontend
npm run dev
```

然后在浏览器中：
1. 打开 http://localhost:5173
2. 按 `F12` 或 `Cmd+Option+I` 打开开发者工具
3. 点击设备模拟按钮（手机图标）或按 `Cmd+Shift+M`
4. 选择不同的设备型号（iPhone 14、Pixel 7 等）

**优点**：
- 即时热更新
- 方便调试 CSS 和 JavaScript
- 可以模拟不同屏幕尺寸和设备

### 方法二：Ionic Lab（多平台并排预览）

Ionic Lab 可以同时显示 iOS 和 Android 两种风格的界面：

```bash
# 安装 Ionic CLI（如果未安装）
npm install -g @ionic/cli

# 启动 Ionic Lab
cd frontend
ionic serve --lab
```

浏览器会打开一个页面，左右分别显示 iOS 和 Android 风格的界面。

### 方法三：真机调试（USB 连接）

#### Android 真机

1. **开启开发者选项**
   - 设置 → 关于手机 → 连续点击"版本号"7次
   - 返回设置 → 开发者选项 → 开启"USB调试"

2. **连接并运行**
   ```bash
   cd frontend

   # 构建 Web 资源
   npm run build

   # 添加 Android 平台（首次需要）
   npx cap add android

   # 同步 Web 资源到原生项目
   npx cap sync android

   # 在连接的设备上运行
   npx cap run android
   ```

#### iOS 真机（需要 macOS）

1. **注册 Apple Developer 账号**（免费账号可用于开发测试）

2. **连接并运行**
   ```bash
   cd frontend

   npm run build
   npx cap add ios      # 首次需要
   npx cap sync ios
   npx cap run ios
   ```

3. **在 Xcode 中配置签名**
   - 打开 `ios/App/App.xcworkspace`
   - 选择你的开发团队进行签名

### 方法四：模拟器调试

#### Android 模拟器

```bash
cd frontend
npm run build
npx cap sync android

# 打开 Android Studio
npx cap open android

# 在 Android Studio 中点击运行按钮，选择模拟器
```

#### iOS 模拟器（需要 macOS）

```bash
cd frontend
npm run build
npx cap sync ios

# 打开 Xcode
npx cap open ios

# 在 Xcode 中选择模拟器并点击运行
```

### 方法五：热更新调试（Live Reload）

开发时使用 Live Reload 可以实时看到代码变化：

1. **修改 Capacitor 配置**

   编辑 `frontend/capacitor.config.ts`：
   ```typescript
   import type { CapacitorConfig } from '@capacitor/cli';

   const config: CapacitorConfig = {
     appId: 'com.yourcompany.app',
     appName: 'Your App Name',
     webDir: 'dist',
     server: {
       androidScheme: 'https',
       // 开发时添加以下配置（注意替换为你的本机 IP）
       url: 'http://192.168.1.100:5173',
       cleartext: true,
     },
   };

   export default config;
   ```

2. **获取本机 IP 地址**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # 或者
   ipconfig getifaddr en0
   ```

3. **启动开发服务器并同步**
   ```bash
   cd frontend
   npm run dev -- --host    # 允许局域网访问
   npx cap sync
   npx cap run android      # 或 ios
   ```

**注意**：发布前记得移除 `server.url` 配置！

---

## 打包成原生 App

### 打包 Android APK/AAB

#### 1. 准备工作

```bash
cd frontend

# 构建生产版本的 Web 资源
npm run build

# 同步到 Android 项目
npx cap sync android
```

#### 2. 打开 Android Studio

```bash
npx cap open android
```

#### 3. 生成签名密钥（首次需要）

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

按提示输入密码和信息，妥善保管生成的 `.keystore` 文件。

#### 4. 配置签名（推荐方式）

在 `frontend/android/app/build.gradle` 中添加签名配置：

```groovy
android {
    ...
    signingConfigs {
        release {
            storeFile file('path/to/my-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 5. 构建发布版本

**方式 A：通过 Android Studio**
- Build → Generate Signed Bundle / APK
- 选择 Android App Bundle (AAB) 用于 Google Play
- 选择 APK 用于直接安装

**方式 B：通过命令行**
```bash
cd frontend/android

# 构建 APK
./gradlew assembleRelease

# 构建 AAB (用于 Google Play)
./gradlew bundleRelease
```

输出文件位置：
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### 打包 iOS IPA（需要 macOS）

#### 1. 准备工作

```bash
cd frontend

# 构建生产版本
npm run build

# 同步到 iOS 项目
npx cap sync ios

# 打开 Xcode
npx cap open ios
```

#### 2. 配置项目

在 Xcode 中：
1. 选择项目 → Signing & Capabilities
2. 选择你的 Team（需要 Apple Developer 账号）
3. 设置 Bundle Identifier（必须唯一）

#### 3. 归档并导出

1. Product → Archive（确保选择了 "Any iOS Device"）
2. 归档完成后，在 Organizer 中选择归档
3. 点击 "Distribute App"
4. 选择分发方式：
   - **App Store Connect** - 上传到 App Store
   - **Ad Hoc** - 分发给测试设备
   - **Enterprise** - 企业内部分发
   - **Development** - 开发测试

#### 4. 命令行构建（可选）

```bash
cd frontend/ios/App

# 归档
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release archive -archivePath build/App.xcarchive

# 导出 IPA
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportPath build/output -exportOptionsPlist ExportOptions.plist
```

---

## 应用配置

### 修改应用信息

编辑 `frontend/capacitor.config.ts`：

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.yourapp',  // 应用唯一标识符
  appName: '你的应用名称',             // 应用显示名称
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};
```

### 设置应用图标和启动画面

1. **准备图标源文件**
   - 创建 1024x1024 的 PNG 图标

2. **使用 Capacitor Assets**
   ```bash
   npm install -g @capacitor/assets

   # 将图标放在 frontend/resources/icon.png
   # 将启动画面放在 frontend/resources/splash.png

   npx capacitor-assets generate
   ```

### 配置权限

#### Android 权限

编辑 `frontend/android/app/src/main/AndroidManifest.xml`：

```xml
<manifest>
    <!-- 网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- 相机权限（如需要）-->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- 存储权限（如需要）-->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
</manifest>
```

#### iOS 权限

编辑 `frontend/ios/App/App/Info.plist`：

```xml
<key>NSCameraUsageDescription</key>
<string>需要使用相机拍照</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>需要访问相册选择图片</string>
```

---

## 常用命令速查

```bash
# 开发相关
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本

# Capacitor 相关
npx cap add android      # 添加 Android 平台
npx cap add ios          # 添加 iOS 平台
npx cap sync             # 同步 Web 资源到原生项目
npx cap copy             # 仅复制 Web 资源（不更新原生依赖）
npx cap open android     # 打开 Android Studio
npx cap open ios         # 打开 Xcode
npx cap run android      # 在 Android 设备/模拟器上运行
npx cap run ios          # 在 iOS 设备/模拟器上运行

# 检查环境
npx cap doctor           # 检查 Capacitor 环境配置
```

---

## 常见问题

### Q: Android Studio 找不到设备？

1. 确保 USB 调试已开启
2. 检查 USB 连接模式是否为"文件传输"
3. 运行 `adb devices` 查看设备列表
4. 尝试重新插拔 USB 或重启 adb：`adb kill-server && adb start-server`

### Q: iOS 构建失败，提示签名问题？

1. 确保在 Xcode 中登录了 Apple ID
2. Signing & Capabilities 中选择了正确的 Team
3. 如果是免费账号，只能在真机上测试，无法上架 App Store

### Q: Live Reload 不工作？

1. 确保手机和电脑在同一局域网
2. 检查防火墙是否阻止了端口访问
3. 确保 `capacitor.config.ts` 中的 IP 地址正确
4. Android 需要添加 `cleartext: true` 配置

### Q: 应用图标没有更新？

1. 清除应用缓存
2. 卸载旧版本应用
3. 执行 `npx cap sync` 重新同步
4. 在 Android Studio/Xcode 中 Clean Build

### Q: 构建的 APK 体积太大？

1. 在 `build.gradle` 中启用代码压缩：
   ```groovy
   buildTypes {
       release {
           minifyEnabled true
           shrinkResources true
       }
   }
   ```
2. 考虑使用 AAB 格式上传到 Google Play（会自动优化）

---

## 参考链接

- [Ionic Framework 文档](https://ionicframework.com/docs)
- [Capacitor 文档](https://capacitorjs.com/docs)
- [Android 开发者文档](https://developer.android.com/docs)
- [Apple 开发者文档](https://developer.apple.com/documentation/)

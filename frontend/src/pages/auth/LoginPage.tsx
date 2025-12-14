/**
 * 登录页面
 *
 * 文艺小清新风格的登录入口页面
 * 提供微信登录和手机号登录两种方式
 */
import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/react';
import { callOutline, logoWechat } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const history = useHistory();

  const handleWechatLogin = () => {
    // TODO: 调用微信 SDK 获取 code
    // 开发环境模拟
    const mockCode = 'mock_wechat_code_' + Date.now();
    history.push(`/wechat-callback?code=${mockCode}`);
  };

  const handlePhoneLogin = () => {
    history.push('/phone-login');
  };

  return (
    <IonPage>
      <IonContent className="login-page" fullscreen>
        <div className="login-container">
          {/* 装饰背景 */}
          <div className="login-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-leaf leaf-1"></div>
            <div className="decoration-leaf leaf-2"></div>
          </div>

          {/* Logo 和欢迎语 */}
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <span className="logo-text">Hi</span>
              </div>
            </div>
            <IonText className="login-title">
              <h1>欢迎回来</h1>
            </IonText>
            <IonText className="login-subtitle">
              <p>开启你的美好一天</p>
            </IonText>
          </div>

          {/* 登录按钮区域 */}
          <div className="login-actions">
            {/* 微信登录按钮 */}
            <IonButton
              expand="block"
              className="login-btn wechat-btn"
              onClick={handleWechatLogin}
            >
              <IonIcon slot="start" icon={logoWechat} />
              微信登录
            </IonButton>

            {/* 分割线 */}
            <div className="login-divider">
              <span className="divider-line"></span>
              <span className="divider-text">或</span>
              <span className="divider-line"></span>
            </div>

            {/* 手机号登录按钮 */}
            <IonButton
              expand="block"
              fill="outline"
              className="login-btn phone-btn"
              onClick={handlePhoneLogin}
            >
              <IonIcon slot="start" icon={callOutline} />
              手机号登录
            </IonButton>
          </div>

          {/* 底部协议 */}
          <div className="login-footer">
            <IonText className="footer-text">
              <p>
                登录即表示同意
                <a href="/terms" className="link">《用户协议》</a>
                和
                <a href="/privacy" className="link">《隐私政策》</a>
              </p>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;

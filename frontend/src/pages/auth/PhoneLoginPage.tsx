/**
 * 手机号登录页面
 *
 * 文艺小清新风格的手机号+验证码登录页面
 */
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonInput,
  IonText,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useSendSmsCode, usePhoneLogin } from '../../hooks/useAuth';
import './PhoneLoginPage.css';

const PhoneLoginPage: React.FC = () => {
  const history = useHistory();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const {
    send: sendCode,
    countdown,
    canSend,
    isSending,
    error: smsError,
  } = useSendSmsCode();

  const { login, isLoading, error: loginError } = usePhoneLogin();

  // 验证手机号格式
  const isValidPhone = /^1[3-9]\d{9}$/.test(phone);

  // 处理发送验证码
  const handleSendCode = async () => {
    if (!isValidPhone) {
      setToastMessage('请输入正确的手机号');
      setShowToast(true);
      return;
    }

    const success = await sendCode(phone);
    if (success) {
      setToastMessage('验证码已发送');
      setShowToast(true);
    } else if (smsError) {
      setToastMessage(smsError);
      setShowToast(true);
    }
  };

  // 处理登录
  const handleLogin = async () => {
    if (!isValidPhone) {
      setToastMessage('请输入正确的手机号');
      setShowToast(true);
      return;
    }

    if (code.length < 4) {
      setToastMessage('请输入验证码');
      setShowToast(true);
      return;
    }

    const success = await login(phone, code);
    if (success) {
      history.replace('/home');
    } else if (loginError) {
      setToastMessage(loginError);
      setShowToast(true);
    }
  };

  // 跳转注册
  const goToRegister = () => {
    history.push('/register');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" text="" />
          </IonButtons>
          <IonTitle>手机号登录</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="phone-login-page" fullscreen>
        <div className="phone-login-container">
          {/* 欢迎语 */}
          <div className="welcome-section">
            <IonText className="welcome-title">
              <h2>欢迎使用</h2>
            </IonText>
            <IonText className="welcome-subtitle">
              <p>输入手机号快速登录</p>
            </IonText>
          </div>

          {/* 表单区域 */}
          <div className="form-section">
            {/* 手机号输入 */}
            <div className="input-group">
              <div className="input-label">手机号</div>
              <div className="input-wrapper">
                <span className="input-prefix">+86</span>
                <IonInput
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  maxlength={11}
                  onIonInput={(e) => setPhone(e.detail.value || '')}
                  className="phone-input"
                />
              </div>
            </div>

            {/* 验证码输入 */}
            <div className="input-group">
              <div className="input-label">验证码</div>
              <div className="input-wrapper code-wrapper">
                <IonInput
                  type="tel"
                  placeholder="请输入验证码"
                  value={code}
                  maxlength={6}
                  onIonInput={(e) => setCode(e.detail.value || '')}
                  className="code-input"
                />
                <IonButton
                  fill="clear"
                  className="send-code-btn"
                  disabled={!canSend || !isValidPhone}
                  onClick={handleSendCode}
                >
                  {isSending ? (
                    <IonSpinner name="crescent" />
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    '获取验证码'
                  )}
                </IonButton>
              </div>
            </div>

            {/* 登录按钮 */}
            <IonButton
              expand="block"
              className="login-submit-btn"
              disabled={isLoading || !isValidPhone || code.length < 4}
              onClick={handleLogin}
            >
              {isLoading ? <IonSpinner name="crescent" /> : '登录'}
            </IonButton>

            {/* 注册入口 */}
            <div className="register-link">
              <IonText color="medium">
                还没有账号？
                <span className="link" onClick={goToRegister}>
                  立即注册
                </span>
              </IonText>
            </div>
          </div>

          {/* 装饰元素 */}
          <div className="decoration-bottom">
            <div className="deco-line"></div>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default PhoneLoginPage;

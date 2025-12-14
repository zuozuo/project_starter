/**
 * 绑定手机号页面
 *
 * 微信登录后需要绑定手机号
 */
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonText,
  IonSpinner,
  IonToast,
  IonIcon,
} from '@ionic/react';
import { shieldCheckmarkOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useSendSmsCode, useBindPhone } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import './BindPhonePage.css';

const BindPhonePage: React.FC = () => {
  const history = useHistory();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const user = useAuthStore((state) => state.user);

  const {
    send: sendCode,
    countdown,
    canSend,
    isSending,
    error: smsError,
  } = useSendSmsCode();

  const { bind, isLoading, error: bindError } = useBindPhone();

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

  // 处理绑定
  const handleBind = async () => {
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

    const success = await bind(phone, code);
    if (success) {
      setToastMessage('绑定成功');
      setShowToast(true);
      setTimeout(() => {
        history.replace('/home');
      }, 1000);
    } else if (bindError) {
      setToastMessage(bindError);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="bind-phone-page" fullscreen>
        <div className="bind-phone-container">
          {/* 头部图标 */}
          <div className="bind-header">
            <div className="bind-icon">
              <IonIcon icon={shieldCheckmarkOutline} />
            </div>
            <IonText className="bind-title">
              <h2>绑定手机号</h2>
            </IonText>
            <IonText className="bind-subtitle">
              <p>绑定手机号后可以使用更多功能</p>
            </IonText>

            {/* 用户信息 */}
            {user && (
              <div className="user-info">
                {user.avatar && (
                  <img src={user.avatar} alt="头像" className="user-avatar" />
                )}
                <span className="user-nickname">
                  {user.nickname || '微信用户'}
                </span>
              </div>
            )}
          </div>

          {/* 表单区域 */}
          <div className="bind-form">
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

            {/* 绑定按钮 */}
            <IonButton
              expand="block"
              className="bind-submit-btn"
              disabled={isLoading || !isValidPhone || code.length < 4}
              onClick={handleBind}
            >
              {isLoading ? <IonSpinner name="crescent" /> : '确认绑定'}
            </IonButton>
          </div>

          {/* 提示信息 */}
          <div className="bind-tips">
            <IonText color="medium">
              <p>绑定手机号后：</p>
              <ul>
                <li>可使用手机号登录</li>
                <li>账号更加安全</li>
                <li>解锁更多功能</li>
              </ul>
            </IonText>
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

export default BindPhonePage;

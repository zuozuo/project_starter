/**
 * 微信登录回调页面
 *
 * 处理微信授权回调
 */
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useWechatLogin } from '../../hooks/useAuth';
import './WechatCallbackPage.css';

const WechatCallbackPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { login, error } = useWechatLogin();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      // 从 URL 获取 code
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (!code) {
        setStatus('error');
        return;
      }

      const result = await login(code);

      if (result.success) {
        if (result.needBindPhone) {
          // 需要绑定手机号
          history.replace('/bind-phone');
        } else {
          // 登录成功，跳转首页
          history.replace('/home');
        }
      } else {
        setStatus('error');
      }
    };

    handleCallback();
  }, [location.search, login, history]);

  return (
    <IonPage>
      <IonContent className="wechat-callback-page" fullscreen>
        <div className="callback-container">
          {status === 'loading' && !error && (
            <>
              <IonSpinner name="crescent" className="loading-spinner" />
              <IonText className="loading-text">
                <p>正在登录...</p>
              </IonText>
            </>
          )}

          {(status === 'error' || error) && (
            <>
              <div className="error-icon">!</div>
              <IonText className="error-text">
                <p>{error || '登录失败，请重试'}</p>
              </IonText>
              <IonText
                className="retry-link"
                onClick={() => history.replace('/login')}
              >
                <p>返回登录</p>
              </IonText>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WechatCallbackPage;

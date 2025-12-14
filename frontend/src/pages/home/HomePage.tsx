/**
 * 首页
 *
 * 登录后的主页面
 */
import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonText,
  IonIcon,
  IonAvatar,
} from '@ionic/react';
import { logOutOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './HomePage.css';

const HomePage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>首页</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-page" fullscreen>
        <div className="home-container">
          {/* 用户信息卡片 */}
          <div className="user-card">
            <div className="user-card-header">
              <IonAvatar className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt="头像" />
                ) : (
                  <div className="avatar-placeholder">
                    <IonIcon icon={personOutline} />
                  </div>
                )}
              </IonAvatar>
              <div className="user-info">
                <IonText className="user-name">
                  <h3>{user?.nickname || user?.phone || '用户'}</h3>
                </IonText>
                <IonText className="user-phone">
                  <p>
                    {user?.phone
                      ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                      : '未绑定手机号'}
                  </p>
                </IonText>
              </div>
            </div>

            <div className="user-card-body">
              <div className="info-item">
                <span className="info-label">账号状态</span>
                <span className="info-value status-active">正常</span>
              </div>
              <div className="info-item">
                <span className="info-label">手机验证</span>
                <span
                  className={`info-value ${
                    user?.is_phone_verified ? 'status-verified' : 'status-unverified'
                  }`}
                >
                  {user?.is_phone_verified ? '已验证' : '未验证'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">微信绑定</span>
                <span
                  className={`info-value ${
                    user?.wechat_openid ? 'status-verified' : 'status-unverified'
                  }`}
                >
                  {user?.wechat_openid ? '已绑定' : '未绑定'}
                </span>
              </div>
            </div>
          </div>

          {/* 欢迎区域 */}
          <div className="welcome-card">
            <div className="welcome-decoration">
              <div className="deco-leaf"></div>
            </div>
            <IonText className="welcome-text">
              <h2>欢迎回来</h2>
              <p>愿你今天也有好心情</p>
            </IonText>
          </div>

          {/* 功能区域 */}
          <div className="action-section">
            <IonButton
              expand="block"
              fill="outline"
              className="logout-btn"
              onClick={handleLogout}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              退出登录
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;

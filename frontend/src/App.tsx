/**
 * 应用主入口
 *
 * 配置 Ionic 和路由
 */
import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

// 页面组件
import LoginPage from './pages/auth/LoginPage';
import PhoneLoginPage from './pages/auth/PhoneLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import BindPhonePage from './pages/auth/BindPhonePage';
import WechatCallbackPage from './pages/auth/WechatCallbackPage';
import HomePage from './pages/home/HomePage';

// Store
import { useAuthStore } from './stores/authStore';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* 主题变量 */
import './theme/variables.css';

/* 全局样式 */
import './index.css';

// 初始化 Ionic
setupIonicReact({
  mode: 'ios', // 使用 iOS 风格
});

// 路由守卫组件 - 需要登录
const PrivateRoute: React.FC<{
  component: React.FC;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const needBindPhone = useAuthStore((state) => state.needBindPhone);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        // 如果需要绑定手机号，跳转到绑定页面
        if (needBindPhone && rest.path !== '/bind-phone') {
          return <Redirect to="/bind-phone" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

// 路由守卫组件 - 未登录才能访问
const PublicRoute: React.FC<{
  component: React.FC;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const needBindPhone = useAuthStore((state) => state.needBindPhone);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          if (needBindPhone) {
            return <Redirect to="/bind-phone" />;
          }
          return <Redirect to="/home" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

const App: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // 应用启动时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            {/* 公开路由 - 未登录才能访问 */}
            <PublicRoute exact path="/login" component={LoginPage} />
            <PublicRoute exact path="/phone-login" component={PhoneLoginPage} />
            <PublicRoute exact path="/register" component={RegisterPage} />

            {/* 微信回调 - 特殊处理 */}
            <Route exact path="/wechat-callback" component={WechatCallbackPage} />

            {/* 需要登录的路由 */}
            <PrivateRoute exact path="/bind-phone" component={BindPhonePage} />
            <PrivateRoute exact path="/home" component={HomePage} />

            {/* 默认跳转 */}
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>

            {/* 404 跳转到登录 */}
            <Route>
              <Redirect to="/login" />
            </Route>
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

import React, { ReactNode, useState } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";
import { http } from "utils/http";
import { useMount } from "utils";

interface AuthForm {
  username: string;
  password: string;
}

// 初始化 user，防止登录态刷新后状态丢失
const bootstrapUser = async () => {
  let user = null;
  // 获取 localstorage 中的 token
  const token = auth.getToken();
  if (token) {
    // 此处使用 http ，因为需要指定 token
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
// 用于 DevTools 中展示
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // const login = (form: AuthForm) => auth.login(form).then((user) => setUser(user));
  // const register = (form: AuthForm) => auth.register(form).then((user) => setUser(user));
  // point free 消参写法
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  // app 加载时初始化
  useMount(() => {
    bootstrapUser().then(setUser);
  });

  return <AuthContext.Provider children={children} value={{ user, login, register, logout }} />;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};

import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";

// 运行 npm start 时读取 .env.development 下的变量
// 运行 npm run build 时读取 .env 下的变量
// 会根据环境自动识别
const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  data?: Object;
  token?: string;
}

// client("users") 调用时报错，添加第二个参数默认值 Config = {}
export const http = async (endpoint: string, { data, token, headers, ...customConfig }: Config = {}) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    // 默认 method 为 get，后续如果有传 method 可以覆盖前面的
    ...customConfig,
  };
  // 处理参数
  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    // 如果没有 data 则传一个空对象
    config.body = JSON.stringify(data || {});
  }

  return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout();
      window.location.reload();
      return Promise.reject({ message: "请重新登录" });
    }
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      /*当服务端返回错误的时候 fetch 不会在 catch 中抛出异常;
       只有当断网，或网络连接失败的时候会抛出 catch 中的异常;
       因此需要在此处手动抛出异常 */
      return Promise.reject(data);
    }
  });
};

export const useHttp = () => {
  const { user } = useAuth();
  /*
   [endpoint, config]: [string, Config] 类型和上面 http 传入的类型一样
   通过 Parameters 修改 Parameters<typeof http>
   */
  // 通过 ... 解构，方便调用
  return (...[endpoint, config]: Parameters<typeof http>) => http(endpoint, { ...config, token: user?.token });
};

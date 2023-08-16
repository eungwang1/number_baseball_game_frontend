import axios, { AxiosInstance, AxiosError } from "axios";
import { getCookie } from "cookies-next";
import {
  getNewAccessToken,
  getRefreshTokenFromCookie,
  setAuthCookie,
} from "../app/api/user/user";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("API URL MISSING");
}

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;

if (!baseURL) {
  throw new Error("BASE_URL IS MISSING");
}

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (res) => res,
  async (error: any) => {
    const {
      config,
      response: { status },
    } = error;
    if (status === 403) {
      const originalRequest = config;
      const getRefreshTokenRes = await getRefreshTokenFromCookie();
      const refreshToken = getRefreshTokenRes.data.refreshToken;
      if (!refreshToken) return Promise.reject(error);
      await getNewAccessToken({ refreshToken });
      const token = getCookie("accessToken");
      originalRequest.headers.authorization = `Bearer ${token}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

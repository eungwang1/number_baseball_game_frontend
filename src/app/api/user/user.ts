import axiosClient from "@/libs/axiosClient";
import axios from "axios";

interface UpdateUserArgs {
  username: string;
  usage: number; // 0: VRChat, 1: Virtual Cast, 2: Spatial
}

export const updateUser = async (body: UpdateUserArgs) =>
  axiosClient.put("/users", body);

interface PostAuthEmailArgs {
  destination: string;
}

export const postAuthEmail = async (body: PostAuthEmailArgs) =>
  axiosClient.post("/auth/login", body);

interface MagicLoginCallbackArgs {
  token: string;
}

export const magicLoginCallback = async (query: MagicLoginCallbackArgs) =>
  axiosClient.get(`/auth/login/callback?token=${query.token}`);

interface SetAuthCookieArgs {
  accessToken: string;
  refreshToken: string;
}

interface getNewAccessTokenArgs {
  refreshToken: string;
}

export const getNewAccessToken = async (body: getNewAccessTokenArgs) =>
  axiosClient.post("/auth/refresh", body);

export const setAuthCookie = async (body: SetAuthCookieArgs) =>
  axios.post("/api/setAuthCookie", body);

export const getRefreshTokenFromCookie = async () =>
  axios.get("/api/refreshToken");

export const logout = async () => axiosClient.post("/auth/logout");

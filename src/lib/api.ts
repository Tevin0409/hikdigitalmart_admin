import API from "./axios-client";

export const loginMutation = (data: LoginData) => {
  return API.post("/auth/login", data);
};

export const registerMutation = (data: RegisterData) => {
  return API.post("/user/create-user", data);
};

export const refreshAccessTokenMutation = (data: RefreshData) => {
  return API.post("/auth/refresh", data);
};

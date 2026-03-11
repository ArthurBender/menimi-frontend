import { API_BASE_URL } from "./config";
import { apiRequest, apiRequestWithResponse } from "./client";
import type { LoginInput, SignUpInput, UpdateAccountInput, User, UserResponse } from "./types";

export function signUp(input: SignUpInput) {
  return apiRequest<UserResponse>({
    url: `${API_BASE_URL}/auth/signup`,
    method: "POST",
    data: { user: input },
  });
}

export async function login(input: LoginInput) {
  const response = await apiRequestWithResponse<UserResponse>({
    url: `${API_BASE_URL}/auth/login`,
    method: "POST",
    data: { user: input },
  });

  return {
    user: response.data.user,
    authToken: response.headers.authorization ?? null,
  };
}

export function updateAccount(input: UpdateAccountInput) {
  return apiRequest<UserResponse>({
    url: `${API_BASE_URL}/auth/account`,
    method: "PATCH",
    data: { user: input },
  });
}

export function logout() {
  return apiRequest<void>({
    url: `${API_BASE_URL}/auth/logout`,
    method: "DELETE",
  });
}

export function formatUserName(user: User) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
}

import { useState } from "react";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { AuthContext } from "./auth-context";
import { clearStoredAuth, getStoredAuthToken, getStoredUser, storeAuthSession } from "./auth-storage";
import { login as loginRequest, logout as logoutRequest, updateAccount as updateAccountRequest } from "./auth";
import type { LoginInput, UpdateAccountInput, User } from "./types";
import { showToast } from "../utils/toast";

export function AuthProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [authToken, setAuthToken] = useState<string | null>(() => getStoredAuthToken());

  const handleLogin = async (input: LoginInput) => {
    try {
      const response = await loginRequest(input);

      if (!response.authToken) {
        throw new Error(t("error.missingAuthToken"));
      }

      storeAuthSession(response.authToken, response.user);
      setAuthToken(response.authToken);
      setUser(response.user);
      showToast("success", t("toast.loginSuccess"));
    } catch (error) {
      showToast("error", t("toast.loginError"), error);
      throw error;
    }
  };

  const handleUpdateAccount = async (input: UpdateAccountInput) => {
    try {
      const response = await updateAccountRequest(input);
      const currentToken = authToken ?? getStoredAuthToken();

      if (currentToken) {
        storeAuthSession(currentToken, response.user);
      }

      setUser(response.user);
      showToast("success", t("toast.accountUpdated"));
      return response.user;
    } catch (error) {
      showToast("error", t("toast.accountUpdateError"), error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await logoutRequest();
      }
    } catch (error) {
      showToast("error", t("toast.logoutError"), error);
      throw error;
    } finally {
      clearStoredAuth();
      setAuthToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    authToken,
    isAuthenticated: Boolean(user && authToken),
    isLoading: false,
    login: handleLogin,
    updateAccount: handleUpdateAccount,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

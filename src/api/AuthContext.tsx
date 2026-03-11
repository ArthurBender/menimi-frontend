import { useState } from "react";
import type { PropsWithChildren } from "react";

import { AuthContext } from "./auth-context";
import { clearStoredAuth, getStoredAuthToken, getStoredUser, storeAuthSession } from "./auth-storage";
import { login as loginRequest, logout as logoutRequest, updateAccount as updateAccountRequest } from "./auth";
import type { LoginInput, UpdateAccountInput, User } from "./types";
import { showToast } from "../utils/toast";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [authToken, setAuthToken] = useState<string | null>(() => getStoredAuthToken());

  const handleLogin = async (input: LoginInput) => {
    try {
      const response = await loginRequest(input);

      if (!response.authToken) {
        throw new Error("Login succeeded but no authorization token was returned.");
      }

      storeAuthSession(response.authToken, response.user);
      setAuthToken(response.authToken);
      setUser(response.user);
      showToast("success", "Logged in successfully.");
    } catch (error) {
      showToast("error", "There was an error logging in.", error);
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
      showToast("success", "Account updated successfully.");
      return response.user;
    } catch (error) {
      showToast("error", "There was an error updating your account.", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await logoutRequest();
      }
    } catch (error) {
      showToast("error", "There was an error logging out.", error);
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

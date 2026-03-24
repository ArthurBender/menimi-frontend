import { createContext } from "react";

import type { LoginInput, UpdateAccountInput, User, UserLanguage } from "./types";

export interface AuthContextValue {
  user: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  updateAccount: (input: UpdateAccountInput) => Promise<User>;
  updateAccountLanguage: (language: UserLanguage) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

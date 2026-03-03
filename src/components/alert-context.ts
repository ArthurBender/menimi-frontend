import { createContext } from "react";

export interface AlertValue {
  showError: (error: unknown, fallbackMessage?: string) => void;
}

export const AlertContext = createContext<AlertValue | null>(null);

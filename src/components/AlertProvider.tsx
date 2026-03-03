import { useEffect, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { AlertContext } from "./alert-context";

interface AlertState {
  id: number;
  message: string;
}

export function AlertProvider({ children }: PropsWithChildren) {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showError = (error: unknown, fallbackMessage = "There was an error.") => {
    const details = getErrorDetails(error);
    const alertId = Date.now();

    console.error("API error details:", error);

    setAlert({
      id: alertId,
      message: fallbackMessage,
    });

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setAlert((current) => (current?.id === alertId ? null : current));
    }, 4000);

    if (details.length > 0) {
      console.error("API validation errors:", details);
    }
  };

  const dismissAlert = () => {
    setAlert(null);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <AlertContext.Provider value={{ showError }}>
      {children}
      {alert && (
        <div className="pointer-events-none fixed top-6 right-6 z-[100]">
          <div className="app-alert pointer-events-auto flex items-start gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-light/80">Error</p>
              <p className="text-base font-semibold text-light">{alert.message}</p>
            </div>
            <button
              type="button"
              className="cursor-pointer text-sm font-semibold text-light/80 transition hover:text-light"
              onClick={dismissAlert}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error && "details" in error && Array.isArray(error.details)) {
    return error.details.filter((detail): detail is string => typeof detail === "string");
  }

  if (error instanceof Error) {
    return [error.message];
  }

  return [];
}

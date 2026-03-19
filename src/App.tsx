import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./api/useAuth";

const LoggedLayout = lazy(() => import("./components/LoggedLayout"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const EditTask = lazy(() => import("./pages/EditTask"));
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NewTask = lazy(() => import("./pages/NewTask"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));

const App = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-lg">
          {t("common.loading")}
        </div>
      }
    >
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route element={<LoggedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NewTask />} />
              <Route path="/tasks/:taskId/edit" element={<EditTask />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

export default App;

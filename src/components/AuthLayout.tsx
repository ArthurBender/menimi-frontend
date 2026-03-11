import type { PropsWithChildren } from "react";

import backgroundImage from "../assets/background.png";
import { usePreferences } from "../preferences/usePreferences";
import PreferenceToggle from "./PreferenceToggle";

interface AuthLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
}

const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
  const { language, setLanguage } = usePreferences();

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className="hidden flex-1 bg-cover bg-center bg-no-repeat lg:block"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <aside className="flex min-h-screen w-full flex-col bg-white px-4 py-8 lg:w-[30rem] lg:px-8">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex items-start justify-between gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-sm text-primary/70">{description}</p>
            </div>

            <PreferenceToggle
              value={language}
              onChange={setLanguage}
              options={[
                { value: "en", label: "EN" },
                { value: "pt-BR", label: "PT" },
              ]}
            />
          </div>

          <div className="flex flex-1 flex-col pt-8">
            {children}
          </div>

          <div className="pt-6 text-center text-sm font-semibold text-nowrap">© {new Date().getFullYear()}. All rights reserved.</div>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;

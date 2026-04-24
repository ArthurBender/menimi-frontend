import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import backgroundImage from "../assets/background.webp";
import splashTexture from "../assets/splash-texture.png";
import { usePreferences } from "../preferences/usePreferences";
import PreferenceToggle from "./PreferenceToggle";

interface AuthLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
}

const AuthLayout = ({ title, description, children }: AuthLayoutProps) => {
  const { language, setLanguage } = usePreferences();
  const { t } = useTranslation();

  return (
    <div
      className="flex min-h-screen p-4 lg:p-0"
      style={{
        backgroundImage: `url(${splashTexture}), url(${backgroundImage})`,
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundSize: "cover, cover",
      }}
    >
      <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
        <div className="flex flex-col items-center gap-20 text-center">
          <p className="text-9xl font-bold text-light bg-accent px-4 py-2 rounded-2xl">{t("app.brand")}</p>
          <p className="text-5xl font-semibold text-accent bg-light px-4 py-2 rounded-2xl">
            {t("auth.hero.tagline")}
          </p>
          <p className="text-3xl text-light bg-accent px-4 py-2 rounded-2xl">
            {t("auth.hero.quote")}
          </p>
        </div>
      </div>
      <aside className="flex min-h-[calc(100vh-2rem)] flex-col bg-background rounded-2xl p-8 lg:min-h-screen w-120 mx-auto lg:mx-0 lg:rounded-none">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold">{title}</h1>

              <PreferenceToggle
                value={language}
                onChange={setLanguage}
                options={[
                  { value: "en", label: t("common.english") },
                  { value: "pt-BR", label: t("common.portugueseBrazil") },
                ]}
              />
            </div>

            <p className="text-sm text-primary/70">{description}</p>
          </div>

          <div className="flex flex-1 flex-col pt-8">
            {children}
          </div>

          <div className="pt-6 text-center text-sm font-semibold text-nowrap">
            © {new Date().getFullYear()}. {t("common.allRightsReserved")}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;

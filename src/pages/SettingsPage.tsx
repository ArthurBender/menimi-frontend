import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import PreferenceToggle from "../components/PreferenceToggle";
import SelectField from "../components/custom-fields/SelectField";
import TextField from "../components/custom-fields/TextField";
import { useAuth } from "../api/useAuth";
import {
  canUsePushNotifications,
  disablePushNotifications,
  enablePushNotifications,
  getPushSupportStatus,
  type PushSupportStatus,
} from "../lib/pushNotifications";
import { usePreferences } from "../preferences/usePreferences";
import { showToast } from "../utils/toast";
import { timezoneOptions } from "../utils/timezones";

const SettingsPage = () => {
  const { user, updateAccount } = useAuth();
  const { theme, setTheme, language, setLanguage } = usePreferences();
  const { t } = useTranslation();
  const [email, setEmail] = useState(user?.email ?? "");
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [timezone, setTimezone] = useState(user?.timezone ?? "Etc/UTC");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushSupportStatus>("disabled");
  const [isUpdatingPush, setIsUpdatingPush] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPushStatus = async () => {
      const status = await getPushSupportStatus();

      if (isMounted) {
        setPushStatus(status);
      }
    };

    void loadPushStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateAccount({
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        timezone,
        ...(password ? { password, password_confirmation: passwordConfirmation } : {}),
      });

      setPassword("");
      setPasswordConfirmation("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnablePush = async () => {
    setIsUpdatingPush(true);

    try {
      await enablePushNotifications();
      setPushStatus("enabled");
      showToast("success", t("toast.pushEnabled"));
    } catch (error) {
      setPushStatus(await getPushSupportStatus());
      showToast("error", t("toast.pushEnableError"), error);
    } finally {
      setIsUpdatingPush(false);
    }
  };

  const handleDisablePush = async () => {
    setIsUpdatingPush(true);

    try {
      await disablePushNotifications();
      setPushStatus("disabled");
      showToast("success", t("toast.pushDisabled"));
    } catch (error) {
      setPushStatus(await getPushSupportStatus());
      showToast("error", t("toast.pushDisableError"), error);
    } finally {
      setIsUpdatingPush(false);
    }
  };

  const pushStatusLabel = getPushStatusLabel(t, pushStatus);
  const pushDescription = getPushDescription(t, pushStatus);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex justify-center">
        <h2 className="text-4xl font-bold">{t("common.settings")}</h2>
      </div>

      <form className="flex w-full flex-col gap-8 rounded-2xl bg-surface p-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="settings-first-name"
            label={t("common.firstName")}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            requiredLabel
            disabled={isSaving}
          />

          <TextField
            id="settings-last-name"
            label={t("common.lastName")}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            requiredLabel
            disabled={isSaving}
          />
        </div>

        <TextField
          id="settings-email"
          label={t("common.email")}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          requiredLabel
          disabled={isSaving}
        />

        <SelectField
          id="settings-timezone"
          label={t("common.timezone")}
          requiredLabel
          value={timezone}
          options={timezoneOptions}
          onChange={(value) => {
            if (value) setTimezone(value);
          }}
          isSearchable
          isDisabled={isSaving}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="settings-password"
            label={t("settings.newPassword")}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSaving}
            autoComplete="new-password"
          />

          <TextField
            id="settings-password-confirmation"
            label={t("common.passwordConfirmation")}
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            disabled={isSaving}
            autoComplete="new-password"
          />
        </div>

        <div className="mt-2 flex justify-center gap-3">
          <button type="submit" className="calendar-navigation" disabled={isSaving}>
            {isSaving ? t("common.saving") : t("common.saveChanges")}
          </button>
        </div>
      </form>

      <div className="flex w-full flex-col gap-6 rounded-2xl bg-surface p-6">
        <h3 className="text-2xl font-semibold">{t("settings.preferences")}</h3>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{t("common.theme")}</p>
            <p className="text-sm text-primary/70">{t("settings.account.themeDescription")}</p>
          </div>

          <div className="w-fit self-start sm:self-auto">
            <PreferenceToggle
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: t("settings.light") },
                { value: "dark", label: t("settings.dark") },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{t("common.language")}</p>
            <p className="text-sm text-primary/70">{t("settings.account.languageDescription")}</p>
          </div>

          <div className="w-fit self-start sm:self-auto">
            <PreferenceToggle
              value={language}
              onChange={setLanguage}
              options={[
                { value: "en", label: t("common.english") },
                { value: "pt-BR", label: t("common.portugueseBrazil") },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{t("settings.notifications.title")}</p>
            <p className="text-sm text-primary/70">{pushDescription}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-primary/50">
              {t("settings.notifications.status")}: {pushStatusLabel}
            </p>
          </div>

          <div className="w-fit self-start sm:self-auto">
            {pushStatus === "enabled" ? (
              <button
                type="button"
                className="calendar-navigation"
                onClick={handleDisablePush}
                disabled={isUpdatingPush}
              >
                {isUpdatingPush ? t("settings.notifications.disabling") : t("settings.notifications.disable")}
              </button>
            ) : (
              <button
                type="button"
                className="calendar-navigation"
                onClick={handleEnablePush}
                disabled={isUpdatingPush || !canUsePushNotifications()}
              >
                {isUpdatingPush ? t("settings.notifications.enabling") : t("settings.notifications.enable")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function getPushStatusLabel(
  t: ReturnType<typeof useTranslation>["t"],
  status: PushSupportStatus,
) {
  switch (status) {
    case "enabled":
      return t("settings.notifications.enabled");
    case "blocked":
      return t("settings.notifications.blocked");
    case "unsupported":
      return t("settings.notifications.unsupported");
    default:
      return t("settings.notifications.disabled");
  }
}

function getPushDescription(
  t: ReturnType<typeof useTranslation>["t"],
  status: PushSupportStatus,
) {
  switch (status) {
    case "enabled":
      return t("settings.notifications.enabledDescription");
    case "blocked":
      return t("settings.notifications.blockedDescription");
    case "unsupported":
      return t("settings.notifications.unsupportedDescription");
    default:
      return t("settings.notifications.description");
  }
}

export default SettingsPage;

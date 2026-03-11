import { useState } from "react";
import type { FormEvent } from "react";

import PreferenceToggle from "../components/PreferenceToggle";
import SelectField from "../components/custom-fields/SelectField";
import TextField from "../components/custom-fields/TextField";
import { useAuth } from "../api/useAuth";
import { usePreferences } from "../preferences/usePreferences";
import { timezoneOptions } from "../utils/timezones";

const SettingsPage = () => {
  const { user, updateAccount } = useAuth();
  const { theme, setTheme, language, setLanguage } = usePreferences();
  const [email, setEmail] = useState(user?.email ?? "");
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [timezone, setTimezone] = useState(user?.timezone ?? "Etc/UTC");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="flex justify-center">
        <h2 className="text-4xl font-bold">Settings</h2>
      </div>

      <form className="flex flex-col gap-8 rounded-2xl bg-surface p-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="settings-first-name"
            label="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            requiredLabel
            disabled={isSaving}
          />

          <TextField
            id="settings-last-name"
            label="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            requiredLabel
            disabled={isSaving}
          />
        </div>

        <TextField
          id="settings-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          requiredLabel
          disabled={isSaving}
        />

        <SelectField
          id="settings-timezone"
          label="Timezone"
          requiredLabel
          value={timezone}
          options={timezoneOptions}
          onChange={(value) => {
            if (value) setTimezone(value);
          }}
          isSearchable
          isDisabled={isSaving}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            id="settings-password"
            label="New Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSaving}
            autoComplete="new-password"
          />

          <TextField
            id="settings-password-confirmation"
            label="Password Confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            disabled={isSaving}
            autoComplete="new-password"
          />
        </div>

        <div className="mt-2 flex justify-center gap-3">
          <button type="submit" className="calendar-navigation" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-6 rounded-2xl bg-surface p-6">
        <h3 className="text-2xl font-semibold">Preferences</h3>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Theme</p>
            <p className="text-sm text-primary/70">Stored locally between sessions.</p>
          </div>

          <PreferenceToggle
            value={theme}
            onChange={setTheme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Language</p>
            <p className="text-sm text-primary/70">Stored now for future i18n wiring.</p>
          </div>

          <PreferenceToggle
            value={language}
            onChange={setLanguage}
            options={[
              { value: "en", label: "English" },
              { value: "pt-BR", label: "PT-BR" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

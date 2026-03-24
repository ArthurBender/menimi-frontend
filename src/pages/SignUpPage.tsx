import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { signUp } from "../api/auth";
import AuthLayout from "../components/AuthLayout";
import SelectField from "../components/custom-fields/SelectField";
import TextField from "../components/custom-fields/TextField";
import { usePreferences } from "../preferences/usePreferences";
import { timezoneOptions } from "../utils/timezones";
import { showToast } from "../utils/toast";

function getInitialTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Etc/UTC";
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = usePreferences();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [timezone, setTimezone] = useState(getInitialTimezone());
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signUp({
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        timezone,
        language,
        password,
        password_confirmation: passwordConfirmation,
      });

      showToast("success", t("toast.accountCreated"));
      navigate("/login");
    } catch (error) {
      showToast("error", t("toast.accountCreateError"), error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.signup.title")}
      description={t("auth.signup.description")}
    >
      <form className="flex h-full flex-1 flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="signup-first-name"
            label={t("common.firstName")}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            requiredLabel
            disabled={isSubmitting}
            autoComplete="given-name"
          />

          <TextField
            id="signup-last-name"
            label={t("common.lastName")}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            requiredLabel
            disabled={isSubmitting}
            autoComplete="family-name"
          />
        </div>

        <TextField
          id="signup-email"
          label={t("common.email")}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          requiredLabel
          disabled={isSubmitting}
          autoComplete="email"
        />

        <SelectField
          id="signup-timezone"
          label={t("common.timezone")}
          requiredLabel
          value={timezone}
          options={timezoneOptions}
          onChange={(value) => {
            if (value) setTimezone(value);
          }}
          isSearchable
          isDisabled={isSubmitting}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="signup-password"
            label={t("common.password")}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            requiredLabel
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <TextField
            id="signup-password-confirmation"
            label={t("common.passwordConfirmation")}
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required
            requiredLabel
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <button type="submit" className="calendar-navigation" disabled={isSubmitting}>
            {isSubmitting ? t("auth.signup.submitting") : t("auth.signup.submit")}
          </button>
          <Link to="/login" className="calendar-navigation text-center">
            {t("auth.signup.backToLogin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;

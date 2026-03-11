import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import TextField from "../components/custom-fields/TextField";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../api/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Login"
      description="Use your account to access Menimi."
    >
      <form className="flex h-full flex-1 flex-col gap-6" onSubmit={handleSubmit}>
        <TextField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          requiredLabel
          autoComplete="email"
          disabled={isSubmitting}
        />

        <TextField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          requiredLabel
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <button type="submit" className="calendar-navigation" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <Link to="/signup" className="calendar-navigation text-center">
            Create Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

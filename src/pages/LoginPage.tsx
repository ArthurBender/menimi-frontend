import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import TextField from "../components/custom-fields/TextField";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-surface p-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm text-primary/70">Use your account to access Menimi.</p>
        </div>

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

        <div className="flex flex-col gap-3">
          <button type="submit" className="calendar-navigation" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <Link to="/signup" className="calendar-navigation text-center">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

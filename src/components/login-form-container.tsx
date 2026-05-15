"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { LoginFormView, type LoginFormValues } from "./login-form-view";

type LoginFormContainerProps = {
  className?: string;
};

export function LoginFormContainer({ className }: LoginFormContainerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleEmailSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message ?? "Unable to sign in.");
      }
    } catch {
      setError("Unexpected error while signing in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGithubSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message ?? "Unable to sign in with GitHub.");
      }
    } catch {
      setError("Unexpected error while signing in with GitHub.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LoginFormView
      className={className}
      error={error}
      isSubmitting={isSubmitting}
      onEmailSubmit={handleEmailSubmit}
      onGithubSubmit={handleGithubSubmit}
    />
  );
}

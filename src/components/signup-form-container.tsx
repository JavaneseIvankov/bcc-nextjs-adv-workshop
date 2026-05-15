"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { SignupFormView, type SignupFormValues } from "./signup-form-view";

type SignupFormContainerProps = {
  className?: string;
};

export function SignupFormContainer({ className }: SignupFormContainerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleEmailSubmit(values: SignupFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message ?? "Unable to create account.");
      }
    } catch {
      setError("Unexpected error while creating account.");
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
        setError(result.error.message ?? "Unable to sign up with GitHub.");
      }
    } catch {
      setError("Unexpected error while signing up with GitHub.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SignupFormView
      className={className}
      error={error}
      isSubmitting={isSubmitting}
      onEmailSubmit={handleEmailSubmit}
      onGithubSubmit={handleGithubSubmit}
    />
  );
}

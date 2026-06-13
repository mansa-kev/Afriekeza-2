"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type PortalLoginFormProps = {
  redirectTo: string;
  signupHref?: string;
  signupLabel?: string;
};

export function PortalLoginForm({
  redirectTo,
  signupHref,
  signupLabel = "Create account",
}: PortalLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-header-border bg-white p-6"
    >
      <div>
        <label htmlFor="email" className="text-sm font-medium text-dark">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-xl border border-header-border px-4 py-2.5"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-dark">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-xl border border-header-border px-4 py-2.5"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button variant="primary" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      {signupHref ? (
        <p className="text-center text-sm text-muted">
          {signupLabel}{" "}
          <a href={signupHref} className="text-blue hover:underline">
            Get started
          </a>
        </p>
      ) : null}
    </form>
  );
}

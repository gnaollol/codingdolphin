"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [creatingAccount, setCreatingAccount] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (creatingAccount && !/^[A-Za-z0-9]{1,20}$/.test(username)) {
      setError("Username must be 1–20 letters or numbers, with no spaces or symbols.");
      return;
    }

    setBusy(true);

    try {
      const result = creatingAccount
        ? await authClient.signUp.email({ name, username, email, password })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        const message = result.error.message ?? "Please try again.";
        const usernameTaken =
          result.error.code?.includes("USERNAME_IS_ALREADY_TAKEN") ||
          /username.*(taken|already|exist)/i.test(message);

        setError(
          usernameTaken
            ? "That username is taken. Please choose another."
            : message,
        );
        return;
      }

      window.location.assign("/");
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    setError("");
    setBusy(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message ?? "Google sign-in failed.");
      }
    } catch {
      setError("Could not connect to Google. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7f7] px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border border-[#dce6e6] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#17282d]">
          {creatingAccount ? "Create an account" : "Log in"}
        </h1>

        <p className="mt-2 text-sm text-[#64767a]">
          Save your study history and revisit topics later.
        </p>

        <form onSubmit={submit} className="mt-7 flex flex-col gap-4">
          {creatingAccount && (
            <>
              <label className="flex flex-col gap-1 text-sm">
                Name
                <input
                  className="rounded-lg border p-3"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Username
                <input
                  className="rounded-lg border p-3"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  minLength={1}
                  maxLength={20}
                  pattern="[A-Za-z0-9]{1,20}"
                  title="Use 1–20 letters or numbers, with no spaces or symbols."
                  required
                />
                <span className="text-xs text-[#64767a]">
                  Up to 20 letters or numbers. No spaces or symbols.
                </span>
              </label>
            </>
          )}

          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              className="rounded-lg border p-3"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              className="rounded-lg border p-3"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                creatingAccount ? "new-password" : "current-password"
              }
              minLength={8}
              required
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            className="rounded-lg bg-[#195d59] p-3 font-semibold text-white disabled:opacity-50"
            type="submit"
            disabled={busy}
          >
            {busy
              ? "Please wait..."
              : creatingAccount
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <button
          type="button"
          className="mt-4 w-full rounded-lg border p-3 font-semibold disabled:opacity-50"
          onClick={continueWithGoogle}
          disabled={busy}
        >
          Continue with Google
        </button>

        <button
          type="button"
          className="mt-5 text-sm text-[#195d59] underline"
          onClick={() => {
            setError("");
            setCreatingAccount(!creatingAccount);
          }}
        >
          {creatingAccount
            ? "Already have an account? Log in"
            : "New here? Create an account"}
        </button>
      </section>
    </main>
  );
}
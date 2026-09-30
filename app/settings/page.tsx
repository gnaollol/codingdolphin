"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "../account-pages.module.css";

export default function SettingsPage() {
  const { data: session, isPending} = authClient.useSession();
  const [name, setName] = useState("");
  const [googleLinked, setGoogleLinked] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    setName(session.user.name ?? "");

    authClient.listAccounts().then(({ data, error }) => {
      if (error) {
        setMessage(error.message ?? "Could not load connected accounts.");
        return;
      }

      setGoogleLinked(data?.some((account) => account.providerId === "google") ?? false);
    });
  }, [session?.user?.id]);

  if (isPending) {
    return <main className={`account-page ${styles.page}`}>Loading settings...</main>;
  }

  if (!session?.user) {
    return (
      <main className={`account-page ${styles.page}`}>
        <h1>Settings</h1>
        <p>Log in to manage your account.</p>
        <a href="/login">Log in</a>
      </main>
    );
  }

  async function saveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Enter a display name.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await authClient.updateUser({ name: name.trim() });

    setMessage(error?.message ?? "Display name updated.");
    setSaving(false);
  }

  async function connectGoogle() {
    const { error } = await authClient.linkSocial({
      provider: "google",
      callbackURL: "/settings",
    });

    if (error) setMessage(error.message ?? "Could not connect Google.");
  }

  return (
    <main className={`account-page ${styles.page}`}>
      <a href="/">← Back to study desk</a>
      <h1>Settings</h1>

      <section className={`account-card ${styles.card}`}>
        <div>
          <h2>Display name</h2>
          <p>This name appears on your profile.</p>

          <form onSubmit={saveName} className={`account-form ${styles.form}`}>
            <input
              aria-label="Display name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
            />
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save name"}
            </button>
          </form>
        </div>
      </section>

      <section className={`account-card ${styles.card}`}>
        <div>
          <h2>Google account</h2>
          {googleLinked === null ? (
            <p>Checking connection...</p>
          ) : googleLinked ? (
            <p>Google is connected.</p>
          ) : (
            <button type="button" onClick={connectGoogle}>
              Connect Google
            </button>
          )}
        </div>
      </section>

      {message && <p role="status">{message}</p>}
    </main>
  );
}

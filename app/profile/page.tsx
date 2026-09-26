"use client";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <main className="account-page">Loading profile...</main>;
  }

  if (!session?.user) {
    return (
      <main className="account-page">
        <h1>Profile</h1>
        <p>Log in to view your profile.</p>
        <a href="/login">Log in</a>
      </main>
    );
  }

  return (
    <main className="account-page">
      <a href="/">← Back to study desk</a>

      <h1>Your profile</h1>

      <div className="account-card">
        <div className="account-avatar">
          {session.user.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <h2>{session.user.name}</h2>
          <p>{session.user.email}</p>
        </div>
      </div>

      <nav className="account-links">
        <a href="/history">Question history →</a>
        <a href="/saved">Saved topics →</a>
      </nav>
    </main>
  );
}
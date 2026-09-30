"use client";

import { ArrowRight, BookOpen, Code2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LandingPage() {
  const { data: session, isPending } = authClient.useSession();
  const firstName = isPending
    ? null
    : session?.user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <main className="landing-page">
      <header className="landing-header">
        <a href="/" className="landing-brand">
          <span className="" />
          <span>
            CodingDolphin | Home <strong />
          </span>
        </a>

        {session?.user ? (
          <details className="profile-menu">
            <summary className="profile-trigger" aria-label="Open profile menu">
              <span className="avatar">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </summary>

            <div className="profile-menu-items">
              <a href="/profile">Profile</a>
              <a href="/settings">Settings</a>
              <button
                type="button"
                onClick={async () => {
                  await authClient.signOut();
                  window.location.href = "/";
                }}
              >
                Log out
              </button>
            </div>
          </details>
        ) : (
          <a href="/login" className="landing-login">
            Log in
          </a>
        )}
      </header>

      <section className="landing-content">
        <p className="landing-eyebrow">YOUR STUDY SPACE</p>
        <h1 aria-live="polite">
          {isPending ? "\u00A0" : `Hello ${firstName}, let's review.`}
        </h1>
        <p className="landing-description">
          Pick up where you left off or explore a new technical interview topic.
        </p>

        <div className="mt-8 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <a
            href="/study"
            className="landing-card"
            style={{ width: "100%", maxWidth: "none", minWidth: 0, marginTop: 0 }}
          >
            <span className="landing-card-icon">
              <BookOpen size={25} />
            </span>
            <span className="landing-card-content">
              <strong>Study Topics</strong>
              <span>
                Ask a question, explore a clear explanation, and test yourself
                with a short quiz.
              </span>
              <span className="landing-cta">
                Start studying <ArrowRight size={18} />
              </span>
            </span>
          </a>

          <a
            href="/problems"
            className="landing-card"
            style={{ width: "100%", maxWidth: "none", minWidth: 0, marginTop: 0 }}
          >
            <span className="landing-card-icon">
              <Code2 size={25} />
            </span>
            <span className="landing-card-content">
              <strong>Coding Interview Problems</strong>
              <span>Test your problem solving and coding skills here.</span>
              <span className="landing-cta">
                Start practicing <ArrowRight size={18} />
              </span>
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}

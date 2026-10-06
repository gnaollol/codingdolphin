"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { calendarWeeks, type ProfileStats } from "../../lib/profile-stats";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [year, setYear] = useState(new Date().getUTCFullYear());
  const [loading, setLoading] = useState(true);
  const userId = session?.user?.id;

  useEffect(() => {
    setStats(null);
    setError("");
    if (!userId) return;
    const controller = new AbortController();
    setLoading(true);
    async function load() {
      try {
        const response = await fetch("/api/profile", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = (await response.json()) as ProfileStats & {
          error?: string;
        };
        if (!response.ok)
          throw new Error(data.error ?? "Could not load activity.");
        if (!controller.signal.aborted) setStats(data);
      } catch (cause) {
        if (!controller.signal.aborted)
          setError(
            cause instanceof Error ? cause.message : "Could not load activity.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [userId, retry]);

  if (isPending)
    return (
      <main className={styles.page}>
        <p role="status">Loading profile…</p>
      </main>
    );
  if (!session?.user)
    return (
      <main className={styles.page}>
        <h1>Your profile</h1>
        <p>Log in to see your coding activity.</p>
        <a className={styles.button} href="/login">
          Log in
        </a>
      </main>
    );

  const user = session.user as typeof session.user & {
    username?: string;
    displayUsername?: string;
  };
  const username = user.displayUsername || user.username;
  const weeks = calendarWeeks(year);
  const daily = stats?.daily ?? {};
  const entries = Object.entries(daily).filter(([day]) =>
    day.startsWith(`${year}-`),
  );
  const yearCount = entries.reduce((sum, [, count]) => sum + count, 0);
  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";
  const levels = (count: number) =>
    count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a href="/">← Study desk</a>
        <a href="/problems">Coding problems →</a>
      </header>
      <div className={styles.heading}>
        <p className={styles.eyebrow}></p>
        <h1>Profile</h1>
        <p>A little consistency goes a long way.</p>
      </div>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <section className={styles.card} aria-label="Account details">
            <div className={styles.identity}>
              <div className={styles.avatar}>
                {user.image ? (
                  <img src={user.image} alt="" referrerPolicy="no-referrer" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <h2>{user.name}</h2>
                {username && <p>@{username}</p>}
              </div>
            </div>
            <div className={styles.email}>
              <span>{user.email}</span>
              <small>PRIVATE</small>
            </div>
            <a href="/settings" className={styles.button}>
              Edit profile
            </a>
          </section>
          <div className={styles.streaks}>
            <section className={styles.card}>
              <p>Current streak</p>
              <strong>
                {stats ? stats.currentStreak : "—"}
                <small> days</small>
              </strong>
            </section>
            <section className={styles.card}>
              <p>Longest streak</p>
              <strong>
                {stats ? stats.longestStreak : "—"}
                <small> days</small>
              </strong>
            </section>
          </div>
          <section className={styles.card}>
            <h2>Blind 75</h2>
            <div className={styles.solved}>
              <strong>{stats ? stats.solved : "—"}</strong>
              <span>/ {stats ? stats.total : "—"} solved</span>
            </div>
            <p className={styles.caption}>
              Each problem counts once, across all languages.
            </p>
            {stats?.difficulties.map((item) => (
              <div key={item.difficulty} className={styles.difficulty}>
                <div>
                  <span data-difficulty={item.difficulty}>
                    {item.difficulty}
                  </span>
                  <span>
                    {item.solved} / {item.total}
                  </span>
                </div>
                <progress
                  aria-label={`${item.difficulty} problems solved`}
                  value={item.solved}
                  max={item.total || 1}
                />
              </div>
            ))}
            <a className={styles.textLink} href="/problems">
              Keep practicing →
            </a>
          </section>
        </aside>
        <div className={styles.content}>
          <section className={styles.card} aria-labelledby="activity-title">
            <div className={styles.activityHeader}>
              <div>
                <p className={styles.eyebrow}>CODING ACTIVITY</p>
                <h2 id="activity-title">
                  {stats ? yearCount : "—"} accepted submissions in {year}
                </h2>
              </div>
              <label className={styles.year}>
                Year
                <select
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                >
                  {(stats?.years ?? [year]).map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
            {loading ? (
              <p role="status" className={styles.notice}>
                Loading your activity…
              </p>
            ) : error ? (
              <div role="alert" className={styles.notice}>
                <p>{error}</p>
                <button
                  className={styles.button}
                  onClick={() => setRetry((value) => value + 1)}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className={styles.activitySummary}>
                  <span>
                    Active days <b>{entries.length}</b>
                  </span>
                  <span>
                    All-time accepted <b>{stats?.acceptedSubmissions}</b>
                  </span>
                </div>
                <div
                  className={styles.scroll}
                  tabIndex={0}
                  aria-label={`${year} activity calendar; scroll horizontally to see all months`}
                >
                  <div className={styles.calendar}>
                    <div className={styles.dayLabels}>
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>
                    <div className={styles.weeks}>
                      {weeks.map((week, index) => {
                        const monthStart = week.find((day) =>
                          day?.endsWith("-01"),
                        );
                        const label = monthStart
                          ? new Date(`${monthStart}T00:00:00Z`).toLocaleString(
                            "en-US",
                            { month: "short", timeZone: "UTC" },
                          )
                          : "";
                        return (
                          <div className={styles.week} key={index}>
                            <span className={styles.month}>{label}</span>
                            {week.map((day, offset) => {
                              const future =
                                !!day && !!stats && day > stats.today;
                              const count = day ? (daily[day] ?? 0) : 0;
                              const title = day
                                ? `${day}: ${future ? "future date" : `${count} accepted submission${count === 1 ? "" : "s"}`}`
                                : "";
                              return (
                                <div
                                  key={day ?? offset}
                                  className={styles.cell}
                                  data-level={levels(count)}
                                  data-empty={!day || undefined}
                                  data-future={future || undefined}
                                  title={title}
                                  aria-label={title || undefined}
                                />
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className={styles.calendarFooter}>
                  <p>
                    Daily activity resets at midnight UTC. Includes saved
                    accepted submissions.
                  </p>
                  <div className={styles.legend}>
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={styles.cell}
                        data-level={level}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </div>
                {yearCount === 0 && (
                  <p className={styles.empty}>
                    No accepted submissions in {year} yet. Your first accepted
                    solution will show up here.
                  </p>
                )}
              </>
            )}
          </section>
          <section className={styles.card}>
            <p className={styles.eyebrow}>BACK TO LEARNING</p>
            <h2>Your study desk</h2>
            <nav className={styles.links} aria-label="Study shortcuts">
              <a href="/history">
                <strong>Question history</strong>
                <span>Revisit the topics you’ve explored →</span>
              </a>
              <a href="/saved">
                <strong>Saved topics</strong>
                <span>Pick up something worth remembering →</span>
              </a>
              {/* <a href="/flashcards">
                <strong>Flashcards</strong>
                <span>Keep the important details fresh →</span>
              </a> */}
            </nav>
          </section>
        </div>
      </div>
    </main>
  );
}

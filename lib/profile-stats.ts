export type ActivityRow = { day: string; problemSlug: string; count: number };
export type ProfileProblem = {
  slug: string;
  difficulty: string;
  collection?: string;
};

const DAY = 86_400_000;
export function getProfileStats(
  rows: ActivityRow[],
  problems: ProfileProblem[],
  now = Date.now(),
) {
  const today = new Date(now).toISOString().slice(0, 10);
  const daily = new Map<string, number>();
  const solved = new Set<string>();
  for (const row of rows) {
    if (row.day > today || row.count <= 0) continue;
    daily.set(row.day, (daily.get(row.day) ?? 0) + row.count);
    solved.add(row.problemSlug);
  }
  const days = [...daily.keys()].sort();
  const dayNumber = (day: string) => Date.parse(`${day}T00:00:00Z`) / DAY;
  let longestStreak = 0;
  let streak = 0;
  let previous = -Infinity;
  for (const day of days) {
    const current = dayNumber(day);
    streak = current === previous + 1 ? streak + 1 : 1;
    longestStreak = Math.max(longestStreak, streak);
    previous = current;
  }
  let currentStreak = 0;
  let cursor = dayNumber(today);
  if (!daily.has(today)) cursor -= 1;
  while (daily.has(new Date(cursor * DAY).toISOString().slice(0, 10))) {
    currentStreak += 1;
    cursor -= 1;
  }
  const blind75 = problems.filter((p) => p.collection === "Blind 75");
  const difficulties = ["Easy", "Medium", "Hard"].map((difficulty) => {
    const matches = blind75.filter((p) => p.difficulty === difficulty);
    return {
      difficulty,
      solved: matches.filter((p) => solved.has(p.slug)).length,
      total: matches.length,
    };
  });
  return {
    daily: Object.fromEntries(daily),
    today,
    currentStreak,
    longestStreak,
    activeDays: days.length,
    acceptedSubmissions: [...daily.values()].reduce(
      (sum, count) => sum + count,
      0,
    ),
    solved: difficulties.reduce((sum, d) => sum + d.solved, 0),
    total: blind75.length,
    difficulties,
    years: [
      ...new Set([
        Number(today.slice(0, 4)),
        ...days.map((day) => Number(day.slice(0, 4))),
      ]),
    ].sort((a, b) => b - a),
  };
}
export type ProfileStats = ReturnType<typeof getProfileStats>;

export function calendarWeeks(year: number) {
  const first = new Date(Date.UTC(year, 0, 1));
  const start = first.getTime() - first.getUTCDay() * DAY;
  const last = Date.UTC(year, 11, 31);
  const weeks: (string | null)[][] = [];
  for (let time = start; time <= last; time += 7 * DAY) {
    weeks.push(
      Array.from({ length: 7 }, (_, offset) => {
        const date = new Date(time + offset * DAY);
        return date.getUTCFullYear() === year
          ? date.toISOString().slice(0, 10)
          : null;
      }),
    );
  }
  return weeks;
}

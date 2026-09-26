"use client";

import { useEffect, useState } from "react";

import {
  ArrowRight,
  Brain,
  Check,
  Clock3,
  Code2,
  LoaderCircle,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ModuleRecord } from "@/lib/module";

import { authClient } from "@/lib/auth-client";

type Suggestion = {
  id: string;

  title: string;

  question: string;

  language: string;

  style: string;

  depth: string;
};

type Attempt = {
  title: string;

  question: string;

  score: number;

  total: number;

  createdAt: number;
};

const sample: ModuleRecord = {
  id: "sample",

  question: "What is a hash map?",

  title: "Hash maps",

  language: "Python",

  style: "clear",

  depth: "junior",

  createdAt: 0,

  definition:
    "A hash map stores key–value pairs in an array of buckets. A hash function turns each key into a bucket index, giving average constant-time lookup, insertion, and deletion when collisions are managed well.",

  sections: [
    {
      heading: "How it works",

      body: "The map hashes a key and uses the result to locate a bucket. Different keys can land in the same bucket; implementations resolve this with chaining or open addressing. Equality checks distinguish keys within a collision.",
    },

    {
      heading: "Why it matters",

      body: "Hash maps trade extra memory for fast access by key. They are a common choice when you need to count, group, deduplicate, or index data without scanning every element.",
    },

    {
      heading: "Common use cases",

      body: "Frequency counters, caches, symbol tables, and two-sum lookups benefit from fast key-based access. Ordered traversal usually needs a different structure or an additional sorting step.",
    },
  ],

  code: {
    language: "Python",

    snippet:
      'counts = {}\nfor word in ["tree", "graph", "tree"]:\n    counts[word] = counts.get(word, 0) + 1\n\nprint(counts["tree"])  # 2',

    explanation:
      "Each word is the key; its count is the value. get supplies zero when the key has not appeared yet.",
  },

  diagram: {
    caption:
      "Two keys hash into bucket 2; the collision is resolved inside that bucket.",

    nodes: [
      { id: "a", label: "hash(key)", x: 15, y: 50 },

      { id: "b", label: "bucket 0", x: 55, y: 18 },

      { id: "c", label: "bucket 1", x: 55, y: 49 },

      { id: "d", label: "bucket 2", x: 55, y: 80 },

      { id: "e", label: "key A → 5", x: 85, y: 68 },

      { id: "f", label: "key B → 9", x: 85, y: 92 },
    ],

    edges: [
      { from: "a", to: "d", label: "index 2" },

      { from: "d", to: "e", label: "" },

      { from: "d", to: "f", label: "" },
    ],
  },

  complexity: [
    {
      operation: "Lookup",

      time: "O(1) avg · O(n) worst",

      space: "O(n)",

      note: "Worst case with many collisions",
    },

    {
      operation: "Insert / delete",

      time: "O(1) avg · O(n) worst",

      space: "O(n)",

      note: "A resize can take O(n)",
    },
  ],

  followUps: [
    "What causes collisions, and how can you resolve them?",

    "How does resizing affect insertion time?",

    "When would you choose a balanced tree instead?",
  ],

  quiz: [
    {
      question: "What does the hash function determine?",

      options: [
        "The array bucket for a key",

        "The value stored for a key",

        "The sort order of every key",

        "The number of keys in the map",
      ],

      correctIndex: 0,

      explanations: [
        "Correct: the hash is mapped to a bucket index.",

        "Values are provided by the caller.",

        "Hash maps are not inherently sorted.",

        "Size is tracked separately.",
      ],
    },

    {
      question: "What is the average lookup time in a well-sized hash map?",

      options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],

      correctIndex: 2,

      explanations: [
        "That commonly describes balanced trees.",

        "A collision-heavy worst case may scan many entries.",

        "Correct: hashing reaches a bucket directly on average.",

        "Sorting complexity does not describe lookup here.",
      ],
    },

    {
      question: "What is a collision?",

      options: [
        "Two values with equal lengths",

        "Two keys mapping to the same bucket",

        "Deleting a missing key",

        "A key with no value",
      ],

      correctIndex: 1,

      explanations: [
        "String length does not define a collision.",

        "Correct: distinct keys can share a bucket.",

        "That is a missing-key case.",

        "Every stored pair has a value.",
      ],
    },
  ],

  relatedTopics: [
    "Hash functions",
    "Collision resolution",
    "Sets",
    "Balanced trees",
  ],
};

function CodeBlock({ code }: { code: string }) {
  const parts = code.split(
    /(#[^\n]*|\/\/[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:for|in|if|else|return|const|let|var|new|public|static|void|int|class|print)\b|\b\d+\b)/g,
  );
  return (
    <pre className="code-block">
      <code>
        {parts.map((part, i) => (
          <span
            key={i}
            className={
              /^(#|\/\/)/.test(part)
                ? "token-comment"
                : /^["']/.test(part)
                  ? "token-string"
                  : /^(for|in|if|else|return|const|let|var|new|public|static|void|int|class|print)$/.test(
                    part,
                  )
                    ? "token-keyword"
                    : /^\d+$/.test(part)
                      ? "token-number"
                      : ""
            }
          >
            {part}
          </span>
        ))}
      </code>
    </pre>
  );
}
function Diagram({ diagram }: { diagram: ModuleRecord["diagram"] }) {
  const nodes = new Map(diagram.nodes.map((n) => [n.id, n]));

  const clamp = (n: number) => Math.max(8, Math.min(92, n));

  return (
    <div className="diagram-wrap">
      <svg
        viewBox="0 0 800 320"
        role="img"
        aria-label={diagram.caption}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="tip"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path
              d="M1 1 L7 4 L1 7"
              fill="none"
              stroke="#80909a"
              strokeWidth="1.5"
            />
          </marker>
        </defs>

        {diagram.edges.map((e, i) => {
          const a = nodes.get(e.from),
            b = nodes.get(e.to);

          if (!a || !b) return null;

          const x1 = clamp(a.x) * 8,
            y1 = clamp(a.y) * 3.2,
            x2 = clamp(b.x) * 8,
            y2 = clamp(b.y) * 3.2;

          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#8aa0aa"
                strokeWidth="2"
                markerEnd="url(#tip)"
              />

              {e.label && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 8}
                  textAnchor="middle"
                  className="edge-label"
                >
                  {e.label.slice(0, 24)}
                </text>
              )}
            </g>
          );
        })}

        {diagram.nodes.map((n, i) => (
          <g key={n.id}>
            <rect
              x={clamp(n.x) * 8 - 58}
              y={clamp(n.y) * 3.2 - 22}
              width="116"
              height="44"
              rx="10"
              fill={i === 0 ? "#195d59" : "#f2f8f6"}
              stroke={i === 0 ? "#195d59" : "#b8d2cd"}
            />

            <text
              x={clamp(n.x) * 8}
              y={clamp(n.y) * 3.2 + 5}
              textAnchor="middle"
              className={i === 0 ? "node-label-invert" : "node-label"}
            >
              {n.label.slice(0, 18)}
            </text>
          </g>
        ))}
      </svg>

      <p>{diagram.caption}</p>
    </div>
  );
}

export default function Home() {
  const { data: session } = authClient.useSession();

  const [savedIds, setSavedIds] = useState<string[]>([]);

  const [question, setQuestion] = useState(""),
    [language, setLanguage] = useState<"Python" | "JavaScript" | "Java">(
      "Python",
    ),
    [style, setStyle] = useState<"clear" | "eli5" | "rigorous">("clear"),
    [depth, setDepth] = useState<"junior" | "mid" | "senior">("junior");

  const [module, setModule] = useState<ModuleRecord>(sample),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [suggestions, setSuggestions] = useState<Suggestion[]>([]),
    [answers, setAnswers] = useState<Record<number, number>>({}),
    [result, setResult] = useState<{ score: number; total: number } | null>(
      null,
    ),
    [attempts, setAttempts] = useState<Attempt[]>([]),
    [saving, setSaving] = useState(false),
    [focused, setFocused] = useState(false);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!session?.user) {
      setSavedIds([]);

      return;
    }

    fetch("/api/saved")
      .then(async (response) =>
        response.ok ? ((await response.json()) as { moduleId: string }[]) : [],
      )

      .then((items) => setSavedIds(items.map((item) => item.moduleId)))

      .catch(() => { });
  }, [session?.user?.id]);

  useEffect(() => {
    const moduleId = new URLSearchParams(window.location.search).get("module");

    if (!moduleId) return;

    void openSuggestion({
      id: moduleId,

      title: "",

      question: "",

      language: "",

      style: "",

      depth: "",
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      setElapsed(0);

      return;
    }

    const started = Date.now();

    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),

      1000,
    );

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    fetch("/api/attempts")
      .then(async (r) => (r.ok ? ((await r.json()) as Attempt[]) : []))

      .then(setAttempts)

      .catch(() => { });
  }, []);

  useEffect(() => {
    if (question.trim().length < 2) {
      setSuggestions([]);

      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(
      () =>
        fetch("/api/modules?q=" + encodeURIComponent(question), {
          signal: controller.signal,
        })
          .then(async (r) => (r.ok ? ((await r.json()) as Suggestion[]) : []))

          .then(setSuggestions)

          .catch(() => { }),

      240,
    );

    return () => {
      clearTimeout(timer);

      controller.abort();
    };
  }, [question]);

  async function toggleSave() {
    if (module.id === "sample") return;

    if (!session?.user) {
      window.location.assign("/login");

      return;
    }

    const wasSaved = savedIds.includes(module.id);

    const response = await fetch("/api/saved", {
      method: wasSaved ? "DELETE" : "POST",

      headers: { "content-type": "application/json" },

      body: JSON.stringify({ moduleId: module.id }),
    });

    if (!response.ok) {
      setError("Could not update saved topics.");

      return;
    }

    setSavedIds((current) =>
      wasSaved
        ? current.filter((id) => id !== module.id)
        : [...current, module.id],
    );
  }

  async function ask(topic = question, regenerate = false) {
    if (topic.trim().length < 3 || loading) return;

    setError("");

    setLoading(true);

    setSuggestions([]);

    setFocused(false);

    try {
      const response = await fetch("/api/modules", {
        method: "POST",

        headers: { "content-type": "application/json" },

        body: JSON.stringify({
          question: topic.trim(),

          language,

          style,

          depth,

          regenerate,
        }),
      });

      const data = (await response.json()) as ModuleRecord & { error?: string };

      if (!response.ok)
        throw new Error(data.error || "Could not generate this module.");

      setModule(data);

      setQuestion(topic);

      setAnswers({});

      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function openSuggestion(s: Suggestion) {
    setError("");

    setSuggestions([]);

    setFocused(false);

    setLoading(true);

    try {
      const response = await fetch("/api/modules/" + encodeURIComponent(s.id));

      if (!response.ok) throw new Error("Could not load this saved topic.");

      const data = (await response.json()) as ModuleRecord;

      setModule(data);

      setQuestion(data.question);

      setLanguage(data.language as typeof language);

      setStyle(data.style as typeof style);

      setDepth(data.depth as typeof depth);

      setAnswers({});

      setResult(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load topic.");
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz() {
    if (Object.keys(answers).length !== module.quiz.length || result || saving)
      return;

    if (module.id === "sample") {
      setResult({
        score: module.quiz.filter((q, i) => answers[i] === q.correctIndex)
          .length,

        total: module.quiz.length,
      });

      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",

        headers: { "content-type": "application/json" },

        body: JSON.stringify({
          moduleId: module.id,

          answers: module.quiz.map((_, i) => answers[i]),
        }),
      });

      const data = (await response.json()) as {
        score: number;

        total: number;

        error?: string;
      };

      if (!response.ok) throw new Error(data.error || "Could not save score.");

      setResult(data);

      fetch("/api/attempts")
        .then(async (r) => (await r.json()) as Attempt[])

        .then(setAttempts)

        .catch(() => { });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save score.");
    } finally {
      setSaving(false);
    }
  }

  const weak = attempts.filter((a) => a.score / a.total < 0.7);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a href = "/" className="brand" aria-label="CodingDolphin home">
          <span className="">

            CodingDolphin <strong></strong>
          </span>
        </a>

        <div className="topbar-right">
          {session?.user ? (
            <>  
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
            </>
          ) : (
            <>
              <span className="topbar-note">Technical Interview Study Space</span>
              <a href="/login">Log in</a>
            </>
          )}
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-inner">
            <div className="sidebar-label">WORKSPACE</div>

            <div className="nav-item active">
              <Code2 size={18} /> Study module
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-label">YOUR PROGRESS</div>

            {attempts.length ? (
              <>
                <div className="stat">
                  <strong>{attempts.length}</strong>

                  <span>quiz attempts</span>
                </div>

                <div className="stat">
                  <strong>{weak.length}</strong>

                  <span>to revisit</span>
                </div>

                <div className="sidebar-label recent-label">
                  RECENT PRACTICE
                </div>

                {attempts.slice(0, 5).map((a, i) => (
                  <button
                    className="recent-item"
                    key={i}
                    onClick={() => ask(a.question)}
                  >
                    <span
                      className={
                        a.score / a.total < 0.7 ? "score-dot weak" : "score-dot"
                      }
                    />

                    <span>
                      {a.title}

                      <small>
                        {a.score}/{a.total} correct
                      </small>
                    </span>
                  </button>
                ))}
              </>
            ) : (
              <p className="sidebar-empty">
                Your quiz results will appear here after your first practice
                round.
              </p>
            )}

            <div className="sidebar-bottom">
              Build understanding.
              <br />
              Practice recall.
              <br />
              Repeat what needs work.
            </div>
          </div>
        </aside>

        <div className="main-column">
          <section className="ask-panel">
            <div className="ask-heading">
              <span className="eyebrow">
                <Sparkles size={14} /> YOUR STUDY DESK
              </span>

              <h1>What are you studying?</h1>

              <p>
                Ask a CS concept or interview question. Get an explanation you
                can actually use.
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void ask();
              }}
              className="ask-form"
            >
              <div className="query-field">
                <Search size={20} />

                <Input
                  aria-label="Topic or interview question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How does a B-tree work?"
                  maxLength={300}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 180)}
                />

                {focused && suggestions.length > 0 && (
                  <div className="suggestions">
                    {suggestions.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => openSuggestion(s)}
                      >
                        <Clock3 size={15} />

                        <span>
                          {s.title}

                          <small>
                            {s.language} · {s.depth}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="controls">
                <div className="selects">
                  <label>
                    LANGUAGE
                    <Select
                      value={language}
                      onValueChange={(v) => setLanguage(v as typeof language)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {["Python", "JavaScript", "Java"].map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  <label>
                    EXPLANATION
                    <Select
                      value={style}
                      onValueChange={(v) => setStyle(v as typeof style)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="clear">Clear & concise</SelectItem>

                        <SelectItem value="eli5">ELI5</SelectItem>

                        <SelectItem value="rigorous">Rigorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>

                  <label>
                    LEVEL
                    <Select
                      value={depth}
                      onValueChange={(v) => setDepth(v as typeof depth)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>

                        <SelectItem value="mid">Mid-level</SelectItem>

                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading || question.trim().length < 3}
                  className="generate-btn"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={17} className="spin" /> Creating ·{" "}
                      {elapsed}s
                    </>
                  ) : (
                    <>
                      Generate module <ArrowRight size={17} />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {loading && (
              <p className="loading-note" role="status">
                Building the explanation, code, diagram, and quiz. New topics
                take longer; saved topics open immediately.
              </p>
            )}

            <div className="prompts">
              <span>TRY A TOPIC</span>

              {["BFS", "Big-O notation", "Binary search", "Two Sum"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQuestion(s);

                      ask(s);
                    }}
                  >
                    {s}
                  </button>
                ),
              )}
            </div>

            {error && (
              <div role="alert" className="error-message">
                {error}
              </div>
            )}
          </section>

          <section className="module-panel" aria-busy={loading}>
            <div className="module-top">
              <div>
                <div className="eyebrow module-eyebrow">
                  {module.id === "sample" ? "SAMPLE MODULE" : "STUDY MODULE"}{" "}
                  <span>·</span> {module.depth.toUpperCase()} LEVEL
                </div>

                <h2>{module.title}</h2>

                <p className="module-meta">
                  {module.language} example <span>·</span> {module.quiz.length}{" "}
                  practice questions{" "}
                  {module.cached && <span>· Cached lesson</span>}
                </p>
              </div>

              {module.id !== "sample" && (
                <Button type="button" variant="outline" onClick={toggleSave}>
                  {savedIds.includes(module.id) ? "Saved ✓" : "Save"}
                </Button>
              )}

              {module.id !== "sample" && (
                <Button
                  variant="outline"
                  className="regenerate"
                  onClick={() => ask(module.question, true)}
                  disabled={loading}
                >
                  <RotateCcw size={15} /> Regenerate
                </Button>
              )}
            </div>

            <div className="module-body">
              <section className="definition">
                <div className="section-kicker">01 / THE SHORT ANSWER</div>

                <p>{module.definition}</p>
              </section>

              <div className="content-grid">
                <div className="content-main">
                  <section className="study-section">
                    <div className="section-kicker">02 / UNDERSTAND IT</div>

                    <h3>Under the hood</h3>

                    {module.sections.map((s, i) => (
                      <div key={i} className="explain-block">
                        <h4>
                          <span>0{i + 1}</span>

                          {s.heading}
                        </h4>

                        <p>{s.body}</p>
                      </div>
                    ))}
                  </section>

                  <section className="study-section">
                    <div className="section-kicker">03 / SEE IT IN ACTION</div>

                    <div className="section-heading">
                      <h3>Code example</h3>

                      <span className="language-pill">
                        <Code2 size={13} />

                        {module.code.language}
                      </span>
                    </div>

                    <CodeBlock code={module.code.snippet} />

                    <p className="code-explain">{module.code.explanation}</p>
                  </section>
                </div>

                <aside className="content-aside">
                  <section className="diagram-card">
                    <div className="section-kicker">VISUAL MODEL</div>

                    <h3>How it connects</h3>

                    <Diagram diagram={module.diagram} />
                  </section>

                  <section className="quick-card">
                    <div className="section-kicker">INTERVIEW FOLLOW-UPS</div>

                    {module.followUps.map((q, i) => (
                      <p key={i}>
                        <span>↳</span>

                        {q}
                      </p>
                    ))}
                  </section>
                </aside>
              </div>

              {module.complexity.length > 0 && (
                <section className="study-section complexity">
                  <div className="section-kicker">04 / TRADE-OFFS</div>

                  <h3>Complexity at a glance</h3>

                  <div className="table-wrap">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operation</TableHead>

                          <TableHead>Time</TableHead>

                          <TableHead>Space</TableHead>

                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {module.complexity.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-semibold">
                              {row.operation}
                            </TableCell>

                            <TableCell className="mono">{row.time}</TableCell>

                            <TableCell className="mono">{row.space}</TableCell>

                            <TableCell>{row.note}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              )}

              <section className="quiz-section">
                <div className="quiz-heading">
                  <div>
                    <div className="section-kicker">
                      05 / CHECK YOUR UNDERSTANDING
                    </div>

                    <h3>Quick quiz</h3>
                  </div>

                  <span>{module.quiz.length} QUESTIONS</span>
                </div>

                {module.quiz.map((q, i) => (
                  <div className="quiz-question" key={i}>
                    <h4>
                      <span>{String(i + 1).padStart(2, "0")}</span>

                      {q.question}
                    </h4>

                    <div className="quiz-options">
                      {q.options.map((option, j) => (
                        <button
                          type="button"
                          key={j}
                          disabled={!!result}
                          onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                          className={[
                            "quiz-option",

                            answers[i] === j ? "selected" : "",

                            result && j === q.correctIndex ? "correct" : "",

                            result && answers[i] === j && j !== q.correctIndex
                              ? "incorrect"
                              : "",
                          ].join(" ")}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + j)}
                          </span>

                          <span>{option}</span>

                          {result && j === q.correctIndex && (
                            <Check size={17} />
                          )}
                        </button>
                      ))}
                    </div>

                    {result && (
                      <p className="answer-note">
                        {q.explanations[answers[i]]}{" "}
                        {answers[i] !== q.correctIndex && (
                          <span>
                            Correct answer: {q.explanations[q.correctIndex]}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                ))}

                <div className="quiz-footer">
                  <Button
                    disabled={
                      Object.keys(answers).length !== module.quiz.length ||
                      !!result ||
                      saving
                    }
                    onClick={submitQuiz}
                  >
                    {saving
                      ? "Saving…"
                      : result
                        ? "Quiz completed"
                        : "Check answers"}
                  </Button>

                  {result && (
                    <strong>
                      {result.score}/{result.total} correct{" "}
                      {module.id === "sample" && (
                        <small>· Sample scores are not saved</small>
                      )}
                    </strong>
                  )}
                </div>
              </section>

              <section className="related">
                <div className="section-kicker">KEEP EXPLORING</div>

                <h3>Related topics</h3>

                <div>
                  {module.relatedTopics.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setQuestion(t);

                        ask(t);
                      }}
                    >
                      {t}

                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

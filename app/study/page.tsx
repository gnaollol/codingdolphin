"use client";

import { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  ArrowLeft,
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
      check: {
        question: "What happens when two keys hash to the same bucket?",
        options: [
          "Both keys are lost",
          "A collision must be resolved",
          "The map sorts every key",
          "The bucket is deleted",
        ],
        correctIndex: 1,
        explanations: [
          "The keys can still be stored.",
          "Correct: chaining or open addressing handles the collision.",
          "Hash maps do not sort keys to handle collisions.",
          "The bucket stays in use.",
        ],
      },
    },

    {
      heading: "Why it matters",

      body: "Hash maps trade extra memory for fast access by key. They are a common choice when you need to count, group, deduplicate, or index data without scanning every element.",
      check: {
        question: "What is a typical trade-off when using a hash map?",
        options: [
          "More memory for fast key access",
          "Less memory for sorted keys",
          "Slower access for no storage",
          "No collisions ever",
        ],
        correctIndex: 0,
        explanations: [
          "Correct: extra storage supports fast access by key.",
          "The section does not claim sorted keys.",
          "Hash maps aim for fast access.",
          "Collisions can still occur.",
        ],
      },
    },

    {
      heading: "Common use cases",

      body: "Frequency counters, caches, symbol tables, and two-sum lookups benefit from fast key-based access. Ordered traversal usually needs a different structure or an additional sorting step.",
      check: {
        question: "Which task is a natural use for a hash map?",
        options: [
          "Maintaining sorted traversal automatically",
          "Counting how often each word appears",
          "Rendering a page layout",
          "Finding the median without processing data",
        ],
        correctIndex: 1,
        explanations: [
          "Ordered traversal needs more work.",
          "Correct: a frequency counter maps each word to a count.",
          "That is unrelated to key-based indexing.",
          "A hash map does not directly provide a median.",
        ],
      },
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

type SectionCheck = NonNullable<ModuleRecord["sections"][number]["check"]>;

// Common built-in lessons and older cached copies do not have generated checks.
const builtInChecks: Record<string, SectionCheck[]> = {
  "Breadth-first search (BFS)": [
    {
      question: "When should BFS mark a neighbor as visited?",
      options: [
        "When it is enqueued",
        "After every node is removed",
        "Only after reaching the goal",
        "Before the search starts",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: this prevents duplicate entries in the queue.",
        "Waiting can enqueue the same node repeatedly.",
        "The visited set is useful throughout the search.",
        "Only the start is marked initially.",
      ],
    },
    {
      question: "What does BFS guarantee in an unweighted graph?",
      options: [
        "The fewest edges from the start",
        "The lightest weighted path",
        "A cycle-free graph",
        "Sorted nodes",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: each layer adds one edge.",
        "Weighted shortest paths need another algorithm.",
        "The visited set prevents repeated visits, not cycles in the graph.",
        "Traversal order is not a sort.",
      ],
    },
    {
      question: "Which problem is a good fit for BFS?",
      options: [
        "A minimum-move puzzle",
        "A weighted shortest path with arbitrary weights",
        "Sorting a list",
        "Finding a hash collision",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: moves can be treated as unweighted edges.",
        "Edge weights call for a suitable weighted-path algorithm.",
        "BFS explores a graph rather than sorting values.",
        "That is a hashing problem.",
      ],
    },
  ],
  "Big-O notation": [
    {
      question: "What is the Big-O bound of 3n² + 5n + 2?",
      options: ["O(n²)", "O(n)", "O(1)", "O(3n² + 5n + 2) only"],
      correctIndex: 0,
      explanations: [
        "Correct: n² is the dominant growing term.",
        "n grows more slowly than n².",
        "The work changes with n.",
        "Big-O commonly simplifies to the dominant term.",
      ],
    },
    {
      question: "What does Big-O leave out?",
      options: [
        "Exact runtime on a specific machine",
        "How work scales with input size",
        "The dominant growth term",
        "Whether an algorithm has a loop",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: constants and hardware can affect actual runtime.",
        "That is what asymptotic analysis describes.",
        "That term determines the common bound.",
        "Loops can be part of the analysis.",
      ],
    },
    {
      question: "Which lookup usually takes O(log n) on a sorted array?",
      options: [
        "Binary search",
        "Linear scan",
        "Checking each element twice",
        "Copying the entire array",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: binary search halves the range.",
        "A full scan takes O(n).",
        "Repeated scans still take O(n).",
        "A full copy takes O(n).",
      ],
    },
  ],
  "Binary search": [
    {
      question:
        "What should happen when the middle value is smaller than the target?",
      options: [
        "Move the left bound past the middle",
        "Move the right bound past the middle",
        "Search the entire range again",
        "Stop immediately",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: the target can only be in the right half.",
        "That discards the possible target range.",
        "The point is to shrink the range.",
        "The target may still be present.",
      ],
    },
    {
      question: "What input condition does standard binary search require?",
      options: [
        "Sorted order",
        "Distinct values",
        "An even array length",
        "A linked list",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: ordering lets the search discard half.",
        "Duplicates can still be searched.",
        "Any length works.",
        "Arrays allow efficient middle access.",
      ],
    },
    {
      question: "Where else can a binary-search pattern be used?",
      options: [
        "Finding an insertion position",
        "Hashing an unsorted key",
        "Walking every tree edge",
        "Counting all characters",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: insertion boundaries can be found in sorted data.",
        "Hashing is a different approach.",
        "That is traversal.",
        "That is a linear scan.",
      ],
    },
  ],
  "Two Sum": [
    {
      question: "For a value x, what do we look for in the map?",
      options: [
        "target − x",
        "target + x",
        "x − target",
        "x itself every time",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: the complement completes the pair.",
        "That would not add to the target.",
        "The subtraction goes the other way.",
        "The other value is generally different.",
      ],
    },
    {
      question: "What is the common benefit of a hash map in Two Sum?",
      options: [
        "Average O(n) time using extra memory",
        "Always O(1) total time",
        "Sorted output for free",
        "No need to inspect values",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: each value is processed once with expected constant-time lookup.",
        "The input must still be scanned.",
        "A map does not sort results.",
        "Each value is inspected.",
      ],
    },
    {
      question: "What can a two-pointer solution save when input is sorted?",
      options: [
        "Auxiliary space",
        "The need to compare values",
        "The need for sorted input",
        "All implementation details",
      ],
      correctIndex: 0,
      explanations: [
        "Correct: two pointers can use O(1) extra space.",
        "Pointers still compare values.",
        "The approach depends on sorting.",
        "Indices and duplicate values still need care.",
      ],
    },
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
  const { data: session, isPending } = authClient.useSession();
  const quizLocked = isPending || !session?.user;
  const moduleRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [checkAnswers, setCheckAnswers] = useState<Record<number, number>>({});
  const [passedSections, setPassedSections] = useState<Record<number, boolean>>(
    {},
  );

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

  const codeSlide = module.sections.length + 1;
  const tradeoffsSlide = codeSlide + 1;
  const quizSlide = tradeoffsSlide + 1;
  const totalSlides = quizSlide + 1;
  const sectionIndex = slide - 1;
  const currentCheck =
    module.sections[sectionIndex]?.check ??
    builtInChecks[module.title]?.[sectionIndex];
  const canAdvance =
    slide !== quizSlide &&
    (!currentCheck || passedSections[sectionIndex] === true);

  function goToSlide(next: number) {
    if (next < 0 || next >= totalSlides || (next > slide && !canAdvance))
      return;
    setSlide(next);
    moduleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetLesson() {
    setSlide(0);
    setCheckAnswers({});
    setPassedSections({});
    setAnswers({});
    setResult(null);
  }

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

      .catch(() => {});
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

      .catch(() => {});
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

          .catch(() => {}),

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

      resetLesson();
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

      resetLesson();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load topic.");
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz() {
    if (quizLocked) return;

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

        .catch(() => {});
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
        <a href="/" className="brand" aria-label="CodingDolphin home">
          <span className="">
            CodingDolphin <strong></strong>
          </span>
        </a>

        <div className="topbar-right">
          {session?.user ? (
            <>
              <details className="profile-menu">
                <summary
                  className="profile-trigger"
                  aria-label="Open profile menu"
                >
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
              <span className="topbar-note">
                Technical Interview Study Space
              </span>
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

          <section className="module-panel" aria-busy={loading} ref={moduleRef}>
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

            <div
              className="module-body"
              onTouchStart={(event) => {
                touchStartX.current = event.changedTouches[0]?.clientX ?? null;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const distance =
                  event.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (distance < -80) goToSlide(slide + 1);
                if (distance > 80) goToSlide(slide - 1);
              }}
            >
              <div className="mb-6 rounded-xl border border-[#dce6e6] bg-white p-4">
                <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#195d59]">
                  <span>
                    STEP {String(slide + 1).padStart(2, "0")} /{" "}
                    {String(totalSlides).padStart(2, "0")}
                  </span>
                  <span>
                    {Math.round(((slide + 1) / totalSlides) * 100)}% viewed
                  </span>
                </div>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-[#e5efed]"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-[#195d59] transition-all"
                    style={{ width: `${((slide + 1) / totalSlides) * 100}%` }}
                  />
                </div>
              </div>

              {slide === 0 && (
                <section className="definition">
                  <div className="section-kicker">01 / THE SHORT ANSWER</div>

                  <p>{module.definition}</p>
                </section>
              )}

              {slide > 0 && slide < quizSlide && (
                <div className="content-grid">
                  <div className="content-main">
                    {slide <= module.sections.length && (
                      <section className="study-section">
                        <div className="section-kicker">02 / UNDERSTAND IT</div>

                        <h3>{module.sections[sectionIndex].heading}</h3>

                        {module.sections
                          .filter((_, i) => i === sectionIndex)
                          .map((s) => (
                            <div key={sectionIndex} className="explain-block">
                              <h4>
                                <span>
                                  {String(sectionIndex + 1).padStart(2, "0")}
                                </span>

                                {s.heading}
                              </h4>

                              <p>{s.body}</p>
                            </div>
                          ))}

                        {currentCheck && (
                          <div className="relative mt-7 rounded-xl border border-[#dce6e6] bg-[#f7fbfa] p-5">
                            <div
                              inert={quizLocked}
                              aria-hidden={quizLocked}
                              className={
                                quizLocked
                                  ? "pointer-events-none select-none blur-[5px]"
                                  : ""
                              }
                            >
                              <div className="section-kicker">
                                QUICK COMPREHENSION CHECK
                              </div>
                              <h4 className="mt-2 font-semibold text-[#17282d]">
                                {currentCheck.question}
                              </h4>
                              <div className="mt-4 grid gap-2">
                                {currentCheck.options.map((option, choice) => (
                                  <button
                                    type="button"
                                    key={choice}
                                    aria-pressed={
                                      checkAnswers[sectionIndex] === choice
                                    }
                                    onClick={() => {
                                      if (quizLocked) return;
                                      setCheckAnswers((old) => ({
                                        ...old,
                                        [sectionIndex]: choice,
                                      }));
                                      if (
                                        choice === currentCheck.correctIndex
                                      ) {
                                        setPassedSections((old) => ({
                                          ...old,
                                          [sectionIndex]: true,
                                        }));
                                      }
                                    }}
                                    className={`rounded-lg border p-3 text-left text-sm transition hover:border-[#195d59] ${checkAnswers[sectionIndex] === choice ? "border-[#195d59] bg-white font-semibold" : "border-[#dce6e6] bg-white"}`}
                                  >
                                    <span className="mr-3 font-bold text-[#195d59]">
                                      {String.fromCharCode(65 + choice)}.
                                    </span>
                                    {option}
                                  </button>
                                ))}
                              </div>
                              {checkAnswers[sectionIndex] !== undefined && (
                                <p
                                  role="status"
                                  className={`mt-3 text-sm ${checkAnswers[sectionIndex] === currentCheck.correctIndex ? "text-[#195d59]" : "text-[#9c4c2a]"}`}
                                >
                                  {
                                    currentCheck.explanations[
                                      checkAnswers[sectionIndex]
                                    ]
                                  }
                                  {checkAnswers[sectionIndex] !==
                                    currentCheck.correctIndex &&
                                    " Try another answer to continue."}
                                </p>
                              )}
                            </div>
                            {quizLocked && (
                              <div className="absolute inset-0 flex items-center justify-center p-3">
                                {isPending ? (
                                  <p className="rounded-lg bg-white/95 p-3 text-sm text-[#64767a]">
                                    Checking your account…
                                  </p>
                                ) : (
                                  <a
                                    href="/login"
                                    className="rounded-lg bg-[#195d59] px-5 py-3 text-sm font-semibold text-white shadow-lg"
                                  >
                                    Log in to answer and continue
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {!currentCheck && (
                          <p className="mt-4 text-sm text-[#64767a]">
                            This saved lesson predates comprehension checks.
                            Regenerate it for new questions, or continue
                            reading.
                          </p>
                        )}
                      </section>
                    )}

                    {slide === codeSlide && (
                      <section className="study-section">
                        <div className="section-kicker">
                          03 / SEE IT IN ACTION
                        </div>

                        <div className="section-heading">
                          <h3>Code example</h3>

                          <span className="language-pill">
                            <Code2 size={13} />

                            {module.code.language}
                          </span>
                        </div>

                        <CodeBlock code={module.code.snippet} />

                        <p className="code-explain">
                          {module.code.explanation}
                        </p>
                      </section>
                    )}
                    {slide === tradeoffsSlide &&
                      module.complexity.length > 0 && (
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

                                    <TableCell className="mono">
                                      {row.time}
                                    </TableCell>

                                    <TableCell className="mono">
                                      {row.space}
                                    </TableCell>

                                    <TableCell>{row.note}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </section>
                      )}
                  </div>

                  <aside className="content-aside">
                    {slide === codeSlide && (
                      <section className="diagram-card">
                        <div className="section-kicker">VISUAL MODEL</div>

                        <h3>How it connects</h3>

                        <Diagram diagram={module.diagram} />
                      </section>
                    )}

                    {slide === tradeoffsSlide && (
                      <section className="quick-card">
                        <div className="section-kicker">
                          INTERVIEW FOLLOW-UPS
                        </div>

                        {module.followUps.map((q, i) => (
                          <p key={i}>
                            <span>↳</span>

                            {q}
                          </p>
                        ))}
                      </section>
                    )}
                  </aside>
                </div>
              )}

              {slide === quizSlide && (
                <div className="relative">
                  <div
                    inert={quizLocked}
                    aria-hidden={quizLocked}
                    className={
                      quizLocked
                        ? "pointer-events-none select-none blur-[5px]"
                        : ""
                    }
                  >
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
                                onClick={() =>
                                  setAnswers((a) => ({ ...a, [i]: j }))
                                }
                                className={[
                                  "quiz-option",

                                  answers[i] === j ? "selected" : "",

                                  result && j === q.correctIndex
                                    ? "correct"
                                    : "",

                                  result &&
                                  answers[i] === j &&
                                  j !== q.correctIndex
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
                                  Correct answer:{" "}
                                  {q.explanations[q.correctIndex]}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      ))}

                      <div className="quiz-footer">
                        <Button
                          disabled={
                            Object.keys(answers).length !==
                              module.quiz.length ||
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
                  </div>

                  {quizLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                      <div className="w-full max-w-sm rounded-2xl border border-[#dce6e6] bg-white/95 p-6 text-center shadow-xl backdrop-blur-sm">
                        {isPending ? (
                          <p className="text-sm text-[#64767a]">
                            Checking your account…
                          </p>
                        ) : (
                          <>
                            <h3 className="text-xl font-bold text-[#17282d]">
                              Log in to unlock the quiz
                            </h3>
                            <p className="mt-2 text-sm text-[#64767a]">
                              Test what you learned and save your score.
                            </p>
                            <a
                              href="/login"
                              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#195d59] px-6 py-2 font-semibold text-white hover:bg-[#134945]"
                            >
                              Log in
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {slide === quizSlide && (
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
              )}

              <nav
                aria-label="Lesson steps"
                className="mt-8 flex items-center justify-between gap-3 border-t border-[#dce6e6] pt-5"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToSlide(slide - 1)}
                  disabled={slide === 0}
                  aria-label="Previous step"
                >
                  <ArrowLeft size={18} />{" "}
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <span
                  className="text-center text-sm text-[#64767a]"
                  role="status"
                >
                  {currentCheck && !canAdvance
                    ? "Answer correctly to continue"
                    : slide === quizSlide
                      ? "Final quiz"
                      : "Swipe or tap Next"}
                </span>
                <Button
                  type="button"
                  onClick={() => goToSlide(slide + 1)}
                  disabled={!canAdvance}
                  aria-label="Next step"
                >
                  <span className="hidden sm:inline">Next</span>{" "}
                  <ArrowRight size={18} />
                </Button>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

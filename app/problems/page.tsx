"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Lightbulb,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { StreamLanguage } from "@codemirror/language";
import { csharp } from "@codemirror/legacy-modes/mode/clike";

import { codingProblems, type CodingProblem } from "@/lib/coding-problems";
import { codingLanguages, type CodingLanguage } from "@/lib/coding-languages";
import { getStarterCode } from "@/lib/coding-starters";
import blindStyles from "./blind75.module.css";
import { runJavaScript, type TestResult } from "@/lib/run-javascript";
import styles from "./problems.module.css";

type Submission = {
  id: string;
  code: string;
  passed: number;
  total: number;
  createdAt: number;
};

function editorLanguage(language: CodingLanguage) {
  switch (language) {
    case "Python":
      return python();
    case "Java":
      return java();
    case "C++":
      return cpp();
    case "C#":
      return StreamLanguage.define(csharp);
    default:
      return javascript();
  }
}

function sectionFor(problem: CodingProblem): string {
  if (problem.slug === "two-sum") return "Arrays & Hashing";
  if (problem.slug === "valid-parentheses") return "Stack";
  if (problem.collection === "Extra Practice") return "Extra Practice";
  return problem.category.split(" · ")[0];
}

function ProblemWorkspace({
  problem,
  language,
}: {
  problem: CodingProblem;
  language: CodingLanguage;
}) {
  const starterCode = getStarterCode(problem, language);
  const draftKey = `coding-dolphin:draft:${problem.slug}:${language}`;
  const [code, setCode] = useState(starterCode ?? "");
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [accountReady, setAccountReady] = useState(false);
  const [syncMessage, setSyncMessage] = useState("Checking account…");
  const [lastPassed, setLastPassed] = useState<Submission | null>(null);
  const editedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestCodeRef = useRef(code);

  useEffect(() => {
    let cancelled = false;
    editedRef.current = false;
    let localDraft: string | null = null;
    let localUpdatedAt = 0;
    try {
      // Keep drafts saved by the old JavaScript-only version of the editor.
      const previousJavaScriptDraft =
        language === "JavaScript"
          ? localStorage.getItem(`coding-dolphin:draft:${problem.slug}`)
          : null;
      localDraft = localStorage.getItem(draftKey) ?? previousJavaScriptDraft;
      localUpdatedAt =
        Number(localStorage.getItem(`${draftKey}:updatedAt`)) || 0;
      latestCodeRef.current = localDraft ?? starterCode ?? "";
      setCode(latestCodeRef.current);
    } catch {
      latestCodeRef.current = starterCode ?? "";
      setCode(starterCode ?? "");
    }
    setResults(null);
    setError("");
    setShowHint(false);
    setAccountReady(false);
    setSyncMessage("Checking account…");
    setLastPassed(null);

    // The user can type while progress loads. A late response must not
    // overwrite edits made since this request started.
    fetch(
      `/api/coding?problem=${encodeURIComponent(problem.slug)}&language=${encodeURIComponent(language)}`,
    )
      .then(async (response) => {
        if (response.status === 401) return { signedOut: true } as const;
        if (!response.ok) throw new Error("Could not load account progress.");
        return (await response.json()) as {
          draft: string | null;
          draftUpdatedAt: number;
          submissions: Submission[];
        };
      })
      .then((data) => {
        if (cancelled) return;
        if ("signedOut" in data) {
          setSyncMessage("Browser draft only · Log in to sync across devices.");
          return;
        }
        setAccountReady(true);
        setLastPassed(data.submissions[0] ?? null);
        if (
          !editedRef.current &&
          data.draft !== null &&
          data.draftUpdatedAt >= localUpdatedAt
        ) {
          latestCodeRef.current = data.draft;
          setCode(data.draft);
          try {
            localStorage.setItem(draftKey, data.draft);
            localStorage.setItem(
              `${draftKey}:updatedAt`,
              String(data.draftUpdatedAt),
            );
          } catch {
            /* optional */
          }
        } else if (
          editedRef.current ||
          (localDraft !== null && localUpdatedAt > data.draftUpdatedAt) ||
          (localDraft !== null && data.draft === null)
        ) {
          void saveDraft(latestCodeRef.current);
        }
        setSyncMessage(
          editedRef.current
            ? "Save your new edits to your account."
            : "Account progress loaded.",
        );
      })
      .catch(() => {
        if (!cancelled)
          setSyncMessage("Browser draft available · Account sync unavailable.");
      });
    return () => {
      cancelled = true;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [problem, language, draftKey, starterCode]);

  function updateCode(next: string) {
    editedRef.current = true;
    latestCodeRef.current = next;
    setCode(next);
    setResults(null);
    setError("");
    if (accountReady) {
      setSyncMessage("Saving draft…");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        void saveDraft(next);
      }, 750);
    }
    try {
      localStorage.setItem(draftKey, next);
      localStorage.setItem(`${draftKey}:updatedAt`, String(Date.now()));
    } catch {
      // The editor still works when browser storage is unavailable.
    }
  }

  async function saveDraft(nextCode: string) {
    try {
      const response = await fetch("/api/coding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemSlug: problem.slug,
          language,
          code: nextCode,
        }),
      });
      if (!response.ok) throw new Error("Could not save the draft.");
      setSyncMessage("Draft saved to your account.");
    } catch {
      setSyncMessage(
        "Could not sync. Your draft is still saved in this browser.",
      );
    }
  }

  async function runTests() {
    if (running) return;
    if (language !== "JavaScript") {
      setRunning(true);
      setResults(null);
      setError("");
      try {
        const response = await fetch("/api/coding/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problemSlug: problem.slug, language, code }),
        });
        const data = (await response.json()) as {
          passed?: boolean[];
          actuals?: unknown[];
          testErrors?: (string | null)[];
          error?: string | null;
          saved?: boolean;
          submission?: Submission | null;
        };
        if (!response.ok)
          throw new Error(data.error ?? "Could not submit the solution.");
        if (
          !Array.isArray(data.passed) ||
          data.passed.length !== problem.tests.length ||
          !Array.isArray(data.actuals) ||
          data.actuals.length !== problem.tests.length ||
          !Array.isArray(data.testErrors) ||
          data.testErrors.length !== problem.tests.length
        ) {
          throw new Error("The runner returned incomplete results.");
        }
        setResults(
          problem.tests.map((test, index) => ({
            input: test.args,
            expected: test.expected,
            passed: data.passed![index],
            actual: data.actuals![index],
            error: data.testErrors![index] ?? undefined,
          })),
        );
        setError(data.error ?? "");
        if (data.submission) setLastPassed(data.submission);
        setSyncMessage(
          data.saved
            ? "Accepted · Last passed solution saved."
            : "Not accepted · Your working draft is still saved.",
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not submit the solution.",
        );
      } finally {
        setRunning(false);
      }
      return;
    }
    setRunning(true);
    setResults(null);
    setError("");
    try {
      const outcome = await runJavaScript(code, problem);
      setResults(outcome.results);
      setError(outcome.error ?? "");
      if (
        accountReady &&
        !outcome.error &&
        outcome.results.length === problem.tests.length &&
        outcome.results.every((test) => test.passed)
      ) {
        try {
          const passed = outcome.results.filter((test) => test.passed).length;
          const response = await fetch("/api/coding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              problemSlug: problem.slug,
              language: "JavaScript",
              code,
              passed,
            }),
          });
          if (!response.ok) throw new Error("Save failed");
          const data = (await response.json()) as { submission: Submission };
          setLastPassed(data.submission);
          setSyncMessage("Accepted · Last passed solution saved.");
        } catch {
          setSyncMessage("Tests ran, but the attempt could not be saved.");
        }
      } else if (!outcome.error) {
        setSyncMessage(
          outcome.results.every((test) => test.passed)
            ? "Tests passed · Log in to save your accepted solution."
            : "Not accepted · Your working draft is still saved.",
        );
      }
    } catch {
      setError("Could not run the tests. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className={styles.workspace}>
      <section
        className={styles.descriptionPane}
        aria-label="Problem description"
      >
        <div className="flex items-center gap-2 border-b border-[#e4ecea] bg-[#fbfdfc] px-5 py-3 text-sm font-semibold text-[#195d59]">
          <Code2 size={16} aria-hidden="true" /> Description
        </div>
        <div className={styles.descriptionScroll}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                problem.difficulty === "Hard"
                  ? blindStyles.hardBadge
                  : problem.difficulty === "Medium"
                    ? styles.mediumBadge
                    : styles.easyBadge
              }
            >
              {problem.difficulty}
            </span>
            <span className="rounded-md bg-[#f1f5f4] px-2.5 py-1 text-xs font-medium text-[#607575]">
              {problem.category}
            </span>
            {lastPassed && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#258359]">
                <CheckCircle2 size={14} /> Solved
              </span>
            )}
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#173a39]">
            {problem.title}
          </h2>
          <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-[#344b4d]">
            {problem.prompt}
          </p>

          <h3 className="mt-9 border-b border-[#e8eeec] pb-2 text-sm font-bold uppercase tracking-wide text-[#536969]">
            Examples
          </h3>
          <div className="mt-4 space-y-4">
            {problem.examples.map((example, index) => (
              <div key={`${index}:${example.input}`}>
                <h4 className="mb-2 text-sm font-bold text-[#1e4140]">
                  Example {index + 1}
                </h4>
                <div className="border-l-[3px] border-[#bddbd2] bg-[#f6f9f8] px-4 py-3 text-sm leading-6 text-[#344b4d]">
                  <p>
                    <strong>Input:</strong>{" "}
                    <code className="break-words">{example.input}</code>
                  </p>
                  <p>
                    <strong>Output:</strong>{" "}
                    <code className="break-words">{example.output}</code>
                  </p>
                  {example.explanation && (
                    <p>
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-9 border-b border-[#e8eeec] pb-2 text-sm font-bold uppercase tracking-wide text-[#536969]">
            Constraints
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#344b4d]">
            {problem.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setShowHint((current) => !current)}
            aria-expanded={showHint}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#195d59] hover:underline"
          >
            <Lightbulb size={17} /> {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && (
            <p className="mt-3 rounded-lg bg-[#fff8e9] p-4 text-sm leading-6 text-[#5b4d29]">
              {problem.hint}
            </p>
          )}
        </div>
      </section>

      <section
        className={styles.editorPane}
        aria-label="Code editor and test results"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334449] bg-[#243137] px-4 py-2.5 text-sm text-[#e7f2ef]">
          <span className="inline-flex items-center gap-2 font-semibold">
            <Code2 size={16} className="text-[#66d4a3]" /> Code{" "}
            <span className="rounded-md bg-[#34464a] px-2 py-0.5 text-xs font-medium text-[#c5d7d3]">
              {language}
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset this solution to the starter code?"))
                updateCode(starterCode ?? "");
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#b9cfca] hover:bg-[#34464a] hover:text-white"
          >
            <RotateCcw size={14} /> Reset code
          </button>
        </div>
        <div className={styles.codeFrame}>
          <CodeMirror
            value={code}
            height="100%"
            extensions={[editorLanguage(language)]}
            onChange={updateCode}
            theme="dark"
            basicSetup={{ lineNumbers: true, foldGutter: true }}
            aria-label={`${language} solution editor`}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#334449] bg-[#243137] px-4 py-2.5">
          <p
            className="min-w-0 flex-1 truncate text-xs text-[#b7cdc6]"
            aria-live="polite"
          >
            {syncMessage}
          </p>
          <button
            type="button"
            onClick={runTests}
            disabled={running || starterCode === null}
            className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#37c980] px-4 py-1.5 text-sm font-bold text-[#10291f] transition-colors hover:bg-[#59dfa0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Play size={15} fill="currentColor" />{" "}
            {running ? "Submitting…" : "Submit"}
          </button>
        </div>

        <div className={styles.resultsPane} aria-live="polite">
          <div className="flex items-center justify-between gap-3 border-b border-[#334449] px-5 py-3 text-sm font-semibold text-[#e7f2ef]">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#66d4a3]" /> Test result
            </span>
            {results && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs ${results.every((test) => test.passed) && !error ? "bg-[#1d6349] text-[#b8f9d7]" : "bg-[#653b3b] text-[#ffd0cd]"}`}
              >
                {results.filter((test) => test.passed).length}/{results.length}{" "}
                passed
              </span>
            )}
          </div>
          <div className={styles.resultsScroll}>
            {starterCode === null && (
              <p className="text-sm text-[#ffd0a7]">
                This problem needs {language} starter code before it can run.
              </p>
            )}
            {!error && !results && (
              <p className="text-sm text-[#a9bfba]">
                Submit your solution to see the test results here.
              </p>
            )}
            {error && (
              <p className="mb-4 whitespace-pre-wrap break-words rounded-lg border border-[#714948] bg-[#493638] p-3 text-sm text-[#ffe0dc]">
                {error}
              </p>
            )}
            {results && (
              <div className="space-y-2">
                {results.map((test, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[#3c4e50] bg-[#29373b] p-3 text-sm"
                  >
                    <div
                      className={`flex items-center gap-2 font-semibold ${test.passed ? "text-[#8aebba]" : "text-[#ffaaa3]"}`}
                    >
                      {test.passed ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Case {index + 1} · {test.passed ? "Passed" : "Failed"}
                    </div>
                    {!test.passed && (
                      <div className="mt-3 grid gap-2 text-[#d5e2dd] sm:grid-cols-2">
                        <p className="min-w-0 break-words">
                          <span className="block text-xs text-[#9eb9b2]">
                            Input
                          </span>
                          <code>{JSON.stringify(test.input)}</code>
                        </p>
                        <p className="min-w-0 break-words">
                          <span className="block text-xs text-[#9eb9b2]">
                            Expected
                          </span>
                          <code>{JSON.stringify(test.expected)}</code>
                        </p>
                        <p className="min-w-0 break-words sm:col-span-2">
                          <span className="block text-xs text-[#9eb9b2]">
                            Received
                          </span>
                          <code>
                            {test.error ?? JSON.stringify(test.actual ?? null)}
                          </code>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {accountReady && lastPassed && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#405251] pt-4 text-sm">
                <div>
                  <p className="font-semibold text-[#9feabe]">
                    Last passed solution
                  </p>
                  <p className="text-xs text-[#a8bfba]">
                    {new Date(lastPassed.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateCode(lastPassed.code)}
                  className="rounded-md border border-[#5d8d77] px-3 py-1.5 font-semibold text-[#baf4cf] hover:bg-[#355b4b]"
                >
                  Restore code
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProblemsPage() {
  const [selectedSlug, setSelectedSlug] = useState(codingProblems[0].slug);
  const [language, setLanguage] = useState<CodingLanguage>("JavaScript");
  const [showWorkspace, setShowWorkspace] = useState(false);
  const problem =
    codingProblems.find((item) => item.slug === selectedSlug) ??
    codingProblems[0];
  const categoryOrder = [
    "Arrays & Hashing",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Binary Search",
    "Linked List",
    "Trees",
    "Heap / Priority Queue",
    "Backtracking",
    "Tries",
    "Graphs",
    "Advanced Graphs",
    "1-D Dynamic Programming",
    "2-D Dynamic Programming",
    "Dynamic Programming",
    "Greedy",
    "Intervals",
    "Math & Geometry",
    "Bit Manipulation",
    "Extra Practice",
  ];
  const categories = Array.from(new Set(codingProblems.map(sectionFor))).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b),
  );

  return (
    <main className="min-h-screen bg-[#eaf0ee] text-[#173a39]">
      <header className="border-b border-[#34494a] bg-[#18292c] text-[#f0f8f5]">
        <div className="mx-auto flex min-h-14 max-w-[1800px] flex-wrap items-center justify-between gap-3 px-4 py-2">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-bold tracking-tight hover:text-[#8aebba]"
          >
            <Code2 size={21} className="text-[#65d6a0]" /> CodingDolphin{" "}
            <span className="hidden border-l border-[#617573] pl-3 text-sm font-normal text-[#bacdc8] sm:inline">
              Practice
            </span>
          </a>
          <a
            href="/study"
            className="inline-flex items-center gap-1.5 text-sm text-[#c0d7cf] hover:text-white"
          >
            <ArrowLeft size={16} /> Study topics
          </a>
        </div>
      </header>
      <div className="mx-auto max-w-[1800px] px-3 pb-3">
        {!showWorkspace ? (
          <div className="mx-auto max-w-5xl py-8 sm:py-12">
            <section className={styles.setIntro}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#62d49b]">
                Practice collection
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Blind 75 Problem Set
              </h1>
              <p className="mt-4 text-sm text-[#b9cec8] sm:text-base">
                Choose a topic below, then open a problem to write and submit
                your solution.
              </p>
              <span className={styles.availableCount}>
                {
                  codingProblems.filter(
                    (item) => item.collection === "Blind 75",
                  ).length
                }{" "}
                Problems ·{" "}
                {
                  codingProblems.filter(
                    (item) => item.collection === "Extra Practice",
                  ).length
                }{" "}
                extra practice
              </span>
            </section>
            <div className="mt-8 space-y-2">
              {categories.map((category, index) => {
                const items = codingProblems.filter(
                  (item) => sectionFor(item) === category,
                );
                return (
                  <details
                    key={category}
                    className={styles.problemGroup}
                    open={index === 0}
                  >
                    <summary className={styles.groupSummary}>
                      <span className="flex items-center gap-3">
                        <span className={styles.chevron}>
                          <ArrowLeft size={15} />
                        </span>
                        {category}
                      </span>
                      <span className={styles.groupCount}>
                        {items.length}{" "}
                        {items.length === 1 ? "problem" : "problems"}
                      </span>
                    </summary>
                    <div className={styles.groupItems}>
                      {items.map((item) => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => {
                            setSelectedSlug(item.slug);
                            setShowWorkspace(true);
                            window.scrollTo({ top: 0, behavior: "auto" });
                          }}
                          className={styles.problemRow}
                        >
                          <span className="min-w-0 truncate font-medium">
                            {item.title}
                          </span>
                          <span
                            className={
                              item.difficulty === "Easy"
                                ? styles.easyBadge
                                : item.difficulty === "Hard"
                                  ? blindStyles.hardBadge
                                  : styles.mediumBadge
                            }
                          >
                            {item.difficulty}
                          </span>
                        </button>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowWorkspace(false)}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#195d59] hover:underline"
            >
              <ArrowLeft size={16} /> Blind 75 Problem Set
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3 py-3">
              <label
                className="flex min-w-0 items-center gap-2 text-sm font-medium text-[#526a68]"
                htmlFor="coding-problem"
              >
                Problem
                <select
                  id="coding-problem"
                  value={selectedSlug}
                  onChange={(event) => setSelectedSlug(event.target.value)}
                  className="min-h-9 min-w-0 max-w-[min(70vw,420px)] rounded-lg border border-[#cbdad5] bg-white px-3 py-1.5 font-semibold text-[#195d59] focus:outline-2 focus:outline-[#37c980]"
                >
                  {categories.map((category) => (
                    <optgroup key={category} label={category}>
                      {codingProblems
                        .filter((item) => sectionFor(item) === category)
                        .map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.title} · {item.difficulty}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <span className="hidden whitespace-nowrap text-xs text-[#738b85] sm:inline">
                  {codingProblems.length} problems
                </span>
              </label>
              <label
                className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#526a68]"
                htmlFor="coding-language"
              >
                Language
                <select
                  id="coding-language"
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value as CodingLanguage)
                  }
                  className="min-h-9 rounded-lg border border-[#cbdad5] bg-white px-3 py-1.5 font-semibold text-[#195d59] focus:outline-2 focus:outline-[#37c980]"
                >
                  {codingLanguages.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <ProblemWorkspace
              key={`${problem.slug}:${language}`}
              problem={problem}
              language={language}
            />
          </>
        )}
      </div>
    </main>
  );
}

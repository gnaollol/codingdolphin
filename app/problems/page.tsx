"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Code2, Lightbulb, Play, RotateCcw, XCircle } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import { codingProblems, type CodingProblem } from "@/lib/coding-problems";
import { runJavaScript, type TestResult } from "@/lib/run-javascript";

function ProblemWorkspace({ problem }: { problem: CodingProblem }) {
  const [code, setCode] = useState(problem.starterCode);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      setCode(localStorage.getItem(`coding-dolphin:draft:${problem.slug}`) ?? problem.starterCode);
    } catch {
      setCode(problem.starterCode);
    }
    setResults(null);
    setError("");
    setShowHint(false);
  }, [problem]);

  function updateCode(next: string) {
    setCode(next);
    setResults(null);
    setError("");
    try {
      localStorage.setItem(`coding-dolphin:draft:${problem.slug}`, next);
    } catch {
      // The editor still works when browser storage is unavailable.
    }
  }

  async function runTests() {
    if (running) return;
    setRunning(true);
    setResults(null);
    setError("");
    try {
      const outcome = await runJavaScript(code, problem);
      setResults(outcome.results);
      setError(outcome.error ?? "");
    } catch {
      setError("Could not run the tests. Please try again.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-[#dbe5e4] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-[#e5f4ed] px-3 py-1 font-medium text-[#286a50]">{problem.difficulty}</span>
          <span className="text-[#64767a]">{problem.category}</span>
        </div>
        <h2 className="text-2xl font-bold text-[#183b3a]">{problem.title}</h2>
        <p className="mt-4 leading-7 text-[#394e51]">{problem.prompt}</p>

        <h3 className="mt-8 font-semibold text-[#183b3a]">Examples</h3>
        <div className="mt-3 space-y-3">
          {problem.examples.map((example) => (
            <div key={example.input} className="rounded-xl bg-[#f5f8f7] p-4 text-sm">
              <p><strong>Input:</strong> <code className="break-words">{example.input}</code></p>
              <p className="mt-1"><strong>Output:</strong> <code>{example.output}</code></p>
              {example.explanation && <p className="mt-1 text-[#64767a]">{example.explanation}</p>}
            </div>
          ))}
        </div>

        <h3 className="mt-7 font-semibold text-[#183b3a]">Constraints</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#394e51]">
          {problem.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
        </ul>

        <button
          type="button"
          onClick={() => setShowHint((current) => !current)}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#195d59] hover:underline"
        >
          <Lightbulb size={17} /> {showHint ? "Hide hint" : "Show hint"}
        </button>
        {showHint && <p className="mt-3 rounded-xl bg-[#fff8e9] p-4 text-sm text-[#5b4d29]">{problem.hint}</p>}
      </section>

      <section className="min-w-0 rounded-2xl border border-[#dbe5e4] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#183b3a]">Your solution</h2>
            <p className="text-sm text-[#64767a]">JavaScript · Your draft saves in this browser</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset this solution to the starter code?")) updateCode(problem.starterCode);
            }}
            className="inline-flex items-center gap-1 text-sm text-[#195d59] hover:underline"
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#dbe5e4]">
          <CodeMirror
            value={code}
            height="330px"
            extensions={[javascript()]}
            onChange={updateCode}
            theme="light"
            basicSetup={{ lineNumbers: true, foldGutter: true }}
            aria-label="JavaScript solution editor"
          />
        </div>
        <button
          type="button"
          onClick={runTests}
          disabled={running}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#195d59] px-5 py-2.5 font-semibold text-white hover:bg-[#134945] disabled:opacity-60"
        >
          <Play size={17} /> {running ? "Running…" : "Run tests"}
        </button>

        {(error || results) && (
          <div className="mt-6" aria-live="polite">
            <h3 className="font-semibold text-[#183b3a]">Results</h3>
            {error && <p className="mt-2 rounded-xl bg-[#fff1ef] p-3 text-sm text-[#9c352c]">{error}</p>}
            {results && (
              <>
                <p className="mt-2 text-sm text-[#64767a]">
                  {results.filter((test) => test.passed).length} / {results.length} tests passed
                </p>
                <div className="mt-3 space-y-2">
                  {results.map((test, index) => (
                    <div key={index} className="rounded-xl border border-[#e2e9e8] p-3 text-sm">
                      <div className={`flex items-center gap-2 font-medium ${test.passed ? "text-[#286a50]" : "text-[#a33f35]"}`}>
                        {test.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        Test {index + 1}: {test.passed ? "Passed" : "Failed"}
                      </div>
                      {!test.passed && (
                        <div className="mt-2 space-y-1 break-all text-[#394e51]">
                          <p>Input: {JSON.stringify(test.input)}</p>
                          <p>Expected: {JSON.stringify(test.expected)}</p>
                          <p>Received: {test.error ?? JSON.stringify(test.actual ?? null)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ProblemsPage() {
  const [selectedSlug, setSelectedSlug] = useState(codingProblems[0].slug);
  const problem = codingProblems.find((item) => item.slug === selectedSlug) ?? codingProblems[0];

  return (
    <main className="min-h-screen bg-[#f5f7f7] px-4 py-8 text-[#183b3a] sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-[#195d59] hover:underline">
            <Code2 size={21} /> CodingDolphin
          </Link>
          <Link href="/study" className="inline-flex items-center gap-1 text-sm text-[#195d59] hover:underline">
            <ArrowLeft size={16} /> Study topics
          </Link>
        </div>
        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#195d59]">Practice</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Coding problems</h1>
          <p className="mt-3 text-[#64767a]">Choose a problem, write a solution, and run the test cases.</p>
        </div>

        <div className="my-6 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Choose a coding problem">
          {codingProblems.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSelectedSlug(item.slug)}
              aria-pressed={selectedSlug === item.slug}
              className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${selectedSlug === item.slug ? "border-[#195d59] bg-[#195d59] text-white" : "border-[#dbe5e4] bg-white text-[#195d59] hover:border-[#195d59]"}`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <ProblemWorkspace key={problem.slug} problem={problem} />
      </div>
    </main>
  );
}

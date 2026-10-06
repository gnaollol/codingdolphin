import type { CodingProblem } from "./coding-problems";
import { compareResults } from "./coding-compare";

export type TestResult = {
  input: unknown[];
  expected: unknown;
  actual?: unknown;
  passed: boolean;
  error?: string;
};

// The iframe has an opaque origin and a restrictive CSP. User code never runs
// inside the application's own JavaScript context or in a Cloudflare Worker.
const runnerDocument = `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; connect-src 'none'; form-action 'none'; base-uri 'none'"></head><body><script>
window.addEventListener('message', function(event) {
  if (event.source !== parent || event.data?.kind !== 'run-tests') return;
  const { nonce, code, functionName, tests, comparison } = event.data;
  const results = [];
  const compare = ${compareResults.toString()};
  try {
    const suffix = functionName === 'codecRoundTrip' ? '\\nreturn function(strs) { return decode(encode(strs)); };' : functionName === 'treeCodecRoundTrip' ? '\\nreturn function(root) { return deserialize(serialize(root)); };' : '\\nreturn ' + functionName + ';';
    const solve = new Function(code + suffix)();
    if (typeof solve !== 'function') throw new Error('Define a function named ' + functionName + '.');
    for (const test of tests) {
      try {
        const args = JSON.parse(JSON.stringify(test.args));
        const actual = solve(...args);
        if (functionName === 'cloneGraph' && (actual === args[0] || actual.some(row => args[0].some(original => row === original)))) throw new Error('Return an independent copy of every adjacency row.');
        const passed = compare(actual, test.expected, comparison, test.args);
        results.push({ input: test.args, expected: test.expected, actual, passed });
      } catch (error) {
        results.push({ input: test.args, expected: test.expected, passed: false, error: String(error) });
      }
    }
    parent.postMessage({ kind: 'test-results', nonce, results }, '*');
  } catch (error) {
    parent.postMessage({ kind: 'test-results', nonce, error: String(error), results }, '*');
  }
});
</script></body></html>`;

export function runJavaScript(
  code: string,
  problem: CodingProblem,
): Promise<{ results: TestResult[]; error?: string }> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.display = "none";
    const nonce = crypto.randomUUID();
    let finished = false;

    function finish(value: { results: TestResult[]; error?: string }) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      iframe.remove();
      resolve(value);
    }

    function onMessage(event: MessageEvent) {
      if (event.source !== iframe.contentWindow || event.origin !== "null")
        return;
      if (event.data?.kind !== "test-results" || event.data.nonce !== nonce)
        return;
      finish({ results: event.data.results, error: event.data.error });
    }

    const timer = window.setTimeout(
      () =>
        finish({
          results: [],
          error: "Time limit exceeded (3 seconds). Check for an infinite loop.",
        }),
      3000,
    );
    window.addEventListener("message", onMessage);
    iframe.addEventListener("load", () => {
      iframe.contentWindow?.postMessage(
        {
          kind: "run-tests",
          nonce,
          code,
          functionName: problem.functionName,
          tests: problem.tests,
          comparison: problem.comparison,
        },
        "*",
      );
    });
    iframe.srcdoc = runnerDocument;
    document.body.appendChild(iframe);
  });
}

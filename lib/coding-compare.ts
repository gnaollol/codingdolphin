// Self-contained so the same checker can run inside the sandboxed JS iframe.
export function compareResults(
  actual: unknown,
  expected: unknown,
  mode = "exact",
  args: unknown[] = [],
): boolean {
  function equal(a: unknown, b: unknown): boolean {
    if (typeof a === "number" && typeof b === "number")
      return Number.isFinite(a) && Math.abs(a - b) <= 1e-9;
    if (Array.isArray(a) && Array.isArray(b))
      return a.length === b.length && a.every((v, i) => equal(v, b[i]));
    return a === b;
  }
  const sort = (values: unknown[]) =>
    [...values].sort((a, b) =>
      JSON.stringify(a).localeCompare(JSON.stringify(b)),
    );
  if (mode === "palindrome") {
    return (
      typeof actual === "string" &&
      typeof expected === "string" &&
      typeof args[0] === "string" &&
      actual.length === expected.length &&
      args[0].includes(actual) &&
      actual === [...actual].reverse().join("")
    );
  }
  if (mode === "alien") {
    if (typeof actual !== "string" || typeof expected !== "string")
      return false;
    if (expected === "") return actual === "";
    const words = args[0] as string[];
    const chars = new Set(words.join(""));
    if (
      actual.length !== chars.size ||
      new Set(actual).size !== chars.size ||
      [...actual].some((c) => !chars.has(c))
    )
      return false;
    for (let i = 1; i < words.length; i++) {
      const a = words[i - 1],
        b = words[i];
      let j = 0;
      while (j < a.length && j < b.length && a[j] === b[j]) j++;
      if (j === b.length && a.length > b.length) return false;
      if (
        j < a.length &&
        j < b.length &&
        actual.indexOf(a[j]) >= actual.indexOf(b[j])
      )
        return false;
    }
    return true;
  }
  if (mode === "tree") {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
    const trim = (a: unknown[]) => {
      const result = [...a];
      while (result.length && result[result.length - 1] === null) result.pop();
      return result;
    };
    return equal(trim(actual), trim(expected));
  }
  if (["unordered", "unorderedNested", "rowsUnordered"].includes(mode)) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
    let a: unknown[] = actual,
      b: unknown[] = expected;
    if (mode !== "unordered") {
      if (!a.every(Array.isArray) || !b.every(Array.isArray)) return false;
      a = a.map((row) => sort(row as unknown[]));
      b = b.map((row) => sort(row as unknown[]));
    }
    if (mode !== "rowsUnordered") {
      a = sort(a);
      b = sort(b);
    }
    return equal(a, b);
  }
  return equal(actual, expected);
}

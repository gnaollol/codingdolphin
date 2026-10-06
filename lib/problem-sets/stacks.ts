import type { ProblemDefinition } from "../coding-types";

// Stack
export const stackProblems: ProblemDefinition[] = [
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    prompt:
      "Given a string containing only (), {}, and [], return true if every opening bracket is closed by the same type in the correct order. An empty string is valid.",
    examples: [
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "([)]"',
        output: "false",
        explanation: "The brackets cross rather than nest.",
      },
    ],
    constraints: [
      "0 ≤ s.length ≤ 10,000",
      "The input contains only bracket characters.",
    ],
    hint: "A stack can remember the most recent unmatched opening bracket.",
    functionName: "isValid",
    starterCode: "function isValid(s) {\n  // Return true or false.\n  \n}",
    tests: [
      {
        args: ["()[]{}"],
        expected: true,
      },
      {
        args: ["([)]"],
        expected: false,
      },
      {
        args: ["{[]}"],
        expected: true,
      },
      {
        args: ["("],
        expected: false,
      },
      {
        args: [""],
        expected: true,
      },
    ],
    collection: "Blind 75",
  },
];

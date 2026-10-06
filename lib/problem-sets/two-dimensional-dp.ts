import type { ProblemDefinition } from "../coding-types";

// 2-D Dynamic Programming
export const twoDimensionalDpProblems: ProblemDefinition[] = [
  {
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    category: "2-D Dynamic Programming",
    functionName: "uniquePaths",
    signature: {
      parameters: [
        ["m", "int"],
        ["n", "int"],
      ],
      returns: "int",
    },
    prompt:
      "In an m-by-n grid, move only right or down from the upper-left cell to the lower-right cell. Return the number of possible routes.",
    hint: "Each cell can be reached from above or from its left neighbor.",
    constraints: ["1 ≤ m,n ≤ 12", "Answers fit in 32-bit signed integers."],
    tests: [
      {
        args: [3, 7],
        expected: 28,
      },
      {
        args: [3, 2],
        expected: 3,
      },
      {
        args: [1, 1],
        expected: 1,
      },
      {
        args: [4, 4],
        expected: 20,
      },
    ],
    examples: [
      {
        input: "m = 3, n = 7",
        output: "28",
      },
      {
        input: "m = 3, n = 2",
        output: "3",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    category: "2-D Dynamic Programming",
    functionName: "longestCommonSubsequence",
    signature: {
      parameters: [
        ["text1", "string"],
        ["text2", "string"],
      ],
      returns: "int",
    },
    prompt:
      "Find the length of a longest sequence of characters occurring in both strings in the same order, without requiring adjacency.",
    tests: [
      {
        args: ["abcde", "ace"],
        expected: 3,
      },
      {
        args: ["abc", "abc"],
        expected: 3,
      },
      {
        args: ["abc", "def"],
        expected: 0,
      },
      {
        args: ["", "a"],
        expected: 0,
      },
    ],
    hint: "What choices remain when the current characters differ?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 'text1 = "abcde", text2 = "ace"',
        output: "3",
      },
      {
        input: 'text1 = "abc", text2 = "abc"',
        output: "3",
      },
    ],
    collection: "Blind 75",
  },
];

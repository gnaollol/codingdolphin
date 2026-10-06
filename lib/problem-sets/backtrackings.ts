import type { ProblemDefinition } from "../coding-types";

// Backtracking
export const backtrackingProblems: ProblemDefinition[] = [
  {
    slug: "combination-sum",
    title: "Combination Sum",
    category: "Backtracking",
    functionName: "combinationSum",
    signature: {
      parameters: [
        ["candidates", "int[]"],
        ["target", "int"],
      ],
      returns: "int[][]",
    },
    prompt:
      "Candidates are distinct positive integers. Return every unique multiset that sums to target; a candidate may be reused. Result and combination order do not matter.",
    tests: [
      {
        args: [[2, 3, 6, 7], 7],
        expected: [[2, 2, 3], [7]],
      },
      {
        args: [[2, 3, 5], 8],
        expected: [
          [2, 2, 2, 2],
          [2, 3, 3],
          [3, 5],
        ],
      },
      {
        args: [[2], 1],
        expected: [],
      },
      {
        args: [[1], 2],
        expected: [[1, 1]],
      },
    ],
    hint: "Choose candidates in a consistent order to avoid duplicate combinations.",
    difficulty: "Medium",
    comparison: "unorderedNested",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "candidates = [2, 3, 6, 7], target = 7",
        output: "[[2, 2, 3], [7]]",
      },
      {
        input: "candidates = [2, 3, 5], target = 8",
        output: "[[2, 2, 2, 2], [2, 3, 3], [3, 5]]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "word-search",
    title: "Word Search",
    category: "Backtracking",
    functionName: "exist",
    signature: {
      parameters: [
        ["board", "string[]"],
        ["word", "string"],
      ],
      returns: "bool",
    },
    prompt:
      "The board is an array of equal-length strings, one per row. Move horizontally or vertically; a cell cannot be used twice within one word. Return whether word can be traced on the board. word is nonempty.",
    tests: [
      {
        args: [["ABCE", "SFCS", "ADEE"], "ABCCED"],
        expected: true,
      },
      {
        args: [["ABCE", "SFCS", "ADEE"], "ABCB"],
        expected: false,
      },
      {
        args: [["a"], "a"],
        expected: true,
      },
      {
        args: [["a"], "aa"],
        expected: false,
      },
    ],
    hint: "Remember which cells belong to the current path.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 'board = ["ABCE", "SFCS", "ADEE"], word = "ABCCED"',
        output: "true",
      },
      {
        input: 'board = ["ABCE", "SFCS", "ADEE"], word = "ABCB"',
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
];

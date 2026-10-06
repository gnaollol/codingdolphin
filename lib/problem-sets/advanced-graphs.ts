import type { ProblemDefinition } from "../coding-types";

// Advanced Graphs
export const advancedGraphsProblems: ProblemDefinition[] = [
  {
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    category: "Advanced Graphs",
    functionName: "alienOrder",
    signature: {
      parameters: [["words", "string[]"]],
      returns: "string",
    },
    prompt:
      "The lowercase words are sorted according to an unknown alphabet. Return an ordering containing every observed letter exactly once and consistent with the words. Return an empty string if impossible. Any valid ordering is accepted.",
    tests: [
      {
        args: [["wrt", "wrf", "er", "ett", "rftt"]],
        expected: "wertf",
      },
      {
        args: [["z", "x"]],
        expected: "zx",
      },
      {
        args: [["z", "x", "z"]],
        expected: "",
      },
      {
        args: [["abc", "ab"]],
        expected: "",
      },
      {
        args: [["ab", "ac"]],
        expected: "abc",
      },
    ],
    hint: "Only the first differing letters of neighboring words establish a relation.",
    difficulty: "Hard",
    comparison: "alien",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 'words = ["wrt", "wrf", "er", "ett", "rftt"]',
        output: '"wertf"',
      },
      {
        input: 'words = ["z", "x"]',
        output: '"zx"',
      },
    ],
    collection: "Blind 75",
  },
];

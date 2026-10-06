import type { ProblemDefinition } from "../coding-types";

// Greedy
export const greedyProblems: ProblemDefinition[] = [
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Greedy",
    functionName: "maxSubArray",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "Return the greatest sum obtainable from a nonempty contiguous segment of the array.",
    hint: "At each position, choose whether to extend the previous segment or start a new one.",
    constraints: ["1 ≤ nums.length ≤ 100,000"],
    tests: [
      {
        args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
        expected: 6,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[-3, -2, -5]],
        expected: -2,
      },
      {
        args: [[5, -1, 5]],
        expected: 9,
      },
    ],
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
      },
      {
        input: "nums = [1]",
        output: "1",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Greedy",
    functionName: "canJump",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "bool",
    },
    prompt:
      "Each array value gives the maximum forward jump length from that position. Decide whether the final index can be reached from index 0.",
    hint: "Keep track of the farthest position reachable so far.",
    constraints: ["1 ≤ nums.length ≤ 100,000", "Values are nonnegative."],
    tests: [
      {
        args: [[2, 3, 1, 1, 4]],
        expected: true,
      },
      {
        args: [[3, 2, 1, 0, 4]],
        expected: false,
      },
      {
        args: [[0]],
        expected: true,
      },
      {
        args: [[2, 0, 0]],
        expected: true,
      },
    ],
    examples: [
      {
        input: "nums = [2, 3, 1, 1, 4]",
        output: "true",
      },
      {
        input: "nums = [3, 2, 1, 0, 4]",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
];

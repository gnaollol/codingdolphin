import type { ProblemDefinition } from "../coding-types";

// Extra Practice
export const extraPracticeProblems: ProblemDefinition[] = [
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Extra Practice",
    prompt:
      "Given an array of unique integers sorted in ascending order, return the index of target. Return -1 if target is not present. Aim for O(log n) time.",
    examples: [
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        output: "4",
      },
      {
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        output: "-1",
      },
    ],
    constraints: ["0 ≤ nums.length ≤ 10,000", "Values are unique and sorted."],
    hint: "Compare the middle value with target, then discard half of the remaining range.",
    functionName: "binarySearch",
    starterCode:
      "function binarySearch(nums, target) {\n  // Return the index or -1.\n  \n}",
    tests: [
      {
        args: [[-1, 0, 3, 5, 9, 12], 9],
        expected: 4,
      },
      {
        args: [[-1, 0, 3, 5, 9, 12], 2],
        expected: -1,
      },
      {
        args: [[], 2],
        expected: -1,
      },
      {
        args: [[5], 5],
        expected: 0,
      },
      {
        args: [[1, 3, 5, 7, 9], 1],
        expected: 0,
      },
    ],
    collection: "Extra Practice",
  },
  {
    slug: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    category: "Extra Practice",
    functionName: "singleNumber",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "Every integer appears exactly twice except one. Return the value that appears once.",
    hint: "A number XORed with itself disappears.",
    constraints: ["1 ≤ nums.length ≤ 100,001"],
    tests: [
      {
        args: [[2, 2, 1]],
        expected: 1,
      },
      {
        args: [[4, 1, 2, 1, 2]],
        expected: 4,
      },
      {
        args: [[-7]],
        expected: -7,
      },
      {
        args: [[0, -3, 0]],
        expected: -3,
      },
    ],
    examples: [
      {
        input: "nums = [2, 2, 1]",
        output: "1",
      },
      {
        input: "nums = [4, 1, 2, 1, 2]",
        output: "4",
      },
    ],
    collection: "Extra Practice",
  },
];

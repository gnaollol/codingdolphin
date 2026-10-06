import type { ProblemDefinition } from "../coding-types";

// Binary Search
export const binarySearchProblems: ProblemDefinition[] = [
  {
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    functionName: "findMin",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "A strictly increasing array was rotated some number of times. Return its smallest value.",
    hint: "Use the sorted right half to decide where the minimum may lie.",
    constraints: ["1 ≤ nums.length ≤ 100,000", "Values are unique."],
    tests: [
      {
        args: [[3, 4, 5, 1, 2]],
        expected: 1,
      },
      {
        args: [[4, 5, 6, 7, 0, 1, 2]],
        expected: 0,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[1, 2, 3]],
        expected: 1,
      },
    ],
    examples: [
      {
        input: "nums = [3, 4, 5, 1, 2]",
        output: "1",
      },
      {
        input: "nums = [4, 5, 6, 7, 0, 1, 2]",
        output: "0",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    functionName: "searchRotated",
    signature: {
      parameters: [
        ["nums", "int[]"],
        ["target", "int"],
      ],
      returns: "int",
    },
    prompt:
      "Find a target in a rotated, strictly increasing array. Return its index or -1 when absent.",
    hint: "One side of the midpoint is always sorted; check whether the target is on that side.",
    constraints: ["0 ≤ nums.length ≤ 100,000", "Values are unique."],
    tests: [
      {
        args: [[4, 5, 6, 7, 0, 1, 2], 0],
        expected: 4,
      },
      {
        args: [[4, 5, 6, 7, 0, 1, 2], 3],
        expected: -1,
      },
      {
        args: [[], 5],
        expected: -1,
      },
      {
        args: [[1], 1],
        expected: 0,
      },
    ],
    examples: [
      {
        input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
        output: "4",
      },
      {
        input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
        output: "-1",
      },
    ],
    collection: "Blind 75",
  },
];

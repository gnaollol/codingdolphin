import type { ProblemDefinition } from "../coding-types";

// Heap / Priority Queue
export const heapProblems: ProblemDefinition[] = [
  {
    slug: "find-median-from-data-stream",
    title: "Find Median From Data Stream",
    category: "Heap / Priority Queue",
    functionName: "runningMedians",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "double[]",
    },
    prompt:
      "Process numbers in input order. After each insertion, return the median of all numbers seen so far. Return one median per insertion. Aim for logarithmic insertion time.",
    tests: [
      {
        args: [[1, 2, 3]],
        expected: [1, 1.5, 2],
      },
      {
        args: [[-1, -2, -3]],
        expected: [-1, -1.5, -2],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[5, 5, 1, 9]],
        expected: [5, 5, 5, 5],
      },
    ],
    hint: "Can two heaps keep the lower and upper halves balanced?",
    difficulty: "Hard",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "nums = [1, 2, 3]",
        output: "[1, 1.5, 2]",
      },
      {
        input: "nums = [-1, -2, -3]",
        output: "[-1, -1.5, -2]",
      },
    ],
    collection: "Blind 75",
  },
];

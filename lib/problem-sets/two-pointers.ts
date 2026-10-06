import type { ProblemDefinition } from "../coding-types";

// Two Pointers
export const twoPointersProblems: ProblemDefinition[] = [
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    functionName: "maxArea",
    signature: {
      parameters: [["height", "int[]"]],
      returns: "int",
    },
    prompt:
      "Each array value is the height of a vertical line at that index. Pick two lines that hold the most water and return that area.",
    hint: "Move the pointer at the shorter line inward.",
    constraints: ["2 ≤ height.length ≤ 100,000", "Heights are nonnegative."],
    tests: [
      {
        args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
        expected: 49,
      },
      {
        args: [[1, 1]],
        expected: 1,
      },
      {
        args: [[4, 3, 2, 1, 4]],
        expected: 16,
      },
      {
        args: [[0, 2, 0, 3]],
        expected: 4,
      },
    ],
    examples: [
      {
        input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        output: "49",
      },
      {
        input: "height = [1, 1]",
        output: "1",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Two Pointers",
    functionName: "isPalindrome",
    signature: {
      parameters: [["s", "string"]],
      returns: "bool",
    },
    prompt:
      "Ignore punctuation and letter case, then decide whether the remaining letters and digits read the same forward and backward.",
    hint: "Walk inward from both ends, skipping characters that are not letters or digits.",
    constraints: ["0 ≤ s.length ≤ 100,000", "Input uses ASCII characters."],
    tests: [
      {
        args: ["A man, a plan, a canal: Panama"],
        expected: true,
      },
      {
        args: ["race a car"],
        expected: false,
      },
      {
        args: [" "],
        expected: true,
      },
      {
        args: ["0P"],
        expected: false,
      },
    ],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
      },
      {
        input: 's = "race a car"',
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "3sum",
    title: "3Sum",
    category: "Two Pointers",
    functionName: "threeSum",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int[][]",
    },
    prompt:
      "Return all distinct triples of values adding to zero. Each triple must use three different positions. Triple order and result order do not matter.",
    tests: [
      {
        args: [[-1, 0, 1, 2, -1, -4]],
        expected: [
          [-1, -1, 2],
          [-1, 0, 1],
        ],
      },
      {
        args: [[0, 0, 0, 0]],
        expected: [[0, 0, 0]],
      },
      {
        args: [[1, 2, -2, -1]],
        expected: [],
      },
      {
        args: [[-2, 0, 0, 2, 2]],
        expected: [[-2, 0, 2]],
      },
    ],
    hint: "What changes if you first sort the values?",
    difficulty: "Medium",
    comparison: "unorderedNested",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "nums = [-1, 0, 1, 2, -1, -4]",
        output: "[[-1, -1, 2], [-1, 0, 1]]",
      },
      {
        input: "nums = [0, 0, 0, 0]",
        output: "[[0, 0, 0]]",
      },
    ],
    collection: "Blind 75",
  },
];

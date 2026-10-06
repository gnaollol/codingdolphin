import type { ProblemDefinition } from "../coding-types";

// Bit Manipulation
export const bitManipulationProblems: ProblemDefinition[] = [
  {
    slug: "counting-bits",
    title: "Counting Bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    functionName: "countBits",
    signature: {
      parameters: [["n", "int"]],
      returns: "int[]",
    },
    prompt:
      "Return an array where position i contains the number of set bits in i, for every integer from 0 through n.",
    hint: "Removing the lowest set bit gives a smaller value whose count is already known.",
    constraints: ["0 ≤ n ≤ 100,000"],
    tests: [
      {
        args: [0],
        expected: [0],
      },
      {
        args: [2],
        expected: [0, 1, 1],
      },
      {
        args: [5],
        expected: [0, 1, 1, 2, 1, 2],
      },
      {
        args: [8],
        expected: [0, 1, 1, 2, 1, 2, 2, 3, 1],
      },
    ],
    examples: [
      {
        input: "n = 0",
        output: "[0]",
      },
      {
        input: "n = 2",
        output: "[0, 1, 1]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    category: "Bit Manipulation",
    functionName: "missingNumber",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "An array holds every distinct number from 0 through n except one. Return the missing number.",
    hint: "The expected sum or XOR of 0 through n can reveal what is absent.",
    constraints: ["0 ≤ nums.length ≤ 100,000"],
    tests: [
      {
        args: [[3, 0, 1]],
        expected: 2,
      },
      {
        args: [[0, 1]],
        expected: 2,
      },
      {
        args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]],
        expected: 8,
      },
      {
        args: [[]],
        expected: 0,
      },
    ],
    examples: [
      {
        input: "nums = [3, 0, 1]",
        output: "2",
      },
      {
        input: "nums = [0, 1]",
        output: "2",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    category: "Bit Manipulation",
    functionName: "hammingWeight",
    signature: {
      parameters: [["n", "int"]],
      returns: "int",
    },
    prompt:
      "Count the set bits in the nonnegative integer n. Inputs are at most 2^31-1.",
    tests: [
      {
        args: [11],
        expected: 3,
      },
      {
        args: [128],
        expected: 1,
      },
      {
        args: [0],
        expected: 0,
      },
      {
        args: [2147483647],
        expected: 31,
      },
    ],
    hint: "Clearing the lowest set bit removes one 1 at a time.",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "n = 11",
        output: "3",
      },
      {
        input: "n = 128",
        output: "1",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "reverse-bits",
    title: "Reverse Bits",
    category: "Bit Manipulation",
    functionName: "reverseBits",
    signature: {
      parameters: [["n", "int"]],
      returns: "double",
    },
    prompt:
      "Reverse all 32 bits of a nonnegative integer n (at most 2^31-1). Return the unsigned result as a number; double is used in compiled-language starters to hold values above signed int range.",
    tests: [
      {
        args: [43261596],
        expected: 964176192,
      },
      {
        args: [1],
        expected: 2147483648,
      },
      {
        args: [0],
        expected: 0,
      },
      {
        args: [2147483647],
        expected: 4294967294,
      },
    ],
    hint: "Leading zeroes are part of the 32-bit representation.",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "n = 43261596",
        output: "964176192",
      },
      {
        input: "n = 1",
        output: "2147483648",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "sum-of-two-integers",
    title: "Sum of Two Integers",
    category: "Bit Manipulation",
    functionName: "getSum",
    signature: {
      parameters: [
        ["a", "int"],
        ["b", "int"],
      ],
      returns: "int",
    },
    prompt:
      "Return the sum of a and b without using addition or subtraction operators. Both inputs lie between -1000 and 1000; the tests check the result, not the operators used.",
    tests: [
      {
        args: [1, 2],
        expected: 3,
      },
      {
        args: [-2, 3],
        expected: 1,
      },
      {
        args: [-5, -7],
        expected: -12,
      },
      {
        args: [0, 0],
        expected: 0,
      },
    ],
    hint: "Separate addition without carry from the carry bits.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "a = 1, b = 2",
        output: "3",
      },
      {
        input: "a = -2, b = 3",
        output: "1",
      },
    ],
    collection: "Blind 75",
  },
];

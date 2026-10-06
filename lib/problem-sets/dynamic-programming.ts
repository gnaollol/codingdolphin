import type { ProblemDefinition } from "../coding-types";

// 1-D Dynamic Programming
export const dynamicProgrammingProblems: ProblemDefinition[] = [
  {
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "1-D Dynamic Programming",
    functionName: "maxProduct",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "Return the largest product among all nonempty contiguous segments of the array. Test values keep intermediate results in 32-bit range.",
    hint: "A negative number swaps the roles of the current smallest and largest products.",
    constraints: [
      "1 ≤ nums.length ≤ 100,000",
      "Products fit in 32-bit signed integers.",
    ],
    tests: [
      {
        args: [[2, 3, -2, 4]],
        expected: 6,
      },
      {
        args: [[-2, 0, -1]],
        expected: 0,
      },
      {
        args: [[-2, 3, -4]],
        expected: 24,
      },
      {
        args: [[-1]],
        expected: -1,
      },
    ],
    examples: [
      {
        input: "nums = [2, 3, -2, 4]",
        output: "6",
      },
      {
        input: "nums = [-2, 0, -1]",
        output: "0",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "1-D Dynamic Programming",
    functionName: "climbStairs",
    signature: {
      parameters: [["n", "int"]],
      returns: "int",
    },
    prompt:
      "Count the different sequences of one-step and two-step moves that reach exactly stair n.",
    hint: "The last move came from either one or two stairs below.",
    constraints: ["1 ≤ n ≤ 45"],
    tests: [
      {
        args: [1],
        expected: 1,
      },
      {
        args: [2],
        expected: 2,
      },
      {
        args: [3],
        expected: 3,
      },
      {
        args: [5],
        expected: 8,
      },
      {
        args: [10],
        expected: 89,
      },
    ],
    examples: [
      {
        input: "n = 1",
        output: "1",
      },
      {
        input: "n = 2",
        output: "2",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    category: "1-D Dynamic Programming",
    functionName: "rob",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "Choose house values for the largest total, but never choose two adjacent houses. You may choose none.",
    hint: "At each house compare skipping it with taking it plus the best total two houses back.",
    constraints: ["0 ≤ nums.length ≤ 100,000", "House values are nonnegative."],
    tests: [
      {
        args: [[1, 2, 3, 1]],
        expected: 4,
      },
      {
        args: [[2, 7, 9, 3, 1]],
        expected: 12,
      },
      {
        args: [[]],
        expected: 0,
      },
      {
        args: [[5]],
        expected: 5,
      },
    ],
    examples: [
      {
        input: "nums = [1, 2, 3, 1]",
        output: "4",
      },
      {
        input: "nums = [2, 7, 9, 3, 1]",
        output: "12",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "1-D Dynamic Programming",
    functionName: "coinChange",
    signature: {
      parameters: [
        ["coins", "int[]"],
        ["amount", "int"],
      ],
      returns: "int",
    },
    prompt:
      "Given unlimited copies of each positive coin value, return the fewest coins needed to make amount. Return -1 if impossible.",
    hint: "For each amount, try ending with each available coin.",
    constraints: ["1 ≤ coins.length ≤ 100", "0 ≤ amount ≤ 10,000"],
    tests: [
      {
        args: [[1, 2, 5], 11],
        expected: 3,
      },
      {
        args: [[2], 3],
        expected: -1,
      },
      {
        args: [[1], 0],
        expected: 0,
      },
      {
        args: [[2, 5, 10, 1], 27],
        expected: 4,
      },
    ],
    examples: [
      {
        input: "coins = [1, 2, 5], amount = 11",
        output: "3",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "1-D Dynamic Programming",
    functionName: "lengthOfLIS",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "Return the length of the longest strictly increasing subsequence. Selected values keep their original order but need not be adjacent.",
    hint: "Track the smallest ending value possible for a subsequence of each length.",
    constraints: ["0 ≤ nums.length ≤ 2,500"],
    tests: [
      {
        args: [[10, 9, 2, 5, 3, 7, 101, 18]],
        expected: 4,
      },
      {
        args: [[0, 1, 0, 3, 2, 3]],
        expected: 4,
      },
      {
        args: [[7, 7, 7, 7]],
        expected: 1,
      },
      {
        args: [[]],
        expected: 0,
      },
    ],
    examples: [
      {
        input: "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
        output: "4",
      },
      {
        input: "nums = [0, 1, 0, 3, 2, 3]",
        output: "4",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "house-robber-ii",
    title: "House Robber II",
    category: "1-D Dynamic Programming",
    functionName: "robCircular",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "Houses form a circle, so the first and last are neighbors. Return the maximum sum of nonnegative values you can take without selecting neighboring houses.",
    tests: [
      {
        args: [[2, 3, 2]],
        expected: 3,
      },
      {
        args: [[1, 2, 3, 1]],
        expected: 4,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[]],
        expected: 0,
      },
    ],
    hint: "Consider separately excluding the first house and excluding the last house.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "nums = [2, 3, 2]",
        output: "3",
      },
      {
        input: "nums = [1, 2, 3, 1]",
        output: "4",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    category: "1-D Dynamic Programming",
    functionName: "longestPalindrome",
    signature: {
      parameters: [["s", "string"]],
      returns: "string",
    },
    prompt:
      "Return a longest contiguous palindrome in s. Any longest palindrome is accepted. An empty input returns an empty string.",
    tests: [
      {
        args: ["babad"],
        expected: "bab",
      },
      {
        args: ["cbbd"],
        expected: "bb",
      },
      {
        args: [""],
        expected: "",
      },
      {
        args: ["a"],
        expected: "a",
      },
      {
        args: ["ac"],
        expected: "a",
      },
    ],
    hint: "A palindrome expands outward from a center.",
    difficulty: "Medium",
    comparison: "palindrome",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "palindromic-substrings",
    title: "Palindromic Substrings",
    category: "1-D Dynamic Programming",
    functionName: "countSubstrings",
    signature: {
      parameters: [["s", "string"]],
      returns: "int",
    },
    prompt:
      "Count palindromic contiguous substrings by position, including single letters and repeated equal strings at different positions.",
    tests: [
      {
        args: ["abc"],
        expected: 3,
      },
      {
        args: ["aaa"],
        expected: 6,
      },
      {
        args: [""],
        expected: 0,
      },
      {
        args: ["abba"],
        expected: 6,
      },
    ],
    hint: "Remember both odd and even length centers.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 's = "abc"',
        output: "3",
      },
      {
        input: 's = "aaa"',
        output: "6",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "decode-ways",
    title: "Decode Ways",
    category: "1-D Dynamic Programming",
    functionName: "numDecodings",
    signature: {
      parameters: [["s", "string"]],
      returns: "int",
    },
    prompt:
      "Digits 1 through 26 map to letters A through Z. Count ways to split a nonempty digit string into valid codes. Codes cannot start with 0, and standalone 0 is invalid.",
    tests: [
      {
        args: ["12"],
        expected: 2,
      },
      {
        args: ["226"],
        expected: 3,
      },
      {
        args: ["06"],
        expected: 0,
      },
      {
        args: ["2101"],
        expected: 1,
      },
      {
        args: ["11106"],
        expected: 2,
      },
    ],
    hint: "At each position, which one-digit and two-digit choices are valid?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 's = "12"',
        output: "2",
      },
      {
        input: 's = "226"',
        output: "3",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "word-break",
    title: "Word Break",
    category: "1-D Dynamic Programming",
    functionName: "wordBreak",
    signature: {
      parameters: [
        ["s", "string"],
        ["wordDict", "string[]"],
      ],
      returns: "bool",
    },
    prompt:
      "Return whether s can be split into a sequence of dictionary words. Words are nonempty and may be reused. An empty s is segmentable.",
    tests: [
      {
        args: ["leetcode", ["leet", "code"]],
        expected: true,
      },
      {
        args: ["applepenapple", ["apple", "pen"]],
        expected: true,
      },
      {
        args: ["catsandog", ["cats", "dog", "sand", "and", "cat"]],
        expected: false,
      },
      {
        args: ["", []],
        expected: true,
      },
    ],
    hint: "Which prefixes can already be formed?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet", "code"]',
        output: "true",
      },
      {
        input: 's = "applepenapple", wordDict = ["apple", "pen"]',
        output: "true",
      },
    ],
    collection: "Blind 75",
  },
];

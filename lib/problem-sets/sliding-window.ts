import type { ProblemDefinition } from "../coding-types";

// Sliding Window
export const slidingWindowProblems: ProblemDefinition[] = [
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Sliding Window",
    functionName: "maxProfit",
    signature: {
      parameters: [["prices", "int[]"]],
      returns: "int",
    },
    prompt:
      "Given daily stock prices, choose one buy day followed by one sell day. Return the largest profit, or 0 if no profit is possible.",
    hint: "Remember the lowest price seen before each potential sell day.",
    constraints: [
      "0 ≤ prices.length ≤ 100,000",
      "Prices are nonnegative integers.",
    ],
    tests: [
      {
        args: [[7, 1, 5, 3, 6, 4]],
        expected: 5,
      },
      {
        args: [[7, 6, 4, 3, 1]],
        expected: 0,
      },
      {
        args: [[2]],
        expected: 0,
      },
      {
        args: [[2, 4, 1, 7]],
        expected: 6,
      },
    ],
    examples: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
      },
      {
        input: "prices = [7, 6, 4, 3, 1]",
        output: "0",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    functionName: "lengthOfLongestSubstring",
    signature: {
      parameters: [["s", "string"]],
      returns: "int",
    },
    prompt:
      "Return the length of the longest contiguous part of a string whose characters are all distinct.",
    hint: "Move the left side of a window past any repeated character.",
    constraints: ["0 ≤ s.length ≤ 100,000"],
    tests: [
      {
        args: ["abcabcbb"],
        expected: 3,
      },
      {
        args: ["bbbbb"],
        expected: 1,
      },
      {
        args: ["pwwkew"],
        expected: 3,
      },
      {
        args: [""],
        expected: 0,
      },
      {
        args: ["dvdf"],
        expected: 3,
      },
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
      },
      {
        input: 's = "bbbbb"',
        output: "1",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    category: "Sliding Window",
    functionName: "characterReplacement",
    signature: {
      parameters: [
        ["s", "string"],
        ["k", "int"],
      ],
      returns: "int",
    },
    prompt:
      "A string has uppercase English letters. You may change at most k characters in one contiguous segment; return the longest segment that can become one repeated letter.",
    hint: "The window needs no more than k characters other than its most frequent letter.",
    constraints: ["0 ≤ s.length ≤ 100,000", "0 ≤ k ≤ s.length"],
    tests: [
      {
        args: ["ABAB", 2],
        expected: 4,
      },
      {
        args: ["AABABBA", 1],
        expected: 4,
      },
      {
        args: ["AAAA", 0],
        expected: 4,
      },
      {
        args: ["", 0],
        expected: 0,
      },
    ],
    examples: [
      {
        input: 's = "ABAB", k = 2',
        output: "4",
      },
      {
        input: 's = "AABABBA", k = 1',
        output: "4",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    category: "Sliding Window",
    functionName: "minWindow",
    signature: {
      parameters: [
        ["s", "string"],
        ["t", "string"],
      ],
      returns: "string",
    },
    prompt:
      "Return the shortest contiguous part of s containing every character of t with its required multiplicity. Return an empty string if none exists. Test cases have a unique shortest window.",
    tests: [
      {
        args: ["ADOBECODEBANC", "ABC"],
        expected: "BANC",
      },
      {
        args: ["a", "a"],
        expected: "a",
      },
      {
        args: ["a", "aa"],
        expected: "",
      },
      {
        args: ["aaab", "aab"],
        expected: "aab",
      },
    ],
    hint: "When can the left edge move without losing a required character?",
    difficulty: "Hard",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
      },
    ],
    collection: "Blind 75",
  },
];

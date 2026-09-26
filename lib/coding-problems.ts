export type CodingProblem = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium";
  category: string;
  prompt: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hint: string;
  functionName: string;
  starterCode: string;
  tests: { args: unknown[]; expected: unknown }[];
};

export const codingProblems: CodingProblem[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays · Hash maps",
    prompt:
      "Given an array of integers nums and a target, return the indices of two distinct numbers whose sum is the target. You can assume exactly one solution exists. Return the indices in ascending order.",
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]" },
      { input: "nums = [3, 3], target = 6", output: "[0, 1]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10,000", "Each input has exactly one solution."],
    hint: "As you scan, remember where you saw each number. What complement are you looking for?",
    functionName: "twoSum",
    starterCode: "function twoSum(nums, target) {\n  // Return the two indices in ascending order.\n  \n}",
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks · Strings",
    prompt:
      "Given a string containing only (), {}, and [], return true if every opening bracket is closed by the same type in the correct order. An empty string is valid.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "([)]"', output: "false", explanation: "The brackets cross rather than nest." },
    ],
    constraints: ["0 ≤ s.length ≤ 10,000", "The input contains only bracket characters."],
    hint: "A stack can remember the most recent unmatched opening bracket.",
    functionName: "isValid",
    starterCode: "function isValid(s) {\n  // Return true or false.\n  \n}",
    tests: [
      { args: ["()[]{}"], expected: true },
      { args: ["([)]"], expected: false },
      { args: ["{[]}"], expected: true },
      { args: ["("], expected: false },
      { args: [""], expected: true },
    ],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Arrays · Search",
    prompt:
      "Given an array of unique integers sorted in ascending order, return the index of target. Return -1 if target is not present. Aim for O(log n) time.",
    examples: [
      { input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", output: "4" },
      { input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", output: "-1" },
    ],
    constraints: ["0 ≤ nums.length ≤ 10,000", "Values are unique and sorted."],
    hint: "Compare the middle value with target, then discard half of the remaining range.",
    functionName: "binarySearch",
    starterCode: "function binarySearch(nums, target) {\n  // Return the index or -1.\n  \n}",
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[1, 3, 5, 7, 9], 1], expected: 0 },
    ],
  },
];

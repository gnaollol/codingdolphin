import type { ProblemDefinition } from "../coding-types";

// Arrays & Hashing
export const arraysAndHashingProblems: ProblemDefinition[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    prompt:
      "Given an array of integers nums and a target, return the indices of two distinct numbers whose sum is the target. You can assume exactly one solution exists. Return the indices in ascending order.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10,000",
      "Each input has exactly one solution.",
    ],
    hint: "As you scan, remember where you saw each number. What complement are you looking for?",
    functionName: "twoSum",
    starterCode:
      "function twoSum(nums, target) {\n  // Return the two indices in ascending order.\n  \n}",
    tests: [
      {
        args: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        args: [[3, 2, 4], 6],
        expected: [1, 2],
      },
      {
        args: [[3, 3], 6],
        expected: [0, 1],
      },
      {
        args: [[-3, 4, 3, 90], 0],
        expected: [0, 2],
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    functionName: "containsDuplicate",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "bool",
    },
    prompt:
      "Return true when an integer array contains the same value at two different positions.",
    hint: "Track values seen so far in a set.",
    constraints: ["0 ≤ nums.length ≤ 100,000"],
    tests: [
      {
        args: [[1, 2, 3, 1]],
        expected: true,
      },
      {
        args: [[1, 2, 3, 4]],
        expected: false,
      },
      {
        args: [[]],
        expected: false,
      },
      {
        args: [[-1, -1, 2]],
        expected: true,
      },
    ],
    examples: [
      {
        input: "nums = [1, 2, 3, 1]",
        output: "true",
      },
      {
        input: "nums = [1, 2, 3, 4]",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    functionName: "isAnagram",
    signature: {
      parameters: [
        ["s", "string"],
        ["t", "string"],
      ],
      returns: "bool",
    },
    prompt:
      "Determine whether two lowercase strings contain exactly the same letters with the same frequencies.",
    hint: "Compare frequency counts for the two strings.",
    constraints: [
      "Strings contain lowercase English letters.",
      "0 ≤ string length ≤ 100,000",
    ],
    tests: [
      {
        args: ["anagram", "nagaram"],
        expected: true,
      },
      {
        args: ["rat", "car"],
        expected: false,
      },
      {
        args: ["", ""],
        expected: true,
      },
      {
        args: ["aacc", "ccac"],
        expected: false,
      },
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    functionName: "productExceptSelf",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int[]",
    },
    prompt:
      "For each position, return the product of every other array value. Do not use division. Answers fit in a signed 32-bit integer.",
    hint: "Build products from the left and right of every position.",
    constraints: [
      "2 ≤ nums.length ≤ 100,000",
      "Products fit in 32-bit signed integers.",
    ],
    tests: [
      {
        args: [[1, 2, 3, 4]],
        expected: [24, 12, 8, 6],
      },
      {
        args: [[-1, 1, 0, -3, 3]],
        expected: [0, 0, 9, 0, 0],
      },
      {
        args: [[0, 0, 2]],
        expected: [0, 0, 0],
      },
      {
        args: [[2, 3]],
        expected: [3, 2],
      },
    ],
    examples: [
      {
        input: "nums = [1, 2, 3, 4]",
        output: "[24, 12, 8, 6]",
      },
      {
        input: "nums = [-1, 1, 0, -3, 3]",
        output: "[0, 0, 9, 0, 0]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    category: "Arrays & Hashing",
    functionName: "groupAnagrams",
    signature: {
      parameters: [["strs", "string[]"]],
      returns: "string[][]",
    },
    prompt:
      "Partition the lowercase words into groups whose words contain the same letters with the same counts. Group order and word order do not matter.",
    tests: [
      {
        args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
      },
      {
        args: [[""]],
        expected: [[""]],
      },
      {
        args: [["a", "a", "b"]],
        expected: [["a", "a"], ["b"]],
      },
      {
        args: [[]],
        expected: [],
      },
    ],
    hint: "Which description of a word stays the same when its letters are rearranged?",
    difficulty: "Medium",
    comparison: "unorderedNested",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    category: "Arrays & Hashing",
    functionName: "topKFrequent",
    signature: {
      parameters: [
        ["nums", "int[]"],
        ["k", "int"],
      ],
      returns: "int[]",
    },
    prompt:
      "Return the k distinct integers with the greatest frequency. The selected set is unique; output order does not matter.",
    tests: [
      {
        args: [[1, 1, 1, 2, 2, 3], 2],
        expected: [1, 2],
      },
      {
        args: [[4], 1],
        expected: [4],
      },
      {
        args: [[-1, -1, 2, 2, 2, 3], 1],
        expected: [2],
      },
      {
        args: [[5, 5, 6, 6, 6, 7, 7, 7, 7], 2],
        expected: [6, 7],
      },
    ],
    hint: "Could you group values by frequency?",
    difficulty: "Medium",
    comparison: "unordered",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "nums = [1, 1, 1, 2, 2, 3], k = 2",
        output: "[1, 2]",
      },
      {
        input: "nums = [4], k = 1",
        output: "[4]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "encode-and-decode-strings",
    title: "Encode and Decode Strings",
    category: "Arrays & Hashing",
    functionName: "codecRoundTrip",
    signature: {
      parameters: [["strs", "string[]"]],
      returns: "string[]",
    },
    prompt:
      "Implement encode(strs) returning one string and decode(encoded) returning the original string array. The harness calls decode(encode(strs)); both functions must be present. Strings may be empty or contain separators, newlines, and Unicode. The encoding format is your choice.",
    tests: [
      {
        args: [["hello", "world"]],
        expected: ["hello", "world"],
      },
      {
        args: [["", "a#b", "12:hi"]],
        expected: ["", "a#b", "12:hi"],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [["a\nb", "café", "猫"]],
        expected: ["a\nb", "café", "猫"],
      },
    ],
    hint: "How can the decoder distinguish a separator from a separator inside a word?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 'strs = ["hello", "world"]',
        output: '["hello", "world"]',
      },
      {
        input: 'strs = ["", "a#b", "12:hi"]',
        output: '["", "a#b", "12:hi"]',
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    category: "Arrays & Hashing",
    functionName: "longestConsecutive",
    signature: {
      parameters: [["nums", "int[]"]],
      returns: "int",
    },
    prompt:
      "Find the length of the longest run of consecutive integer values, ignoring input order and repeated values. Aim for linear time.",
    tests: [
      {
        args: [[100, 4, 200, 1, 3, 2]],
        expected: 4,
      },
      {
        args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]],
        expected: 9,
      },
      {
        args: [[]],
        expected: 0,
      },
      {
        args: [[-2, -1, -1, 0, 5]],
        expected: 3,
      },
    ],
    hint: "Which values can be the beginning of a run?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "nums = [100, 4, 200, 1, 3, 2]",
        output: "4",
      },
      {
        input: "nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
        output: "9",
      },
    ],
    collection: "Blind 75",
  },
];

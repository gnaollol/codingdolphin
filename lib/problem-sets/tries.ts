import type { ProblemDefinition } from "../coding-types";

// Tries
export const triesProblems: ProblemDefinition[] = [
  {
    slug: "implement-trie-prefix-tree",
    title: "Implement Trie (Prefix Tree)",
    category: "Tries",
    functionName: "runTrie",
    signature: {
      parameters: [
        ["operations", "string[]"],
        ["words", "string[]"],
      ],
      returns: "bool[]",
    },
    prompt:
      "Start an empty trie. For each matching operation and word, perform insert, search, or startsWith. Return true for insert, and the boolean query result otherwise. search matches whole words; startsWith matches prefixes. Empty words are allowed.",
    tests: [
      {
        args: [
          ["insert", "search", "search", "startsWith", "insert", "search"],
          ["apple", "apple", "app", "app", "app", "app"],
        ],
        expected: [true, true, false, true, true, true],
      },
      {
        args: [
          ["search", "startsWith"],
          ["x", ""],
        ],
        expected: [false, true],
      },
      {
        args: [
          ["insert", "search"],
          ["", ""],
        ],
        expected: [true, true],
      },
      {
        args: [
          ["insert", "insert", "search"],
          ["ab", "abc", "a"],
        ],
        expected: [true, true, false],
      },
    ],
    hint: "What information distinguishes a prefix from a complete word?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input:
          'operations = ["insert", "search", "search", "startsWith", "insert", "search"], words = ["apple", "apple", "app", "app", "app", "app"]',
        output: "[true, true, false, true, true, true]",
      },
      {
        input: 'operations = ["search", "startsWith"], words = ["x", ""]',
        output: "[false, true]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "design-add-and-search-words-data-structure",
    title: "Design Add and Search Words Data Structure",
    category: "Tries",
    functionName: "runWordDictionary",
    signature: {
      parameters: [
        ["operations", "string[]"],
        ["words", "string[]"],
      ],
      returns: "bool[]",
    },
    prompt:
      "Start an empty word dictionary. Each operation is addWord or search. Return true for addWord. For search, a dot matches exactly one lowercase letter; return whether a complete stored word matches the pattern.",
    tests: [
      {
        args: [
          [
            "addWord",
            "addWord",
            "addWord",
            "search",
            "search",
            "search",
            "search",
          ],
          ["bad", "dad", "mad", "pad", "bad", ".ad", "b.."],
        ],
        expected: [true, true, true, false, true, true, true],
      },
      {
        args: [
          ["addWord", "search", "search"],
          ["a", ".", ".."],
        ],
        expected: [true, true, false],
      },
      {
        args: [["search"], ["a"]],
        expected: [false],
      },
      {
        args: [
          ["addWord", "search"],
          ["ab", "a."],
        ],
        expected: [true, true],
      },
    ],
    hint: "A wildcard may require exploring more than one branch.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input:
          'operations = ["addWord", "addWord", "addWord", "search", "search", "search", "search"], words = ["bad", "dad", "mad", "pad", "bad", ".ad", "b.."]',
        output: "[true, true, true, false, true, true, true]",
      },
      {
        input:
          'operations = ["addWord", "search", "search"], words = ["a", ".", ".."]',
        output: "[true, true, false]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "word-search-ii",
    title: "Word Search II",
    category: "Tries",
    functionName: "findWords",
    signature: {
      parameters: [
        ["board", "string[]"],
        ["words", "string[]"],
      ],
      returns: "string[]",
    },
    prompt:
      "The board is an array of equal-length strings, one per row. Move horizontally or vertically; a cell cannot be used twice within one word. Return the distinct supplied words that can be found. Result order does not matter.",
    tests: [
      {
        args: [
          ["oaan", "etae", "ihkr", "iflv"],
          ["oath", "pea", "eat", "rain"],
        ],
        expected: ["eat", "oath"],
      },
      {
        args: [
          ["ab", "cd"],
          ["ab", "ac", "abcd"],
        ],
        expected: ["ab", "ac"],
      },
      {
        args: [["a"], ["a", "aa"]],
        expected: ["a"],
      },
      {
        args: [["a"], ["b"]],
        expected: [],
      },
    ],
    hint: "Can shared prefixes reduce repeated exploration?",
    difficulty: "Hard",
    comparison: "unordered",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input:
          'board = ["oaan", "etae", "ihkr", "iflv"], words = ["oath", "pea", "eat", "rain"]',
        output: '["eat", "oath"]',
      },
      {
        input: 'board = ["ab", "cd"], words = ["ab", "ac", "abcd"]',
        output: '["ab", "ac"]',
      },
    ],
    collection: "Blind 75",
  },
];

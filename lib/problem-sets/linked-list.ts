import type { ProblemDefinition } from "../coding-types";

// Linked List
export const linkedListProblems: ProblemDefinition[] = [
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    category: "Linked List",
    functionName: "reverseList",
    signature: {
      parameters: [["head", "int[]"]],
      returns: "int[]",
    },
    prompt:
      "A singly linked list is supplied as its values from head to tail. Return the values of the reversed list. This runner uses arrays instead of ListNode objects.",
    tests: [
      {
        args: [[1, 2, 3, 4, 5]],
        expected: [5, 4, 3, 2, 1],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[7]],
        expected: [7],
      },
      {
        args: [[-1, 0, 2]],
        expected: [2, 0, -1],
      },
    ],
    hint: "Which pointers would need to change in a node-based implementation?",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "head = [1, 2, 3, 4, 5]",
        output: "[5, 4, 3, 2, 1]",
      },
      {
        input: "head = []",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    category: "Linked List",
    functionName: "mergeTwoLists",
    signature: {
      parameters: [
        ["list1", "int[]"],
        ["list2", "int[]"],
      ],
      returns: "int[]",
    },
    prompt:
      "Two linked lists are supplied as sorted value arrays. Return the merged sorted values, including duplicates. This runner uses arrays instead of ListNode objects.",
    tests: [
      {
        args: [
          [1, 2, 4],
          [1, 3, 4],
        ],
        expected: [1, 1, 2, 3, 4, 4],
      },
      {
        args: [[], []],
        expected: [],
      },
      {
        args: [[], [0]],
        expected: [0],
      },
      {
        args: [
          [-3, 2],
          [-2, 2, 5],
        ],
        expected: [-3, -2, 2, 2, 5],
      },
    ],
    hint: "Compare only the next unused value of each list.",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "list1 = [1, 2, 4], list2 = [1, 3, 4]",
        output: "[1, 1, 2, 3, 4, 4]",
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "reorder-list",
    title: "Reorder List",
    category: "Linked List",
    functionName: "reorderList",
    signature: {
      parameters: [["head", "int[]"]],
      returns: "int[]",
    },
    prompt:
      "Return list values in the order first, last, second, second-last, and so on. The list is supplied as an array; return an array rather than mutating nodes.",
    tests: [
      {
        args: [[1, 2, 3, 4]],
        expected: [1, 4, 2, 3],
      },
      {
        args: [[1, 2, 3, 4, 5]],
        expected: [1, 5, 2, 4, 3],
      },
      {
        args: [[1]],
        expected: [1],
      },
      {
        args: [[]],
        expected: [],
      },
    ],
    hint: "Think about splitting, reversing the second half, then weaving the halves.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "head = [1, 2, 3, 4]",
        output: "[1, 4, 2, 3]",
      },
      {
        input: "head = [1, 2, 3, 4, 5]",
        output: "[1, 5, 2, 4, 3]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "remove-nth-node-from-end-of-list",
    title: "Remove Nth Node From End of List",
    category: "Linked List",
    functionName: "removeNthFromEnd",
    signature: {
      parameters: [
        ["head", "int[]"],
        ["n", "int"],
      ],
      returns: "int[]",
    },
    prompt:
      "Remove the nth value counted from the end of the linked list, supplied as a value array, and return the remaining values. n is between 1 and the list length.",
    tests: [
      {
        args: [[1, 2, 3, 4, 5], 2],
        expected: [1, 2, 3, 5],
      },
      {
        args: [[1], 1],
        expected: [],
      },
      {
        args: [[1, 2], 2],
        expected: [2],
      },
      {
        args: [[1, 2, 3], 1],
        expected: [1, 2],
      },
    ],
    hint: "How far apart should two pointers be?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "head = [1, 2, 3, 4, 5], n = 2",
        output: "[1, 2, 3, 5]",
      },
      {
        input: "head = [1], n = 1",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "linked-list-cycle",
    title: "Linked List Cycle",
    category: "Linked List",
    functionName: "hasCycle",
    signature: {
      parameters: [
        ["next", "int[]"],
        ["head", "int"],
      ],
      returns: "bool",
    },
    prompt:
      "The list is supplied as a next-index array: next[i] identifies the next node or -1 for no next node. Starting from head (-1 means empty), return whether following links repeats a node. Every nonnegative index is valid.",
    tests: [
      {
        args: [[1, 2, 3, 1], 0],
        expected: true,
      },
      {
        args: [[1, -1], 0],
        expected: false,
      },
      {
        args: [[], -1],
        expected: false,
      },
      {
        args: [[0], 0],
        expected: true,
      },
      {
        args: [[1, 2, 1, -1], 3],
        expected: false,
      },
    ],
    hint: "What happens when two pointers move at different speeds?",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "next = [1, 2, 3, 1], head = 0",
        output: "true",
      },
      {
        input: "next = [1, -1], head = 0",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "merge-k-sorted-lists",
    title: "Merge K Sorted Lists",
    category: "Linked List",
    functionName: "mergeKLists",
    signature: {
      parameters: [["lists", "int[][]"]],
      returns: "int[]",
    },
    prompt:
      "Each row supplies a sorted linked list as a value array. Merge all lists and return the sorted values, including duplicates.",
    tests: [
      {
        args: [
          [
            [1, 4, 5],
            [1, 3, 4],
            [2, 6],
          ],
        ],
        expected: [1, 1, 2, 3, 4, 4, 5, 6],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[[], [1], []]],
        expected: [1],
      },
      {
        args: [
          [
            [-3, -1],
            [-2, 0],
          ],
        ],
        expected: [-3, -2, -1, 0],
      },
    ],
    hint: "How could you find the smallest available head efficiently?",
    difficulty: "Hard",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "lists = [[1, 4, 5], [1, 3, 4], [2, 6]]",
        output: "[1, 1, 2, 3, 4, 4, 5, 6]",
      },
      {
        input: "lists = []",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
];

import type { ProblemDefinition } from "../coding-types";

// Trees
export const treesProblems: ProblemDefinition[] = [
  {
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    category: "Trees",
    functionName: "invertTree",
    signature: {
      parameters: [["root", "tree"]],
      returns: "tree",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Swap every node’s left and right children and return the resulting level-order array.",
    tests: [
      {
        args: [[4, 2, 7, 1, 3, 6, 9]],
        expected: [4, 7, 2, 9, 6, 3, 1],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[1, 2]],
        expected: [1, null, 2],
      },
      {
        args: [[1]],
        expected: [1],
      },
    ],
    hint: "Apply the same swap to every subtree.",
    difficulty: "Easy",
    comparison: "tree",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [4, 2, 7, 1, 3, 6, 9]",
        output: "[4, 7, 2, 9, 6, 3, 1]",
      },
      {
        input: "root = []",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    category: "Trees",
    functionName: "maxDepth",
    signature: {
      parameters: [["root", "tree"]],
      returns: "int",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Return the number of nodes on the longest root-to-leaf path.",
    tests: [
      {
        args: [[3, 9, 20, null, null, 15, 7]],
        expected: 3,
      },
      {
        args: [[]],
        expected: 0,
      },
      {
        args: [[1, null, 2, null, 3]],
        expected: 3,
      },
      {
        args: [[1]],
        expected: 1,
      },
    ],
    hint: "A node’s depth depends on the deeper child.",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [3, 9, 20, null, null, 15, 7]",
        output: "3",
      },
      {
        input: "root = []",
        output: "0",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "same-tree",
    title: "Same Tree",
    category: "Trees",
    functionName: "isSameTree",
    signature: {
      parameters: [
        ["p", "tree"],
        ["q", "tree"],
      ],
      returns: "bool",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Return whether both trees have identical structure and values.",
    tests: [
      {
        args: [
          [1, 2, 3],
          [1, 2, 3],
        ],
        expected: true,
      },
      {
        args: [
          [1, 2],
          [1, null, 2],
        ],
        expected: false,
      },
      {
        args: [[], []],
        expected: true,
      },
      {
        args: [[1], [2]],
        expected: false,
      },
    ],
    hint: "Compare matching nodes and the presence of their children.",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "p = [1, 2, 3], q = [1, 2, 3]",
        output: "true",
      },
      {
        input: "p = [1, 2], q = [1, null, 2]",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "subtree-of-another-tree",
    title: "Subtree of Another Tree",
    category: "Trees",
    functionName: "isSubtree",
    signature: {
      parameters: [
        ["root", "tree"],
        ["subRoot", "tree"],
      ],
      returns: "bool",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Return whether some node of root starts a tree identical to subRoot. An empty subRoot is a subtree of every tree.",
    tests: [
      {
        args: [
          [3, 4, 5, 1, 2],
          [4, 1, 2],
        ],
        expected: true,
      },
      {
        args: [
          [3, 4, 5, 1, 2, null, null, null, null, 0],
          [4, 1, 2],
        ],
        expected: false,
      },
      {
        args: [[1], []],
        expected: true,
      },
      {
        args: [[], [1]],
        expected: false,
      },
    ],
    hint: "Separate finding a candidate root from comparing two trees.",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]",
        output: "true",
      },
      {
        input:
          "root = [3, 4, 5, 1, 2, null, null, null, null, 0], subRoot = [4, 1, 2]",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "lowest-common-ancestor-of-a-binary-search-tree",
    title: "Lowest Common Ancestor of a Binary Search Tree",
    category: "Trees",
    functionName: "lowestCommonAncestor",
    signature: {
      parameters: [
        ["root", "tree"],
        ["p", "int"],
        ["q", "int"],
      ],
      returns: "int",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. The tree is a BST with unique values, and p and q are present. Return their lowest common ancestor’s value.",
    tests: [
      {
        args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8],
        expected: 6,
      },
      {
        args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4],
        expected: 2,
      },
      {
        args: [[2, 1], 2, 1],
        expected: 2,
      },
      {
        args: [[5, 3, 8, 2, 4, 7, 9], 7, 9],
        expected: 8,
      },
    ],
    hint: "When do the two values lie on opposite sides of a node?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 8",
        output: "6",
      },
      {
        input: "root = [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p = 2, q = 4",
        output: "2",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    category: "Trees",
    functionName: "levelOrder",
    signature: {
      parameters: [["root", "tree"]],
      returns: "int[][]",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Return one array per depth, listing nodes from left to right.",
    tests: [
      {
        args: [[3, 9, 20, null, null, 15, 7]],
        expected: [[3], [9, 20], [15, 7]],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[1]],
        expected: [[1]],
      },
      {
        args: [[1, null, 2, 3]],
        expected: [[1], [2], [3]],
      },
    ],
    hint: "A queue can preserve the order within each depth.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [3, 9, 20, null, null, 15, 7]",
        output: "[[3], [9, 20], [15, 7]]",
      },
      {
        input: "root = []",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    category: "Trees",
    functionName: "isValidBST",
    signature: {
      parameters: [["root", "tree"]],
      returns: "bool",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Return whether every left descendant is strictly smaller and every right descendant strictly larger than its ancestor. Duplicate values are invalid.",
    tests: [
      {
        args: [[2, 1, 3]],
        expected: true,
      },
      {
        args: [[5, 1, 4, null, null, 3, 6]],
        expected: false,
      },
      {
        args: [[2, 2, 3]],
        expected: false,
      },
      {
        args: [[]],
        expected: true,
      },
    ],
    hint: "Each subtree inherits bounds from more than just its parent.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [2, 1, 3]",
        output: "true",
      },
      {
        input: "root = [5, 1, 4, null, null, 3, 6]",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "kth-smallest-element-in-a-bst",
    title: "Kth Smallest Element in a BST",
    category: "Trees",
    functionName: "kthSmallest",
    signature: {
      parameters: [
        ["root", "tree"],
        ["k", "int"],
      ],
      returns: "int",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. The tree is a BST with unique values. Return its kth smallest value, with k starting at 1 and always valid.",
    tests: [
      {
        args: [[3, 1, 4, null, 2], 1],
        expected: 1,
      },
      {
        args: [[5, 3, 6, 2, 4, null, null, 1], 3],
        expected: 3,
      },
      {
        args: [[1], 1],
        expected: 1,
      },
      {
        args: [[2, 1, 3], 3],
        expected: 3,
      },
    ],
    hint: "Which tree traversal visits BST values in sorted order?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [3, 1, 4, null, 2], k = 1",
        output: "1",
      },
      {
        input: "root = [5, 3, 6, 2, 4, null, null, 1], k = 3",
        output: "3",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
    title: "Construct Binary Tree From Preorder and Inorder Traversal",
    category: "Trees",
    functionName: "buildTree",
    signature: {
      parameters: [
        ["preorder", "int[]"],
        ["inorder", "int[]"],
      ],
      returns: "tree",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. The traversals describe the same tree with unique values. Build it and return its compact level-order representation.",
    tests: [
      {
        args: [
          [3, 9, 20, 15, 7],
          [9, 3, 15, 20, 7],
        ],
        expected: [3, 9, 20, null, null, 15, 7],
      },
      {
        args: [[], []],
        expected: [],
      },
      {
        args: [[-1], [-1]],
        expected: [-1],
      },
      {
        args: [
          [1, 2, 3],
          [3, 2, 1],
        ],
        expected: [1, 2, null, 3],
      },
    ],
    hint: "The first preorder value tells you where to split the inorder traversal.",
    difficulty: "Medium",
    comparison: "tree",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7]",
        output: "[3, 9, 20, null, null, 15, 7]",
      },
      {
        input: "preorder = [], inorder = []",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    category: "Trees",
    functionName: "maxPathSum",
    signature: {
      parameters: [["root", "tree"]],
      returns: "int",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Return the maximum sum along any nonempty connected path. A path cannot repeat nodes and need not include the root. The input tree is nonempty.",
    tests: [
      {
        args: [[1, 2, 3]],
        expected: 6,
      },
      {
        args: [[-10, 9, 20, null, null, 15, 7]],
        expected: 42,
      },
      {
        args: [[-3]],
        expected: -3,
      },
      {
        args: [[2, -1]],
        expected: 2,
      },
    ],
    hint: "Distinguish a path passed to a parent from a path ending at this node.",
    difficulty: "Hard",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [1, 2, 3]",
        output: "6",
      },
      {
        input: "root = [-10, 9, 20, null, null, 15, 7]",
        output: "42",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    category: "Trees",
    functionName: "treeCodecRoundTrip",
    signature: {
      parameters: [["root", "tree"]],
      returns: "tree",
    },
    prompt:
      "Trees use compact level-order arrays with null for absent children. Process real nodes in queue order; null entries have no children. [] is an empty tree. Implement serialize(root) taking a level-order array and returning a string, and deserialize(data) returning a level-order array. The harness verifies the round trip. The encoding format is yours to choose.",
    tests: [
      {
        args: [[1, 2, 3, null, null, 4, 5]],
        expected: [1, 2, 3, null, null, 4, 5],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[1, null, 2, 3]],
        expected: [1, null, 2, 3],
      },
      {
        args: [[-1]],
        expected: [-1],
      },
    ],
    hint: "The encoding must preserve absent children as well as values.",
    difficulty: "Hard",
    comparison: "tree",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "root = [1, 2, 3, null, null, 4, 5]",
        output: "[1, 2, 3, null, null, 4, 5]",
      },
      {
        input: "root = []",
        output: "[]",
      },
    ],
    collection: "Blind 75",
  },
];

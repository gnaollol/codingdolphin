import type { ProblemDefinition } from "../coding-types";

// Graphs
export const graphsProblems: ProblemDefinition[] = [
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    category: "Graphs",
    functionName: "numIslands",
    signature: {
      parameters: [["grid", "string[]"]],
      returns: "int",
    },
    prompt:
      "Rows are equal-length strings of 0 and 1. Count connected groups of 1 cells using horizontal and vertical adjacency. [] is an empty grid.",
    tests: [
      {
        args: [["11110", "11010", "11000", "00000"]],
        expected: 1,
      },
      {
        args: [["11000", "11000", "00100", "00011"]],
        expected: 3,
      },
      {
        args: [[]],
        expected: 0,
      },
      {
        args: [["10", "01"]],
        expected: 2,
      },
    ],
    hint: "Mark every cell in a discovered component before counting another one.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: 'grid = ["11110", "11010", "11000", "00000"]',
        output: "1",
      },
      {
        input: 'grid = ["11000", "11000", "00100", "00011"]',
        output: "3",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "clone-graph",
    title: "Clone Graph",
    category: "Graphs",
    functionName: "cloneGraph",
    signature: {
      parameters: [["adj", "int[][]"]],
      returns: "int[][]",
    },
    prompt:
      "An undirected graph is supplied as adjacency rows for node indices 0 through n-1. Reconstruct and return an independent adjacency representation of the same graph. Neighbor order does not matter; row order identifies nodes.",
    tests: [
      {
        args: [
          [
            [1, 3],
            [0, 2],
            [1, 3],
            [0, 2],
          ],
        ],
        expected: [
          [1, 3],
          [0, 2],
          [1, 3],
          [0, 2],
        ],
      },
      {
        args: [[[]]],
        expected: [[]],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [[[1], [0], []]],
        expected: [[1], [0], []],
      },
    ],
    hint: "Keep a mapping from each original node to its copy.",
    difficulty: "Medium",
    comparison: "rowsUnordered",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "adj = [[1, 3], [0, 2], [1, 3], [0, 2]]",
        output: "[[1, 3], [0, 2], [1, 3], [0, 2]]",
      },
      {
        input: "adj = [[]]",
        output: "[[]]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    category: "Graphs",
    functionName: "pacificAtlantic",
    signature: {
      parameters: [["heights", "int[][]"]],
      returns: "int[][]",
    },
    prompt:
      "Water can move to adjacent cells of no greater height. The Pacific touches the top and left edges; the Atlantic touches the bottom and right edges. Return coordinates [row, column] able to reach both oceans, in any order.",
    tests: [
      {
        args: [
          [
            [1, 2, 2, 3, 5],
            [3, 2, 3, 4, 4],
            [2, 4, 5, 3, 1],
            [6, 7, 1, 4, 5],
            [5, 1, 1, 2, 4],
          ],
        ],
        expected: [
          [0, 4],
          [1, 3],
          [1, 4],
          [2, 2],
          [3, 0],
          [3, 1],
          [4, 0],
        ],
      },
      {
        args: [[[1]]],
        expected: [[0, 0]],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [
          [
            [1, 1],
            [1, 1],
          ],
        ],
        expected: [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
        ],
      },
    ],
    hint: "Try following water movement backward from each ocean.",
    difficulty: "Medium",
    comparison: "unordered",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input:
          "heights = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]",
        output: "[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]",
      },
      {
        input: "heights = [[1]]",
        output: "[[0, 0]]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "course-schedule",
    title: "Course Schedule",
    category: "Graphs",
    functionName: "canFinish",
    signature: {
      parameters: [
        ["numCourses", "int"],
        ["prerequisites", "int[][]"],
      ],
      returns: "bool",
    },
    prompt:
      "Courses are numbered 0 through numCourses-1. Each pair [a,b] means b must precede a. Return whether all courses can be completed.",
    tests: [
      {
        args: [2, [[1, 0]]],
        expected: true,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 1],
          ],
        ],
        expected: false,
      },
      {
        args: [3, []],
        expected: true,
      },
      {
        args: [
          3,
          [
            [1, 0],
            [2, 1],
            [0, 2],
          ],
        ],
        expected: false,
      },
    ],
    hint: "What does a directed cycle mean for prerequisites?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1, 0]]",
        output: "true",
      },
      {
        input: "numCourses = 2, prerequisites = [[1, 0], [0, 1]]",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "graph-valid-tree",
    title: "Graph Valid Tree",
    category: "Graphs",
    functionName: "validTree",
    signature: {
      parameters: [
        ["n", "int"],
        ["edges", "int[][]"],
      ],
      returns: "bool",
    },
    prompt:
      "Nodes are 0 through n-1 with n at least 1. Undirected edges contain no duplicates. Return whether the graph is connected and has no cycle.",
    tests: [
      {
        args: [
          5,
          [
            [0, 1],
            [0, 2],
            [0, 3],
            [1, 4],
          ],
        ],
        expected: true,
      },
      {
        args: [
          5,
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [1, 3],
            [1, 4],
          ],
        ],
        expected: false,
      },
      {
        args: [1, []],
        expected: true,
      },
      {
        args: [
          4,
          [
            [0, 1],
            [2, 3],
          ],
        ],
        expected: false,
      },
    ],
    hint: "How many edges does a connected tree have?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "n = 5, edges = [[0, 1], [0, 2], [0, 3], [1, 4]]",
        output: "true",
      },
      {
        input: "n = 5, edges = [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]",
        output: "false",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "number-of-connected-components-in-an-undirected-graph",
    title: "Number of Connected Components in an Undirected Graph",
    category: "Graphs",
    functionName: "countComponents",
    signature: {
      parameters: [
        ["n", "int"],
        ["edges", "int[][]"],
      ],
      returns: "int",
    },
    prompt:
      "Nodes are 0 through n-1. Count connected components in the undirected graph; isolated nodes count as components.",
    tests: [
      {
        args: [
          5,
          [
            [0, 1],
            [1, 2],
            [3, 4],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          5,
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
          ],
        ],
        expected: 1,
      },
      {
        args: [3, []],
        expected: 3,
      },
      {
        args: [0, []],
        expected: 0,
      },
    ],
    hint: "Starting a traversal from an unvisited node discovers one component.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "n = 5, edges = [[0, 1], [1, 2], [3, 4]]",
        output: "2",
      },
      {
        input: "n = 5, edges = [[0, 1], [1, 2], [2, 3], [3, 4]]",
        output: "1",
      },
    ],
    collection: "Blind 75",
  },
];

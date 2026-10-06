import type { ProblemDefinition } from "../coding-types";

// Math & Geometry
export const matricesProblems: ProblemDefinition[] = [
  {
    slug: "rotate-image",
    title: "Rotate Image",
    category: "Math & Geometry",
    functionName: "rotate",
    signature: {
      parameters: [["matrix", "int[][]"]],
      returns: "int[][]",
    },
    prompt:
      "Rotate a square matrix 90 degrees clockwise. This runner expects the resulting matrix as the return value, rather than a void in-place method.",
    tests: [
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        ],
        expected: [
          [7, 4, 1],
          [8, 5, 2],
          [9, 6, 3],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [3, 4],
          ],
        ],
        expected: [
          [3, 1],
          [4, 2],
        ],
      },
      {
        args: [[[5]]],
        expected: [[5]],
      },
      {
        args: [[]],
        expected: [],
      },
    ],
    hint: "How does a coordinate change after a clockwise rotation?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
        output: "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]",
      },
      {
        input: "matrix = [[1, 2], [3, 4]]",
        output: "[[3, 1], [4, 2]]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "spiral-matrix",
    title: "Spiral Matrix",
    category: "Math & Geometry",
    functionName: "spiralOrder",
    signature: {
      parameters: [["matrix", "int[][]"]],
      returns: "int[]",
    },
    prompt:
      "Return matrix values in clockwise spiral order beginning at the top-left. Rows have equal length; [] is an empty matrix.",
    tests: [
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        ],
        expected: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      },
      {
        args: [
          [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
          ],
        ],
        expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
      },
      {
        args: [[[1], [2], [3]]],
        expected: [1, 2, 3],
      },
      {
        args: [[]],
        expected: [],
      },
    ],
    hint: "Shrink the unvisited rectangle after traversing each edge.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
        output: "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
      },
      {
        input: "matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]",
        output: "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    category: "Math & Geometry",
    functionName: "setZeroes",
    signature: {
      parameters: [["matrix", "int[][]"]],
      returns: "int[][]",
    },
    prompt:
      "If a cell is zero in the original matrix, set every cell in that row and column to zero. Return the resulting matrix, rather than a void in-place method.",
    tests: [
      {
        args: [
          [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
          ],
        ],
        expected: [
          [1, 0, 1],
          [0, 0, 0],
          [1, 0, 1],
        ],
      },
      {
        args: [
          [
            [0, 1, 2, 0],
            [3, 4, 5, 2],
            [1, 3, 1, 5],
          ],
        ],
        expected: [
          [0, 0, 0, 0],
          [0, 4, 5, 0],
          [0, 3, 1, 0],
        ],
      },
      {
        args: [[[1]]],
        expected: [[1]],
      },
      {
        args: [[]],
        expected: [],
      },
    ],
    hint: "Avoid letting newly written zeroes influence which rows you mark.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]",
        output: "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]",
      },
      {
        input: "matrix = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]",
        output: "[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]",
      },
    ],
    collection: "Blind 75",
  },
];

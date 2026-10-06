import type { ProblemDefinition } from "../coding-types";

// Intervals
export const intervalsProblems: ProblemDefinition[] = [
  {
    slug: "insert-interval",
    title: "Insert Interval",
    category: "Intervals",
    functionName: "insertInterval",
    signature: {
      parameters: [
        ["intervals", "int[][]"],
        ["newInterval", "int[]"],
      ],
      returns: "int[][]",
    },
    prompt:
      "Existing closed intervals are sorted by start and do not overlap. Insert newInterval, merging all overlaps, and return sorted nonoverlapping intervals. Touching endpoints overlap.",
    tests: [
      {
        args: [
          [
            [1, 3],
            [6, 9],
          ],
          [2, 5],
        ],
        expected: [
          [1, 5],
          [6, 9],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [3, 5],
            [6, 7],
            [8, 10],
            [12, 16],
          ],
          [4, 8],
        ],
        expected: [
          [1, 2],
          [3, 10],
          [12, 16],
        ],
      },
      {
        args: [[], [5, 7]],
        expected: [[5, 7]],
      },
      {
        args: [[[1, 5]], [2, 3]],
        expected: [[1, 5]],
      },
    ],
    hint: "Separate intervals before, overlapping, and after the new interval.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "intervals = [[1, 3], [6, 9]], newInterval = [2, 5]",
        output: "[[1, 5], [6, 9]]",
      },
      {
        input:
          "intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]",
        output: "[[1, 2], [3, 10], [12, 16]]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    category: "Intervals",
    functionName: "mergeIntervals",
    signature: {
      parameters: [["intervals", "int[][]"]],
      returns: "int[][]",
    },
    prompt:
      "Merge overlapping closed intervals, including touching endpoints. Return nonoverlapping intervals sorted by start.",
    tests: [
      {
        args: [
          [
            [1, 3],
            [2, 6],
            [8, 10],
            [15, 18],
          ],
        ],
        expected: [
          [1, 6],
          [8, 10],
          [15, 18],
        ],
      },
      {
        args: [
          [
            [1, 4],
            [4, 5],
          ],
        ],
        expected: [[1, 5]],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [
          [
            [5, 6],
            [1, 2],
            [2, 4],
          ],
        ],
        expected: [
          [1, 4],
          [5, 6],
        ],
      },
    ],
    hint: "Sorting reveals which interval can overlap the current merged interval.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]",
        output: "[[1, 6], [8, 10], [15, 18]]",
      },
      {
        input: "intervals = [[1, 4], [4, 5]]",
        output: "[[1, 5]]",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    category: "Intervals",
    functionName: "eraseOverlapIntervals",
    signature: {
      parameters: [["intervals", "int[][]"]],
      returns: "int",
    },
    prompt:
      "Return the fewest intervals to remove so remaining intervals do not overlap. For this problem, touching endpoints are allowed.",
    tests: [
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [3, 4],
            [1, 3],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [1, 2],
            [1, 2],
            [1, 2],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
          ],
        ],
        expected: 0,
      },
      {
        args: [[]],
        expected: 0,
      },
    ],
    hint: "Which finishing time leaves the most room for later intervals?",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]",
        output: "1",
      },
      {
        input: "intervals = [[1, 2], [1, 2], [1, 2]]",
        output: "2",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "meeting-rooms",
    title: "Meeting Rooms",
    category: "Intervals",
    functionName: "canAttendMeetings",
    signature: {
      parameters: [["intervals", "int[][]"]],
      returns: "bool",
    },
    prompt:
      "Return whether one person can attend every meeting. Meetings have start less than end. A meeting ending when another starts does not conflict.",
    tests: [
      {
        args: [
          [
            [0, 30],
            [5, 10],
            [15, 20],
          ],
        ],
        expected: false,
      },
      {
        args: [
          [
            [7, 10],
            [2, 4],
          ],
        ],
        expected: true,
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
          ],
        ],
        expected: true,
      },
      {
        args: [[]],
        expected: true,
      },
    ],
    hint: "After sorting, compare the next start with the previous end.",
    difficulty: "Easy",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "intervals = [[0, 30], [5, 10], [15, 20]]",
        output: "false",
      },
      {
        input: "intervals = [[7, 10], [2, 4]]",
        output: "true",
      },
    ],
    collection: "Blind 75",
  },
  {
    slug: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    category: "Intervals",
    functionName: "minMeetingRooms",
    signature: {
      parameters: [["intervals", "int[][]"]],
      returns: "int",
    },
    prompt:
      "Return the minimum number of rooms needed for all meetings. Start is less than end; a room can be reused at the exact end time.",
    tests: [
      {
        args: [
          [
            [0, 30],
            [5, 10],
            [15, 20],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [7, 10],
            [2, 4],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
          ],
        ],
        expected: 1,
      },
      {
        args: [[]],
        expected: 0,
      },
      {
        args: [
          [
            [1, 5],
            [2, 6],
            [3, 7],
          ],
        ],
        expected: 3,
      },
    ],
    hint: "Track how many meetings are active at each time.",
    difficulty: "Medium",
    comparison: "exact",
    constraints: [
      "Inputs satisfy the conditions described above.",
      "Return a result; do not print the answer.",
    ],
    examples: [
      {
        input: "intervals = [[0, 30], [5, 10], [15, 20]]",
        output: "2",
      },
      {
        input: "intervals = [[7, 10], [2, 4]]",
        output: "1",
      },
    ],
    collection: "Blind 75",
  },
];

import type { Module } from "@/lib/module";

type BuiltIn = { slug: string; question: string; aliases: string[]; module: Module };
export const builtIns: BuiltIn[] = [
  {
    slug: "bfs",
    question: "Breadth-first search",
    aliases: [
      "bfs",
      "breadth first search",
      "breadth-first search",
      "explain bfs",
      "what is bfs",
      "how does bfs work",
    ],
    module: {
      title: "Breadth-first search (BFS)",
      definition:
        "Breadth-first search explores a graph one layer at a time, visiting all immediate neighbors before moving farther away. It uses a queue and finds shortest paths by edge count in an unweighted graph.",
      sections: [
        {
          heading: "How it works",
          body: "Start at a node, mark it visited, and put it in a queue. Repeatedly remove the front node and enqueue each unvisited neighbor. Mark neighbors when enqueuing so each vertex enters the queue only once.",
        },
        {
          heading: "Why it matters",
          body: "BFS guarantees the fewest edges from the start to every reachable node in an unweighted graph. A visited set also prevents cycles from making the traversal repeat forever.",
        },
        {
          heading: "Common use cases",
          body: "Use BFS for shortest routes in an unweighted network, levels in a tree, and minimum-move puzzles. For weighted shortest paths, use an algorithm suited to edge weights instead.",
        },
      ],
      code: {
        language: "Python",
        snippet:
          "from collections import deque\n\ndef bfs(graph, start):\n    queue = deque([start])\n    seen = {start}\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            if neighbor not in seen:\n                seen.add(neighbor)\n                queue.append(neighbor)\n    return order",
        explanation:
          "The queue processes nodes in discovery order, while seen prevents duplicate visits.",
      },
      diagram: {
        caption: "BFS visits A, then the first layer B/C, then the second layer D/E.",
        nodes: [
          { id: "a", label: "A · start", x: 15, y: 50 },
          { id: "b", label: "B · layer 1", x: 48, y: 25 },
          { id: "c", label: "C · layer 1", x: 48, y: 75 },
          { id: "d", label: "D · layer 2", x: 82, y: 25 },
          { id: "e", label: "E · layer 2", x: 82, y: 75 },
        ],
        edges: [
          { from: "a", to: "b", label: "" },
          { from: "a", to: "c", label: "" },
          { from: "b", to: "d", label: "" },
          { from: "c", to: "e", label: "" },
        ],
      },
      complexity: [
        {
          operation: "Traversal",
          time: "O(V + E)",
          space: "O(V)",
          note: "Adjacency-list graph; queue and visited set",
        },
      ],
      followUps: [
        "How would you reconstruct the shortest path?",
        "Why mark a node visited when enqueuing rather than dequeuing?",
        "How does BFS compare with DFS?",
      ],
      quiz: [
        {
          question: "Which structure controls BFS's visit order?",
          options: ["Stack", "Queue", "Heap", "Hash map"],
          correctIndex: 1,
          explanations: [
            "A stack gives depth-first behavior.",
            "Correct: FIFO order expands the earliest discovered nodes first.",
            "A heap orders by priority, not discovery time.",
            "A map can track visited nodes but not FIFO order.",
          ],
        },
        {
          question: "When does BFS find a shortest path by edge count?",
          options: [
            "Any weighted graph",
            "Only a tree",
            "An unweighted graph",
            "Only a directed acyclic graph",
          ],
          correctIndex: 2,
          explanations: [
            "Edge weights can change the optimal route.",
            "It also works in graphs with cycles.",
            "Correct: each layer adds one edge.",
            "Cycles are fine if visited nodes are tracked.",
          ],
        },
        {
          question: "Why keep a visited set?",
          options: [
            "To sort edges",
            "To reduce edge weights",
            "To avoid revisiting nodes",
            "To make the graph directed",
          ],
          correctIndex: 2,
          explanations: [
            "It does not sort edges.",
            "BFS does not change weights.",
            "Correct: it prevents repeated work and infinite cycling.",
            "Directedness comes from the graph representation.",
          ],
        },
      ],
      relatedTopics: [
        "Depth-first search",
        "Graph representations",
        "Dijkstra's algorithm",
      ],
    },
  },
  {
    slug: "big-o",
    question: "Big-O notation",
    aliases: [
      "big o",
      "big-o",
      "big o notation",
      "big-o notation",
      "explain big o",
      "what is big-o notation",
    ],
    module: {
      title: "Big-O notation",
      definition:
        "Big-O describes an upper bound on how an algorithm's resource use grows as input size increases. In interviews, it is commonly used to summarize time or auxiliary space growth while ignoring constant factors and lower-order terms.",
      sections: [
        {
          heading: "How it works",
          body: "Choose an input-size variable n, count the dominant work as a function of n, and keep the fastest-growing term. For example, 3n² + 5n + 2 is O(n²). State whether your analysis is worst-case, average-case, or amortized.",
        },
        {
          heading: "Why it matters",
          body: "Asymptotic bounds let you compare scaling before benchmarking on one machine. They do not capture constants, memory layout, or the exact runtime for small inputs.",
        },
        {
          heading: "Common use cases",
          body: "Analyze loops, recursive calls, data-structure operations, and trade-offs between time and space. A binary search on a sorted array takes O(log n) time, whereas a linear scan takes O(n).",
        },
      ],
      code: {
        language: "Python",
        snippet:
          "def contains(items, target):\n    for item in items:\n        if item == target:\n            return True\n    return False\n\n# Worst-case time: O(n)\n# Auxiliary space: O(1)",
        explanation:
          "The scan may inspect every item once, and it uses only a fixed amount of extra storage.",
      },
      diagram: {
        caption:
          "As n doubles, a constant-time step stays flat while linear work doubles.",
        nodes: [
          { id: "input", label: "Input n", x: 15, y: 50 },
          { id: "constant", label: "O(1) · flat", x: 78, y: 28 },
          { id: "linear", label: "O(n) · grows", x: 78, y: 72 },
        ],
        edges: [
          { from: "input", to: "constant", label: "" },
          { from: "input", to: "linear", label: "" },
        ],
      },
      complexity: [
        {
          operation: "Single pass",
          time: "O(n)",
          space: "O(1)",
          note: "Example code, worst case",
        },
        {
          operation: "Nested full passes",
          time: "O(n²)",
          space: "O(1)",
          note: "When both loops scale with n",
        },
      ],
      followUps: [
        "What differs between O, Θ, and Ω?",
        "How do you analyze a loop that halves the input?",
        "When does amortized analysis matter?",
      ],
      quiz: [
        {
          question: "What is the Big-O bound of 7n² + 3n + 10?",
          options: ["O(1)", "O(n)", "O(n²)", "O(n³)"],
          correctIndex: 2,
          explanations: [
            "The work grows with n.",
            "The quadratic term dominates the linear term.",
            "Correct: keep the dominant n² term.",
            "A cubic bound is valid but not the tightest common summary.",
          ],
        },
        {
          question: "A loop halves n each iteration. How many iterations?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctIndex: 1,
          explanations: [
            "The count still grows with n.",
            "Correct: repeated halving yields logarithmic steps.",
            "A full scan is linear.",
            "There are no nested full passes.",
          ],
        },
        {
          question: "What does O(1) auxiliary space mean?",
          options: [
            "Zero memory total",
            "Memory independent of input size beyond input",
            "Exactly one byte",
            "Always constant execution time",
          ],
          correctIndex: 1,
          explanations: [
            "The input and fixed variables still occupy memory.",
            "Correct: extra storage stays bounded as n grows.",
            "Big-O ignores exact byte counts.",
            "Space and time are different measures.",
          ],
        },
      ],
      relatedTopics: ["Time complexity", "Space complexity", "Binary search"],
    },
  },
  {
    slug: "binary-search",
    question: "Binary search",
    aliases: [
      "binary search",
      "explain binary search",
      "how does binary search work",
      "what is binary search",
    ],
    module: {
      title: "Binary search",
      definition:
        "Binary search finds a target in a sorted sequence by repeatedly discarding half of the remaining search range. It takes O(log n) comparisons and needs O(1) auxiliary space in an iterative implementation.",
      sections: [
        {
          heading: "How it works",
          body: "Keep inclusive left and right bounds. Compare the middle element with the target; if it is too small, move left past the middle, otherwise move right before it. Stop when the target is found or the interval is empty.",
        },
        {
          heading: "Why it matters",
          body: "Each comparison cuts the candidate range roughly in half. That makes lookup efficient on large sorted arrays, but the sorted-order precondition is essential.",
        },
        {
          heading: "Common use cases",
          body: "Use it for sorted-array lookup, insertion positions, and monotonic answer spaces. Variants such as lower bound require careful handling of equality and boundary conditions.",
        },
      ],
      code: {
        language: "Python",
        snippet:
          "def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
        explanation:
          "Each comparison excludes half of the sorted interval; -1 means the target was absent.",
      },
      diagram: {
        caption: "For target 7, compare the middle 5, then search the right half.",
        nodes: [
          { id: "range", label: "[1, 3, 5, 7, 9]", x: 18, y: 50 },
          { id: "mid", label: "mid = 5", x: 50, y: 50 },
          { id: "right", label: "[7, 9]", x: 82, y: 50 },
        ],
        edges: [
          { from: "range", to: "mid", label: "compare" },
          { from: "mid", to: "right", label: "7 > 5" },
        ],
      },
      complexity: [
        {
          operation: "Search",
          time: "O(log n)",
          space: "O(1)",
          note: "Iterative, sorted random-access array",
        },
      ],
      followUps: [
        "How do you find the first occurrence of a duplicate?",
        "What changes for a linked list?",
        "How do you binary-search a monotonic answer?",
      ],
      quiz: [
        {
          question: "What must be true for ordinary binary search?",
          options: [
            "Input is sorted",
            "Input has no duplicates",
            "Input is a tree",
            "Input is hashed",
          ],
          correctIndex: 0,
          explanations: [
            "Correct: ordering justifies discarding half.",
            "Duplicates are allowed, though first occurrence needs a variant.",
            "An array works.",
            "Hashing is unrelated.",
          ],
        },
        {
          question: "How does the search interval shrink?",
          options: [
            "One item per step",
            "About half per step",
            "It never shrinks",
            "By a random amount",
          ],
          correctIndex: 1,
          explanations: [
            "That describes linear search.",
            "Correct: the comparison selects one half.",
            "Both bounds move toward each other.",
            "The sorted order determines the half.",
          ],
        },
        {
          question: "What is iterative binary search's auxiliary space?",
          options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
          correctIndex: 2,
          explanations: [
            "It does not copy the input.",
            "That can describe a recursive call stack.",
            "Correct: only a few indices are kept.",
            "There is no quadratic storage.",
          ],
        },
      ],
      relatedTopics: ["Big-O notation", "Two pointers", "Lower bound"],
    },
  },
  {
    slug: "two-sum",
    question: "Two Sum problem",
    aliases: [
      "two sum",
      "two sum problem",
      "leetcode two sum",
      "leetcode 1",
      "explain two sum",
    ],
    module: {
      title: "Two Sum",
      definition:
        "Given an array and a target, Two Sum asks for the indices of two distinct elements whose values add to the target. A hash map of previously seen values finds a pair in O(n) average time with O(n) extra space.",
      sections: [
        {
          heading: "How it works",
          body: "For each value x, compute the needed complement target − x. Check whether that complement appeared earlier, then store x with its index. Looking up before storing keeps one element from pairing with itself.",
        },
        {
          heading: "Why it matters",
          body: "This is a standard interview example of trading memory for speed. The brute-force pair check is O(n²); remembering prior values reduces average time to O(n).",
        },
        {
          heading: "Common use cases",
          body: "The complement pattern appears in pair-sum, frequency, and lookup problems. If the input is sorted, a two-pointer solution can use O(1) auxiliary space, provided you can preserve or recover the needed indices.",
        },
      ],
      code: {
        language: "Python",
        snippet:
          "def two_sum(nums, target):\n    seen = {}\n    for i, value in enumerate(nums):\n        needed = target - value\n        if needed in seen:\n            return [seen[needed], i]\n        seen[value] = i\n    return []",
        explanation:
          "The map holds earlier values and indices; checking the complement first prevents using the same index twice.",
      },
      diagram: {
        caption:
          "At value 7 with target 9, look up complement 2 in previously seen values.",
        nodes: [
          { id: "target", label: "target = 9", x: 16, y: 50 },
          { id: "value", label: "value = 7", x: 48, y: 50 },
          { id: "needed", label: "need 2", x: 80, y: 50 },
        ],
        edges: [
          { from: "target", to: "value", label: "" },
          { from: "value", to: "needed", label: "9 − 7" },
        ],
      },
      complexity: [
        {
          operation: "Hash-map pass",
          time: "O(n) average",
          space: "O(n)",
          note: "Hash operations may have worse-case behavior",
        },
        {
          operation: "Brute force",
          time: "O(n²)",
          space: "O(1)",
          note: "Check every pair",
        },
      ],
      followUps: [
        "What if no pair exists?",
        "How do duplicates affect the map?",
        "How would you solve it on a sorted array?",
      ],
      quiz: [
        {
          question: "For target 9 and current value 7, what do you look up?",
          options: ["7", "2", "9", "16"],
          correctIndex: 1,
          explanations: [
            "That is the current value.",
            "Correct: 9 − 7 = 2.",
            "That is the target.",
            "That adds instead of subtracting.",
          ],
        },
        {
          question: "Why check before inserting the current value?",
          options: [
            "To keep indices sorted",
            "To avoid reusing the same element",
            "To make hashing deterministic",
            "To remove duplicates",
          ],
          correctIndex: 1,
          explanations: [
            "The map is not sorted.",
            "Correct: a number must pair with an earlier, distinct index.",
            "Insert order does not determine hash determinism.",
            "Duplicates may be valid inputs.",
          ],
        },
        {
          question: "What is the average time of the hash-map solution?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctIndex: 2,
          explanations: [
            "Every element may need inspection.",
            "There is no halving of a sorted range.",
            "Correct: one pass with average O(1) lookups.",
            "That is the brute-force approach.",
          ],
        },
      ],
      relatedTopics: ["Hash maps", "Two pointers", "Three Sum"],
    },
  },
];

export const normalizeTopic = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[?!.]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");
export function findBuiltIn(question: string) {
  const key = normalizeTopic(question);
  return builtIns.find((item) =>
    item.aliases.some((alias) => normalizeTopic(alias) === key),
  );
}

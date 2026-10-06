import type { CodingProblem, ValueType } from "@/lib/coding-problems";
import type { CodingLanguage } from "@/lib/coding-languages";

const legacyStarters: Record<
  string,
  Partial<Record<Exclude<CodingLanguage, "JavaScript">, string>>
> = {
  "two-sum": {
    Python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Return the two indices in ascending order.
    pass`,
    Java: `class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Return the two indices in ascending order.
        return new int[0];
    }
}`,
    "C++": `#include <vector>
using namespace std;

class Solution {
public:
    static vector<int> twoSum(const vector<int>& nums, int target) {
        // Return the two indices in ascending order.
        return {};
    }
};`,
    "C#": `using System;

public static class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Return the two indices in ascending order.
        return Array.Empty<int>();
    }
}`,
  },

  "valid-parentheses": {
    Python: `def isValid(s: str) -> bool:
    # Return True if all brackets close in the correct order.
    return False`,
    Java: `class Solution {
    public static boolean isValid(String s) {
        // Return true if all brackets close in the correct order.
        return false;
    }
}`,
    "C++": `#include <string>
using namespace std;

class Solution {
public:
    static bool isValid(const string& s) {
        // Return true if all brackets close in the correct order.
        return false;
    }
};`,
    "C#": `public static class Solution {
    public static bool isValid(string s) {
        // Return true if all brackets close in the correct order.
        return false;
    }
}`,
  },

  "binary-search": {
    Python: `def binarySearch(nums: list[int], target: int) -> int:
    # Return the target index, or -1 if it is missing.
    return -1`,
    Java: `class Solution {
    public static int binarySearch(int[] nums, int target) {
        // Return the target index, or -1 if it is missing.
        return -1;
    }
}`,
    "C++": `#include <vector>
using namespace std;

class Solution {
public:
    static int binarySearch(const vector<int>& nums, int target) {
        // Return the target index, or -1 if it is missing.
        return -1;
    }
};`,
    "C#": `public static class Solution {
    public static int binarySearch(int[] nums, int target) {
        // Return the target index, or -1 if it is missing.
        return -1;
    }
}`,
  },
};

const types: Record<
  Exclude<CodingLanguage, "JavaScript">,
  Record<ValueType, string>
> = {
  Python: {
    int: "int",
    "int[]": "list[int]",
    "int[][]": "list[list[int]]",
    string: "str",
    "string[]": "list[str]",
    "string[][]": "list[list[str]]",
    bool: "bool",
    "bool[]": "list[bool]",
    double: "float",
    "double[]": "list[float]",
    tree: "list[int | None]",
  },
  Java: {
    int: "int",
    "int[]": "int[]",
    "int[][]": "int[][]",
    string: "String",
    "string[]": "String[]",
    "string[][]": "String[][]",
    bool: "boolean",
    "bool[]": "boolean[]",
    double: "double",
    "double[]": "double[]",
    tree: "Integer[]",
  },
  "C++": {
    int: "int",
    "int[]": "vector<int>",
    "int[][]": "vector<vector<int>>",
    string: "string",
    "string[]": "vector<string>",
    "string[][]": "vector<vector<string>>",
    bool: "bool",
    "bool[]": "vector<bool>",
    double: "double",
    "double[]": "vector<double>",
    tree: "vector<optional<int>>",
  },
  "C#": {
    int: "int",
    "int[]": "int[]",
    "int[][]": "int[][]",
    string: "string",
    "string[]": "string[]",
    "string[][]": "string[][]",
    bool: "bool",
    "bool[]": "bool[]",
    double: "double",
    "double[]": "double[]",
    tree: "int?[]",
  },
};
const defaults: Record<
  Exclude<CodingLanguage, "JavaScript">,
  Record<ValueType, string>
> = {
  Python: {
    int: "0",
    "int[]": "[]",
    "int[][]": "[]",
    string: '""',
    "string[]": "[]",
    "string[][]": "[]",
    bool: "False",
    "bool[]": "[]",
    double: "0",
    "double[]": "[]",
    tree: "[]",
  },
  Java: {
    int: "0",
    "int[]": "new int[0]",
    "int[][]": "new int[0][]",
    string: '""',
    "string[]": "new String[0]",
    "string[][]": "new String[0][]",
    bool: "false",
    "bool[]": "new boolean[0]",
    double: "0",
    "double[]": "new double[0]",
    tree: "new Integer[0]",
  },
  "C++": {
    int: "0",
    "int[]": "{}",
    "int[][]": "{}",
    string: '""',
    "string[]": "{}",
    "string[][]": "{}",
    bool: "false",
    "bool[]": "{}",
    double: "0",
    "double[]": "{}",
    tree: "{}",
  },
  "C#": {
    int: "0",
    "int[]": "Array.Empty<int>()",
    "int[][]": "Array.Empty<int[]>()",
    string: '""',
    "string[]": "Array.Empty<string>()",
    "string[][]": "Array.Empty<string[]>()",
    bool: "false",
    "bool[]": "Array.Empty<bool>()",
    double: "0",
    "double[]": "Array.Empty<double>()",
    tree: "Array.Empty<int?>()",
  },
};

export function getStarterCode(
  problem: CodingProblem,
  language: CodingLanguage,
): string | null {
  const codec = problem.slug === "encode-and-decode-strings";
  const treeCodec = problem.slug === "serialize-and-deserialize-binary-tree";
  if (codec || treeCodec) {
    const encodeName = codec ? "encode" : "serialize",
      decodeName = codec ? "decode" : "deserialize";
    const inputName = codec ? "strs" : "root",
      type: ValueType = codec ? "string[]" : "tree";
    if (language === "JavaScript")
      return `function ${encodeName}(${inputName}) {
  // Encode into a string.
  return "";
}

function ${decodeName}(data) {
  // Decode the string.
  return [];
}`;
    const t = types[language][type],
      empty = defaults[language][type];
    if (language === "Python")
      return `def ${encodeName}(${inputName}: ${t}) -> str:
    return ""

def ${decodeName}(data: str) -> ${t}:
    return []`;
    if (language === "Java")
      return `import java.util.*;

class Solution {
    public String ${encodeName}(${t} ${inputName}) { return ""; }
    public ${t} ${decodeName}(String data) { return ${empty}; }
}`;
    if (language === "C++")
      return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string ${encodeName}(${t} ${inputName}) { return ""; }
    ${t} ${decodeName}(string data) { return {}; }
};`;
    return `using System;
using System.Collections.Generic;

public static class Solution {
    public static string ${encodeName}(${t} ${inputName}) { return ""; }
    public static ${t} ${decodeName}(string data) { return ${empty}; }
}`;
  }
  if (language === "JavaScript") return problem.starterCode;
  const signature = problem.signature;
  if (!signature) return legacyStarters[problem.slug]?.[language] ?? null;
  const returnType = types[language][signature.returns];
  const defaultValue = defaults[language][signature.returns];
  const parameters = signature.parameters
    .map(([name, type]) =>
      language === "Python"
        ? `${name}: ${types.Python[type]}`
        : `${types[language][type]} ${name}`,
    )
    .join(", ");
  const name = problem.functionName;
  if (language === "Python")
    return `def ${name}(${parameters}) -> ${returnType}:
    # Write your solution here.
    return ${defaultValue}`;
  if (language === "Java")
    return `import java.util.*;

class Solution {
    public ${returnType} ${name}(${parameters}) {
        // Write your solution here.
        return ${defaultValue};
    }
}`;
  if (language === "C++")
    return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    ${returnType} ${name}(${parameters}) {
        // Write your solution here.
        return ${defaultValue};
    }
};`;
  return `using System;
using System.Collections.Generic;
using System.Linq;

public static class Solution {
    public static ${returnType} ${name}(${parameters}) {
        // Write your solution here.
        return ${defaultValue};
    }
}`;
}

export type ValueType =
  | "int"
  | "int[]"
  | "int[][]"
  | "string"
  | "string[]"
  | "string[][]"
  | "bool"
  | "bool[]"
  | "double"
  | "double[]"
  | "tree";

export type ProblemSignature = {
  parameters: [name: string, type: ValueType][];
  returns: ValueType;
};

export type ComparisonMode =
  | "exact"
  | "unordered"
  | "unorderedNested"
  | "rowsUnordered"
  | "tree"
  | "alien"
  | "palindrome";

export type CodingProblem = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  collection?: "Blind 75" | "Extra Practice";
  prompt: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hint: string;
  functionName: string;
  starterCode: string;
  signature?: ProblemSignature;
  comparison?: ComparisonMode;
  tests: { args: unknown[]; expected: unknown }[];
};

// Topic files contain only problem content. The catalog builds default JS starters.
export type ProblemDefinition = Omit<CodingProblem, "starterCode"> & {
  starterCode?: string;
};

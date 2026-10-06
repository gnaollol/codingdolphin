import { problemDefinitions } from "./problem-sets/index";
export { problemDefinitions } from "./problem-sets/index";
import type { CodingProblem, ProblemDefinition } from "./coding-types";

// Keep existing imports working throughout the app.
export type {
  CodingProblem,
  ProblemSignature,
  ValueType,
} from "./coding-types";

function buildDefaultStarter(problem: ProblemDefinition): string {
  if (problem.starterCode) return problem.starterCode;

  const parameters =
    problem.signature?.parameters.map(([name]) => name).join(", ") ?? "";
  return `function ${problem.functionName}(${parameters}) {\n  // Write your solution here.\n  \n}`;
}

export const codingProblems: CodingProblem[] = problemDefinitions.map(
  (problem) => ({
    ...problem,
    starterCode: buildDefaultStarter(problem),
  }),
);

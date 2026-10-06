export const codingLanguages = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
] as const;

export type CodingLanguage = (typeof codingLanguages)[number];
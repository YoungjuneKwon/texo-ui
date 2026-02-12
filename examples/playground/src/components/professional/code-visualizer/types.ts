export interface CodeVisualizerAttributes {
  type?: 'regex' | 'sql';
  code?: string;
  title?: string;
  testCases?: Array<{ input: string; expected: boolean }>;
}

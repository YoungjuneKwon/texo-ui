import type { Scenario } from '../../utils/stream-simulator';

export const codeVizScenario: Scenario = {
  id: 'code-viz',
  name: 'Code Visualizer',
  category: 'pro',
  systemPrompt: 'Generate regex visualization and test runner.',
  content: `Inspect this regex.\n\n::: code-visualizer\ntype: "regex"\ncode: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$"\ntitle: "Email regex"\ntestCases:\n  - input: "user@example.com"\n    expected: true\n  - input: "bad-email"\n    expected: false\n:::`,
};

import type { Scenario } from '../../utils/stream-simulator';

export const decisionScenario: Scenario = {
  id: 'decision',
  name: 'Decision Matrix',
  category: 'pro',
  systemPrompt: 'Generate weighted decision matrix UI.',
  content: `Compare options by weighted criteria.\n\n::: decision-matrix\ntitle: "Job Offer Matrix"\ncriteria:\n  - name: "Salary"\n    weight: 0.4\n  - name: "Commute"\n    weight: 0.3\n    inverse: true\n  - name: "Growth"\n    weight: 0.3\noptions:\n  - name: "A Corp"\n    scores:\n      Salary: 9\n      Commute: 7\n      Growth: 8\n  - name: "B Corp"\n    scores:\n      Salary: 8\n      Commute: 4\n      Growth: 9\n:::`,
};

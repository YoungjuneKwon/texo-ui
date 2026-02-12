import type { Scenario } from '../../utils/stream-simulator';

export const chartScenario: Scenario = {
  id: 'chart',
  name: 'Interactive Chart',
  category: 'data',
  systemPrompt: 'Generate an interactive chart with drilldown.',
  content: `Explore monthly revenue.\n\n::: interactive-chart\ntitle: "Monthly Revenue"\ntype: "bar"\ndata:\n  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]\n  datasets:\n    - label: "Revenue"\n      values: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3200]\n      color: "#4F46E5"\ndrilldown: true\ncurrency: "KRW"\n:::`,
};

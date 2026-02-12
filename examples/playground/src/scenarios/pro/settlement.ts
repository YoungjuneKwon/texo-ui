import type { Scenario } from '../../utils/stream-simulator';

export const settlementScenario: Scenario = {
  id: 'settlement',
  name: 'Settlement Calculator',
  category: 'pro',
  systemPrompt: 'Generate a weighted settlement calculator.',
  content: `Split dinner bill with conditions.\n\n::: settlement-calculator\ntitle: "Dinner Settlement"\ntotalAmount: 480000\ncurrency: "KRW"\nparticipants:\n  - name: "Alex"\n    conditions: ["drink"]\n  - name: "Blair"\n    conditions: []\n  - name: "Casey"\n    conditions: ["late"]\nrules:\n  - condition: "drink"\n    multiplier: 1.5\n  - condition: "late"\n    multiplier: 0.7\n:::`,
};

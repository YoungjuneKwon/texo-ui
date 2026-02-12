import type { Scenario } from '../../utils/stream-simulator';

export const tarotScenario: Scenario = {
  id: 'tarot',
  name: 'Tarot Reading',
  category: 'casual',
  systemPrompt: 'Generate an interactive tarot pick and reveal.',
  content: `Pick your destiny cards.\n\n::: tarot-deck\nmode: "reveal"\ncardCount: 3\nspread: "three-card"\ncards:\n  - name: "The Fool"\n    number: 0\n    reversed: false\n    meaning: "A fresh start"\n  - name: "The Tower"\n    number: 16\n    reversed: true\n    meaning: "Sudden change"\n  - name: "The Star"\n    number: 17\n    reversed: false\n    meaning: "Hope ahead"\n:::`,
};

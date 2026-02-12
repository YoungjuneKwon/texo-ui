import type { Scenario } from '../../utils/stream-simulator';

export const tournamentScenario: Scenario = {
  id: 'tournament',
  name: 'Lunch Tournament',
  category: 'casual',
  systemPrompt: 'Generate an engaging lunch tournament bracket.',
  content: `Let us decide lunch with a quick tournament.\n\n::: tournament-bracket\ntitle: "Lunch World Cup"\nitems:\n  - "Jajangmyeon"\n  - "Jjamppong"\n  - "Sushi"\n  - "Kimchi Stew"\n  - "Tteokbokki"\n  - "Bibimbap"\n  - "Pork Cutlet"\n  - "Kalguksu"\n:::`,
  chunkDelay: 30,
  chunkSize: 5,
};

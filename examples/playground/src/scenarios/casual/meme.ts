import type { Scenario } from '../../utils/stream-simulator';

export const memeScenario: Scenario = {
  id: 'meme',
  name: 'Meme Editor',
  category: 'casual',
  systemPrompt: 'Generate a meme editing interface with text overlays.',
  content: `Build a meme from this template.\n\n::: meme-editor\nbackgroundImage: "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=800"\nwidth: 600\nheight: 400\ntextBoxes:\n  - text: "WHEN BUILD PASSES"\n    position: "top"\n    fontSize: 30\n    color: "#FFFFFF"\n  - text: "ON FRIDAY EVENING"\n    position: "bottom"\n    fontSize: 30\n    color: "#FFFFFF"\n:::`,
};

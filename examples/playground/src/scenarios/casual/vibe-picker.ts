import type { Scenario } from '../../utils/stream-simulator';

export const vibePickerScenario: Scenario = {
  id: 'vibe-picker',
  name: 'Vibe Picker',
  category: 'casual',
  systemPrompt: 'Generate an image based preference picker.',
  content: `Choose your design vibe.\n\n::: image-picker\nmode: "multi-select"\nmaxSelect: 3\ntitle: "Select your vibe"\noptions:\n  - id: "minimal"\n    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400"\n    label: "Minimal"\n  - id: "vintage"\n    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400"\n    label: "Vintage"\n  - id: "modern"\n    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400"\n    label: "Modern"\n  - id: "natural"\n    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400"\n    label: "Natural"\n:::`,
};

import type { Scenario } from '../../utils/stream-simulator';

export const inventoryScenario: Scenario = {
  id: 'inventory',
  name: 'RPG Inventory',
  category: 'casual',
  systemPrompt: 'Generate a drag-and-drop RPG inventory.',
  content: `Manage your inventory.\n\n::: inventory-grid\ncolumns: 4\nslots: 16\nitems:\n  - id: "potion"\n    name: "Health Potion"\n    icon: "🧪"\n    quantity: 3\n    rarity: "common"\n    description: "HP +50"\n    slot: 0\n  - id: "sword"\n    name: "Flame Sword"\n    icon: "⚔️"\n    quantity: 1\n    rarity: "legendary"\n    description: "ATK +120"\n    slot: 1\nactions:\n  - "use"\n  - "drop"\n  - "inspect"\n:::`,
};

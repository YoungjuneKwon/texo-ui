import type { Scenario } from '../../utils/stream-simulator';

export const dashboardScenario: Scenario = {
  id: 'dashboard',
  name: 'Auto Dashboard',
  category: 'data',
  systemPrompt: 'Generate auto-dashboard from JSON data.',
  content: `Make this JSON readable.\n\n::: auto-dashboard\ntitle: "User Dashboard"\ndata:\n  - id: 1\n    name: "Kim"\n    email: "kim@example.com"\n    avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120"\n    status: "active"\n    joinDate: "2024-03-15"\n    revenue: 1250000\n    color: "#FF5733"\n  - id: 2\n    name: "Lee"\n    email: "lee@example.com"\n    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120"\n    status: "inactive"\n    joinDate: "2023-11-20"\n    revenue: 850000\n    color: "#33FF57"\n:::`,
};

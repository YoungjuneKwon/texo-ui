import type { Scenario } from '../../utils/stream-simulator';

export const apiClientScenario: Scenario = {
  id: 'api-client',
  name: 'API Client',
  category: 'pro',
  systemPrompt: 'Generate an API request form for testing endpoints.',
  content: `Test endpoint quickly.\n\n::: api-request-form\ntitle: "User API Test"\nbaseUrl: "https://jsonplaceholder.typicode.com"\nmethod: "GET"\npath: "/posts/1"\nheaders:\n  Content-Type: "application/json"\n:::`,
};

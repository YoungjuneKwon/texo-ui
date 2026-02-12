import type { Scenario } from '../../utils/stream-simulator';

export const formScenario: Scenario = {
  id: 'form',
  name: 'Dynamic Form',
  category: 'data',
  systemPrompt: 'Generate condition-aware dynamic form from schema.',
  content: `Fill in this pre-personalized form.\n\n::: dynamic-form\ntitle: "Insurance Claim"\ndescription: "Fields are prefilled from conversation."\nsections:\n  - title: "Basic"\n    fields:\n      - name: "fullName"\n        label: "Name"\n        type: "text"\n        value: "Kim Chulsoo"\n        readonly: true\n      - name: "incidentType"\n        label: "Incident Type"\n        type: "select"\n        options: ["Traffic", "Fire", "Theft"]\n        value: "Traffic"\n  - title: "Hospital"\n    condition: "incidentType === 'Traffic'"\n    fields:\n      - name: "hospital"\n        label: "Hospital"\n        type: "text"\nvalidation:\n  required: ["fullName", "incidentType"]\n:::`,
};

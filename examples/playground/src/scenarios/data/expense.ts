import type { Scenario } from '../../utils/stream-simulator';

export const expenseScenario: Scenario = {
  id: 'expense',
  name: 'Expense Tracker',
  category: 'data',
  systemPrompt: 'Generate BYOS expense list connected to storage adapters.',
  content: `Track your spending.\n\n::: expense-list\ntitle: "Expense Ledger"\nsource: "local-storage"\ncollection: "expenses"\ncolumns:\n  - field: "date"\n    label: "Date"\n    type: "date"\n  - field: "category"\n    label: "Category"\n    type: "select"\n    options: ["Food", "Transport", "Shopping", "Other"]\n  - field: "amount"\n    label: "Amount"\n    type: "number"\n  - field: "memo"\n    label: "Memo"\n    type: "text"\nsummary:\n  - type: "sum"\n    field: "amount"\n    label: "Total"\n  - type: "average"\n    field: "amount"\n    label: "Average"\n:::`,
};

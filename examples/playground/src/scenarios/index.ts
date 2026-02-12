import { inventoryScenario } from './casual/inventory';
import { memeScenario } from './casual/meme';
import { tarotScenario } from './casual/tarot';
import { tournamentScenario } from './casual/tournament';
import { vibePickerScenario } from './casual/vibe-picker';
import { chartScenario } from './data/chart';
import { dashboardScenario } from './data/dashboard';
import { expenseScenario } from './data/expense';
import { formScenario } from './data/form';
import { apiClientScenario } from './pro/api-client';
import { codeVizScenario } from './pro/code-viz';
import { decisionScenario } from './pro/decision';
import { settlementScenario } from './pro/settlement';
import type { Scenario } from '../utils/stream-simulator';

export const allScenarios: Scenario[] = [
  tournamentScenario,
  tarotScenario,
  memeScenario,
  vibePickerScenario,
  inventoryScenario,
  apiClientScenario,
  codeVizScenario,
  decisionScenario,
  settlementScenario,
  dashboardScenario,
  chartScenario,
  formScenario,
  expenseScenario,
];

export function scenariosByCategory(category: Scenario['category']): Scenario[] {
  return allScenarios.filter((scenario) => scenario.category === category);
}

export function findScenario(category: Scenario['category'], id: string): Scenario | undefined {
  return allScenarios.find((scenario) => scenario.category === category && scenario.id === id);
}

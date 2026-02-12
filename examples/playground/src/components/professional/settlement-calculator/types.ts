export interface SettlementParticipant {
  name: string;
  conditions: string[];
}

export interface SettlementRule {
  condition: string;
  multiplier: number;
}

export interface SettlementAttributes {
  title?: string;
  totalAmount: number;
  currency?: string;
  participants: SettlementParticipant[];
  rules: SettlementRule[];
}

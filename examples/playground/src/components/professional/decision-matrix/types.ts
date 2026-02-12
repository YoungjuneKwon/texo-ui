export interface MatrixCriterion {
  name: string;
  weight: number;
  inverse?: boolean;
}

export interface MatrixOption {
  name: string;
  scores: Record<string, number>;
}

export interface DecisionMatrixAttributes {
  title?: string;
  criteria: MatrixCriterion[];
  options: MatrixOption[];
}

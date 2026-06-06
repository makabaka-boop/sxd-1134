export interface GameParams {
  mealCount: number;
  deliveryBatches: number;
  volunteerGroups: number;
  riskThreshold: number;
}

export interface Metrics {
  coverageRate: number;
  waitTime: number;
  wasteRate: number;
  workPressure: number;
}

export interface RiskItem {
  id: string;
  name: string;
  value: number;
  threshold: number;
  isOverThreshold: boolean;
  deduction: number;
  level: 'low' | 'medium' | 'high';
}

export interface Solution {
  id: string;
  name: string;
  params: GameParams;
  metrics: Metrics;
  score: number;
  riskDeduction: number;
  createdAt: number;
}

export interface GameState {
  params: GameParams;
  metrics: Metrics;
  risks: RiskItem[];
  solutions: Solution[];
  currentScore: number;
  riskDeduction: number;
  showSettlement: boolean;
  selectedSolutions: string[];
}

export interface GameActions {
  setParams: (params: Partial<GameParams>) => void;
  saveSolution: (name: string) => void;
  deleteSolution: (id: string) => void;
  loadSolution: (id: string) => void;
  toggleSolutionSelection: (id: string) => void;
  toggleSettlement: () => void;
  recalculate: () => void;
}

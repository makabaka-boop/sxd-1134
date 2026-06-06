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

export interface OptimizationSuggestion {
  id: string;
  category: 'parameter' | 'risk' | 'metric';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ReportSummary {
  scoreDiff: number;
  weakMetrics: string[];
  riskAlerts: string[];
}

export interface Report {
  id: string;
  name: string;
  params: GameParams;
  metrics: Metrics;
  risks: RiskItem[];
  score: number;
  riskDeduction: number;
  suggestions: OptimizationSuggestion[];
  summary?: ReportSummary;
  createdAt: number;
}

export interface GameState {
  params: GameParams;
  metrics: Metrics;
  risks: RiskItem[];
  solutions: Solution[];
  reports: Report[];
  currentScore: number;
  riskDeduction: number;
  showSettlement: boolean;
  showReportModal: boolean;
  showReportList: boolean;
  selectedReport: Report | null;
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
  generateReport: (name: string) => void;
  deleteReport: (id: string) => void;
  loadReportParams: (id: string) => void;
  toggleReportModal: () => void;
  toggleReportList: () => void;
  setSelectedReport: (report: Report | null) => void;
}

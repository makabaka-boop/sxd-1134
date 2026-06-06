import { create } from 'zustand';
import type { GameState, GameActions, Solution, Report } from '@/types';
import { DEFAULT_PARAMS } from '@/utils/constants';
import {
  calculateMetrics,
  calculateRisks,
  calculateScore,
  generateSuggestions,
  generateReportSummary,
} from '@/utils/calculator';

const SOLUTIONS_KEY = 'meal_delivery_solutions';
const REPORTS_KEY = 'meal_delivery_reports';
const LAST_PARAMS_KEY = 'meal_delivery_last_params';

function loadSolutions(): Solution[] {
  try {
    const data = localStorage.getItem(SOLUTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSolutions(solutions: Solution[]) {
  try {
    localStorage.setItem(SOLUTIONS_KEY, JSON.stringify(solutions));
  } catch (e) {
    console.error('Failed to save solutions:', e);
  }
}

function loadReports(): Report[] {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveReports(reports: Report[]) {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports:', e);
  }
}

function loadLastParams() {
  try {
    const data = localStorage.getItem(LAST_PARAMS_KEY);
    return data ? JSON.parse(data) : DEFAULT_PARAMS;
  } catch {
    return DEFAULT_PARAMS;
  }
}

function saveLastParams(params: GameState['params']) {
  try {
    localStorage.setItem(LAST_PARAMS_KEY, JSON.stringify(params));
  } catch (e) {
    console.error('Failed to save last params:', e);
  }
}

const initialParams = loadLastParams();
const initialMetrics = calculateMetrics(initialParams);
const initialRisks = calculateRisks(initialMetrics, initialParams.riskThreshold);
const initialScoreResult = calculateScore(
  initialMetrics,
  initialRisks
);

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  params: initialParams,
  metrics: initialMetrics,
  risks: initialRisks,
  solutions: loadSolutions(),
  reports: loadReports(),
  currentScore: initialScoreResult.score,
  riskDeduction: initialScoreResult.riskDeduction,
  showSettlement: false,
  showReportModal: false,
  showReportList: false,
  selectedReport: null,
  selectedSolutions: [],

  setParams: (newParams) => {
    set((state) => {
      const updatedParams = { ...state.params, ...newParams };
      const metrics = calculateMetrics(updatedParams);
      const risks = calculateRisks(metrics, updatedParams.riskThreshold);
      const { score, riskDeduction } = calculateScore(
        metrics,
        risks
      );
      saveLastParams(updatedParams);
      return {
        params: updatedParams,
        metrics,
        risks,
        currentScore: score,
        riskDeduction,
      };
    });
  },

  recalculate: () => {
    set((state) => {
      const metrics = calculateMetrics(state.params);
      const risks = calculateRisks(metrics, state.params.riskThreshold);
      const { score, riskDeduction } = calculateScore(
        metrics,
        risks
      );
      return { metrics, risks, currentScore: score, riskDeduction };
    });
  },

  saveSolution: (name) => {
    set((state) => {
      const newSolution: Solution = {
        id: Date.now().toString(),
        name,
        params: { ...state.params },
        metrics: { ...state.metrics },
        score: state.currentScore,
        riskDeduction: state.riskDeduction,
        createdAt: Date.now(),
      };
      const updatedSolutions = [...state.solutions, newSolution];
      saveSolutions(updatedSolutions);
      return { solutions: updatedSolutions };
    });
  },

  deleteSolution: (id) => {
    set((state) => {
      const updatedSolutions = state.solutions.filter((s) => s.id !== id);
      saveSolutions(updatedSolutions);
      return {
        solutions: updatedSolutions,
        selectedSolutions: state.selectedSolutions.filter((s) => s !== id),
      };
    });
  },

  loadSolution: (id) => {
    const solution = get().solutions.find((s) => s.id === id);
    if (solution) {
      get().setParams(solution.params);
    }
  },

  toggleSolutionSelection: (id) => {
    set((state) => {
      const isSelected = state.selectedSolutions.includes(id);
      return {
        selectedSolutions: isSelected
          ? state.selectedSolutions.filter((s) => s !== id)
          : [...state.selectedSolutions, id],
      };
    });
  },

  toggleSettlement: () => {
    set((state) => ({ showSettlement: !state.showSettlement }));
  },

  generateReport: (name) => {
    set((state) => {
      const suggestions = generateSuggestions(state.params, state.metrics, state.risks);
      const newReport: Report = {
        id: Date.now().toString(),
        name,
        params: { ...state.params },
        metrics: { ...state.metrics },
        risks: [...state.risks],
        score: state.currentScore,
        riskDeduction: state.riskDeduction,
        suggestions,
        createdAt: Date.now(),
      };
      const summary = generateReportSummary(newReport, state.reports);
      newReport.summary = summary;
      const updatedReports = [...state.reports, newReport];
      saveReports(updatedReports);
      return { reports: updatedReports, selectedReport: newReport, showReportModal: true };
    });
  },

  deleteReport: (id) => {
    set((state) => {
      const updatedReports = state.reports.filter((r) => r.id !== id);
      saveReports(updatedReports);
      return {
        reports: updatedReports,
        selectedReport: state.selectedReport?.id === id ? null : state.selectedReport,
      };
    });
  },

  loadReportParams: (id) => {
    const report = get().reports.find((r) => r.id === id);
    if (report) {
      get().setParams(report.params);
    }
  },

  toggleReportModal: () => {
    set((state) => ({ showReportModal: !state.showReportModal }));
  },

  toggleReportList: () => {
    set((state) => ({ showReportList: !state.showReportList }));
  },

  setSelectedReport: (report) => {
    set({ selectedReport: report, showReportModal: report !== null });
  },
}));

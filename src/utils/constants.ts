import type { GameParams, Metrics, RiskItem } from '@/types';

export const DEFAULT_PARAMS: GameParams = {
  mealCount: 250,
  deliveryBatches: 4,
  volunteerGroups: 5,
  riskThreshold: 50,
};

export const PARAM_RANGES = {
  mealCount: { min: 50, max: 500, step: 10 },
  deliveryBatches: { min: 1, max: 8, step: 1 },
  volunteerGroups: { min: 2, max: 10, step: 1 },
  riskThreshold: { min: 0, max: 100, step: 1 },
};

export const BASE_DEMAND = 300;

export const RISK_THRESHOLDS = {
  coverageRate: 60,
  waitTime: 40,
  wasteRate: 30,
  workPressure: 70,
};

export const DEDUCTION_RULES = {
  coverageRate: 15,
  waitTime: 10,
  wasteRate: 15,
  workPressure: 10,
  overThreshold: 5,
};

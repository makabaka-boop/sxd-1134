import type { GameParams, Metrics, RiskItem } from '@/types';
import { BASE_DEMAND, RISK_THRESHOLDS, DEDUCTION_RULES } from './constants';

export function calculateMetrics(params: GameParams): Metrics {
  const { mealCount, deliveryBatches, volunteerGroups } = params;

  const coverageRate = Math.min(
    100,
    Math.round((mealCount / BASE_DEMAND) * 60 + deliveryBatches * 5)
  );

  const waitTime = Math.max(
    5,
    Math.round(60 - deliveryBatches * 5 - volunteerGroups * 2)
  );

  const wasteRate = Math.max(
    0,
    Math.round((mealCount - 200) * 0.15 + (8 - deliveryBatches) * 3)
  );

  const workPressure = Math.max(
    0,
    Math.round(volunteerGroups * 8 + deliveryBatches * 6 - 20)
  );

  return {
    coverageRate,
    waitTime,
    wasteRate,
    workPressure,
  };
}

function calculateBaseRiskValue(metrics: Metrics): number {
  let overCount = 0;
  let totalDeduction = 0;

  if (metrics.coverageRate < RISK_THRESHOLDS.coverageRate) {
    overCount++;
    totalDeduction += DEDUCTION_RULES.coverageRate;
  }
  if (metrics.waitTime > RISK_THRESHOLDS.waitTime) {
    overCount++;
    totalDeduction += DEDUCTION_RULES.waitTime;
  }
  if (metrics.wasteRate > RISK_THRESHOLDS.wasteRate) {
    overCount++;
    totalDeduction += DEDUCTION_RULES.wasteRate;
  }
  if (metrics.workPressure > RISK_THRESHOLDS.workPressure) {
    overCount++;
    totalDeduction += DEDUCTION_RULES.workPressure;
  }

  return Math.min(100, overCount * 25 + totalDeduction * 0.8);
}

export function calculateRisks(
  metrics: Metrics,
  riskThreshold: number
): RiskItem[] {
  const risks: RiskItem[] = [];
  const baseRiskValue = calculateBaseRiskValue(metrics);

  risks.push({
    id: 'coverageRate',
    name: '覆盖率不足',
    value: metrics.coverageRate,
    threshold: RISK_THRESHOLDS.coverageRate,
    isOverThreshold: metrics.coverageRate < RISK_THRESHOLDS.coverageRate,
    deduction:
      metrics.coverageRate < RISK_THRESHOLDS.coverageRate
        ? DEDUCTION_RULES.coverageRate
        : 0,
    level:
      metrics.coverageRate < RISK_THRESHOLDS.coverageRate ? 'high' : 'low',
  });

  risks.push({
    id: 'waitTime',
    name: '等待时长过长',
    value: metrics.waitTime,
    threshold: RISK_THRESHOLDS.waitTime,
    isOverThreshold: metrics.waitTime > RISK_THRESHOLDS.waitTime,
    deduction:
      metrics.waitTime > RISK_THRESHOLDS.waitTime
        ? DEDUCTION_RULES.waitTime
        : 0,
    level:
      metrics.waitTime > RISK_THRESHOLDS.waitTime ? 'medium' : 'low',
  });

  risks.push({
    id: 'wasteRate',
    name: '餐食浪费',
    value: metrics.wasteRate,
    threshold: RISK_THRESHOLDS.wasteRate,
    isOverThreshold: metrics.wasteRate > RISK_THRESHOLDS.wasteRate,
    deduction:
      metrics.wasteRate > RISK_THRESHOLDS.wasteRate
        ? DEDUCTION_RULES.wasteRate
        : 0,
    level:
      metrics.wasteRate > RISK_THRESHOLDS.wasteRate ? 'high' : 'low',
  });

  risks.push({
    id: 'workPressure',
    name: '人力压力过大',
    value: metrics.workPressure,
    threshold: RISK_THRESHOLDS.workPressure,
    isOverThreshold: metrics.workPressure > RISK_THRESHOLDS.workPressure,
    deduction:
      metrics.workPressure > RISK_THRESHOLDS.workPressure
        ? DEDUCTION_RULES.workPressure
        : 0,
    level:
      metrics.workPressure > RISK_THRESHOLDS.workPressure
        ? 'medium'
        : 'low',
  });

  risks.push({
    id: 'overRiskThreshold',
    name: '综合风险超阈值',
    value: Math.round(baseRiskValue),
    threshold: riskThreshold,
    isOverThreshold: baseRiskValue > riskThreshold,
    deduction:
      baseRiskValue > riskThreshold ? DEDUCTION_RULES.overThreshold : 0,
    level: baseRiskValue > riskThreshold ? 'high' : 'low',
  });

  return risks;
}

export function calculateRiskValue(risks: RiskItem[]): number {
  const filteredRisks = risks.filter((r) => r.id !== 'overRiskThreshold');
  const overCount = filteredRisks.filter((r) => r.isOverThreshold).length;
  const totalDeduction = filteredRisks.reduce((sum, r) => sum + r.deduction, 0);
  return Math.min(100, overCount * 25 + totalDeduction * 0.8);
}

export function calculateScore(
  metrics: Metrics,
  risks: RiskItem[]
): { score: number; riskDeduction: number } {
  const baseScore =
    metrics.coverageRate * 0.3 +
    (60 - metrics.waitTime) * 0.25 +
    (100 - metrics.wasteRate) * 0.25 +
    (100 - metrics.workPressure) * 0.2;

  const riskDeduction = risks.reduce((sum, r) => sum + r.deduction, 0);

  const finalScore = Math.max(0, Math.round(baseScore - riskDeduction));

  return {
    score: finalScore,
    riskDeduction,
  };
}

export function getScoreGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: 'S', color: 'text-amber-500' };
  if (score >= 80) return { grade: 'A', color: 'text-green-500' };
  if (score >= 70) return { grade: 'B', color: 'text-teal-500' };
  if (score >= 60) return { grade: 'C', color: 'text-blue-500' };
  if (score >= 40) return { grade: 'D', color: 'text-orange-500' };
  return { grade: 'F', color: 'text-red-500' };
}

import type { GameParams, Metrics, RiskItem, OptimizationSuggestion, ReportSummary, Report } from '@/types';
import { BASE_DEMAND, RISK_THRESHOLDS, DEDUCTION_RULES, PARAM_RANGES } from './constants';

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

export function generateSuggestions(
  params: GameParams,
  metrics: Metrics,
  risks: RiskItem[]
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  let idCounter = 0;

  if (metrics.coverageRate < 70) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'parameter',
      title: '提升备餐数量',
      description: `当前覆盖率仅为${metrics.coverageRate}%，建议增加备餐数量至${Math.min(500, params.mealCount + 50)}份以提升服务覆盖范围。`,
      impact: 'high',
    });
  }

  if (metrics.waitTime > 40) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'parameter',
      title: '增加配送批次',
      description: `等待时长${metrics.waitTime}分钟过长，建议将配送批次从${params.deliveryBatches}次增加至${Math.min(8, params.deliveryBatches + 2)}次以减少等待。`,
      impact: 'high',
    });
  }

  if (metrics.wasteRate > 25) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'parameter',
      title: '优化备餐数量',
      description: `浪费率达${metrics.wasteRate}%，建议适当减少备餐数量或增加配送批次以降低餐食浪费。`,
      impact: 'medium',
    });
  }

  if (metrics.workPressure > 60) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'parameter',
      title: '增加志愿者分组',
      description: `人力压力指数${metrics.workPressure}过高，建议将志愿者分组从${params.volunteerGroups}组增加至${Math.min(10, params.volunteerGroups + 2)}组以分担工作压力。`,
      impact: 'medium',
    });
  }

  const coverageRisk = risks.find(r => r.id === 'coverageRate');
  if (coverageRisk?.isOverThreshold) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'risk',
      title: '解决覆盖率不足风险',
      description: `覆盖率低于阈值${RISK_THRESHOLDS.coverageRate}%，已产生${coverageRisk.deduction}分扣分，请优先提升备餐数量和配送批次。`,
      impact: 'high',
    });
  }

  const wasteRisk = risks.find(r => r.id === 'wasteRate');
  if (wasteRisk?.isOverThreshold) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'risk',
      title: '控制餐食浪费风险',
      description: `浪费率超过阈值${RISK_THRESHOLDS.wasteRate}%，已产生${wasteRisk.deduction}分扣分，建议精细化备餐管理。`,
      impact: 'medium',
    });
  }

  const overRiskThreshold = risks.find(r => r.id === 'overRiskThreshold');
  if (overRiskThreshold?.isOverThreshold) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'risk',
      title: '降低综合风险值',
      description: `综合风险值${overRiskThreshold.value}超过当前阈值${params.riskThreshold}，已额外扣分，请综合优化各项参数。`,
      impact: 'high',
    });
  }

  if (metrics.coverageRate >= 85 && metrics.waitTime <= 25 && metrics.wasteRate <= 15) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'metric',
      title: '保持优秀运营状态',
      description: '当前各项指标表现优秀，请继续保持，并可尝试微调参数以追求更高得分。',
      impact: 'low',
    });
  }

  if (params.volunteerGroups === PARAM_RANGES.volunteerGroups.max && metrics.workPressure > 40) {
    suggestions.push({
      id: `sugg_${idCounter++}`,
      category: 'parameter',
      title: '志愿者资源已达上限',
      description: '志愿者分组已达最大配置，建议通过优化配送批次来进一步降低人力压力。',
      impact: 'medium',
    });
  }

  return suggestions;
}

export function generateReportSummary(
  currentReport: Pick<Report, 'score' | 'metrics' | 'risks'>,
  reports: Report[]
): ReportSummary {
  const sortedReports = [...reports].sort((a, b) => b.score - a.score);
  const bestReport = sortedReports[0];

  const scoreDiff = bestReport ? currentReport.score - bestReport.score : 0;

  const weakMetrics: string[] = [];
  if (currentReport.metrics.coverageRate < 70) weakMetrics.push('覆盖率');
  if (currentReport.metrics.waitTime > 40) weakMetrics.push('等待时长');
  if (currentReport.metrics.wasteRate > 25) weakMetrics.push('浪费率');
  if (currentReport.metrics.workPressure > 60) weakMetrics.push('人力压力');

  const riskAlerts = currentReport.risks
    .filter(r => r.isOverThreshold)
    .map(r => r.name);

  return {
    scoreDiff,
    weakMetrics,
    riskAlerts,
  };
}

export function getBestReport(reports: Report[]): Report | null {
  if (reports.length === 0) return null;
  return [...reports].sort((a, b) => b.score - a.score)[0];
}

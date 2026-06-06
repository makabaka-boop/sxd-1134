import { X, Star, Award } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { RadarChart } from './RadarChart';
import { getScoreGrade } from '@/utils/calculator';

export function SettlementModal() {
  const { showSettlement, toggleSettlement, metrics, currentScore, riskDeduction, params } =
    useGameStore();

  const { grade, color } = getScoreGrade(currentScore);

  if (!showSettlement) return null;

  const scoreBreakdown = [
    { label: '覆盖率贡献', value: Math.round(metrics.coverageRate * 0.3) },
    { label: '等待时长贡献', value: Math.round((60 - metrics.waitTime) * 0.25) },
    { label: '浪费率贡献', value: Math.round((100 - metrics.wasteRate) * 0.25) },
    { label: '人力压力贡献', value: Math.round((100 - metrics.workPressure) * 0.2) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleSettlement}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={toggleSettlement}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 rounded-full text-teal-600 text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              结算面板 · 审计权限
            </div>
            <h2 className="text-2xl font-bold text-gray-800">方案结算</h2>
            <p className="text-gray-500 text-sm mt-1">最终得分与评估报告</p>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{currentScore}</div>
                  <div className="text-xs text-teal-100">分</div>
                </div>
              </div>
              <div
                className={`absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold ${color}`}
              >
                {grade}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    currentScore >= (i + 1) * 20
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <RadarChart metrics={metrics} size={220} />
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-600">得分明细</h3>

            <div className="grid grid-cols-2 gap-3">
              {scoreBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="p-3 bg-gray-50 rounded-xl"
                >
                  <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-gray-800">+{item.value}</div>
                </div>
              ))}
            </div>

            {riskDeduction > 0 && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">风险扣分</span>
                  <span className="text-lg font-bold text-red-600">
                    -{riskDeduction}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-medium text-gray-600 mb-3">参数配置</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">备餐数量</span>
                <span className="font-medium text-gray-700">{params.mealCount} 份</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">配送批次</span>
                <span className="font-medium text-gray-700">{params.deliveryBatches} 次</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">志愿者分组</span>
                <span className="font-medium text-gray-700">{params.volunteerGroups} 组</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">风险阈值</span>
                <span className="font-medium text-gray-700">{params.riskThreshold}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

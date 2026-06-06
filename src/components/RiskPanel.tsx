import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { calculateRiskValue } from '@/utils/calculator';

export function RiskPanel() {
  const { risks, params } = useGameStore();
  const riskValue = calculateRiskValue(risks);
  const overThresholdCount = risks.filter((r) => r.isOverThreshold).length;
  const overRiskThreshold = risks.find((r) => r.id === 'overRiskThreshold');

  const getRiskLevel = () => {
    if (riskValue >= 70)
      return { label: '高风险', color: 'red', icon: AlertTriangle };
    if (riskValue >= 40)
      return { label: '中风险', color: 'orange', icon: AlertCircle };
    return { label: '低风险', color: 'green', icon: CheckCircle };
  };

  const riskLevel = getRiskLevel();

  const levelColors: Record<string, { bg: string; text: string; border: string }> = {
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
    },
  };

  const levelColor = levelColors[riskLevel.color];
  const RiskIcon = riskLevel.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 ${levelColor.bg} rounded-xl flex items-center justify-center`}>
          <RiskIcon className={`w-5 h-5 ${levelColor.text}`} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">风险提示</h2>
          <p className="text-sm text-gray-500">提示面板权限 · 仅查看</p>
        </div>
      </div>

      <div className={`p-4 rounded-xl ${levelColor.bg} border ${levelColor.border} mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${levelColor.text.replace('text-', 'bg-')} animate-pulse`}
            />
            <span className={`font-bold ${levelColor.text}`}>
              {riskLevel.label}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {overThresholdCount} 项异常
          </span>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">综合风险值</span>
            <span className={`font-medium ${levelColor.text}`}>{Math.round(riskValue)}</span>
          </div>
          <div className="h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${levelColor.text.replace('text-', 'bg-')}`}
              style={{ width: `${riskValue}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Info className="w-4 h-4" />
          风险详情
        </h3>

        {risks.map((risk) => (
          <div
            key={risk.id}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              risk.isOverThreshold
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {risk.isOverThreshold ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    risk.isOverThreshold ? 'text-red-700' : 'text-gray-600'
                  }`}
                >
                  {risk.name}
                </span>
              </div>
              <span
                className={`text-sm font-bold ${
                  risk.isOverThreshold ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {risk.value}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-gray-400">
                阈值: {risk.threshold}
              </span>
              {risk.deduction > 0 && (
                <span className="text-red-500 font-medium">
                  扣 {risk.deduction} 分
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-xs font-medium text-gray-500 mb-2">扣分规则</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• 覆盖率低于 60%：扣 15 分</li>
          <li>• 等待时长超过 40 分钟：扣 10 分</li>
          <li>• 浪费率超过 30%：扣 15 分</li>
          <li>• 人力压力超过 70：扣 10 分</li>
          <li
            className={
              overRiskThreshold?.isOverThreshold
                ? 'text-red-500 font-medium'
                : 'text-gray-400'
            }
          >
            • 综合风险超过当前阈值 {params.riskThreshold}：
            {overRiskThreshold?.isOverThreshold ? '已额外扣 5 分' : '暂不扣分'}
          </li>
        </ul>
      </div>
    </div>
  );
}

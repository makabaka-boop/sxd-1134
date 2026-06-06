import {
  Target,
  Clock,
  Trash2,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function MetricsPanel() {
  const { metrics, currentScore, riskDeduction } = useGameStore();

  const metricItems = [
    {
      key: 'coverageRate',
      label: '覆盖率',
      value: metrics.coverageRate,
      unit: '%',
      icon: Target,
      color: 'green',
      inverse: false,
      goodThreshold: 70,
    },
    {
      key: 'waitTime',
      label: '等待时长',
      value: metrics.waitTime,
      unit: '分钟',
      icon: Clock,
      color: 'blue',
      inverse: true,
      goodThreshold: 30,
    },
    {
      key: 'wasteRate',
      label: '浪费率',
      value: metrics.wasteRate,
      unit: '%',
      icon: Trash2,
      color: 'orange',
      inverse: true,
      goodThreshold: 20,
    },
    {
      key: 'workPressure',
      label: '人力压力',
      value: metrics.workPressure,
      unit: '',
      icon: Users,
      color: 'purple',
      inverse: true,
      goodThreshold: 50,
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; light: string }> = {
    green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      light: 'bg-orange-50',
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      light: 'bg-purple-50',
    },
  };

  const getIsGood = (item: (typeof metricItems)[0]) => {
    return item.inverse
      ? item.value <= item.goodThreshold
      : item.value >= item.goodThreshold;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">实时指标</h2>
          <p className="text-sm text-gray-500">运营数据实时更新</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-teal-600">
            {currentScore}
          </div>
          <div className="text-xs text-gray-400">当前得分</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metricItems.map((item) => {
          const colors = colorClasses[item.color];
          const isGood = getIsGood(item);
          const percentage = Math.min(100, item.inverse ? (100 - item.value) : item.value);

          return (
            <div
              key={item.key}
              className={`p-4 rounded-xl ${colors.light} border border-${item.color}-100`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {item.label}
                </span>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {item.value}
                </span>
                <span className="text-sm text-gray-400 mb-1">{item.unit}</span>
                {isGood ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mb-1" />
                )}
              </div>

              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.bg} rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {riskDeduction > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-600">风险扣分</span>
            <span className="text-sm font-bold text-red-600">
              -{riskDeduction} 分
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

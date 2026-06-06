import { Utensils, Truck, Users, AlertTriangle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { PARAM_RANGES } from '@/utils/constants';
import { ThresholdSlider } from './ThresholdSlider';
import { calculateRiskValue } from '@/utils/calculator';

export function ParameterPanel() {
  const { params, setParams, risks } = useGameStore();
  const riskValue = calculateRiskValue(risks);

  const sliderConfig = [
    {
      key: 'mealCount' as const,
      label: '备餐数量',
      icon: Utensils,
      unit: '份',
      color: 'orange',
    },
    {
      key: 'deliveryBatches' as const,
      label: '配送批次',
      icon: Truck,
      unit: '次',
      color: 'blue',
    },
    {
      key: 'volunteerGroups' as const,
      label: '志愿者分组',
      icon: Users,
      unit: '组',
      color: 'green',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string }> = {
    orange: { bg: 'bg-orange-500', text: 'text-orange-600' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
    green: { bg: 'bg-green-500', text: 'text-green-600' },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Utensils className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">参数调节</h2>
          <p className="text-sm text-gray-500">玩家权限 · 可调整所有参数</p>
        </div>
      </div>

      <div className="space-y-6">
        {sliderConfig.map(({ key, label, icon: Icon, unit, color }) => {
          const range = PARAM_RANGES[key];
          const value = params[key];
          const percentage =
            ((value - range.min) / (range.max - range.min)) * 100;
          const colors = colorClasses[color];

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </div>
                <span className={`text-lg font-bold ${colors.text}`}>
                  {value}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    {unit}
                  </span>
                </span>
              </div>

              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${colors.bg} transition-all duration-150 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
                <input
                  type="range"
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={value}
                  onChange={(e) =>
                    setParams({ [key]: Number(e.target.value) })
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{range.min}</span>
                <span>{range.max}</span>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">
              风险预警设置
            </span>
          </div>
          <ThresholdSlider
            value={params.riskThreshold}
            onChange={(v) => setParams({ riskThreshold: v })}
            riskValue={riskValue}
          />
        </div>
      </div>
    </div>
  );
}

import { X, FileText, Target, Clock, Trash2, Users, AlertTriangle, Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getScoreGrade } from '@/utils/calculator';

export function ReportModal() {
  const { showReportModal, toggleReportModal, selectedReport } = useGameStore();

  if (!showReportModal || !selectedReport) return null;

  const { grade, color } = getScoreGrade(selectedReport.score);
  const createdDate = new Date(selectedReport.createdAt);
  const formattedDate = `${createdDate.getFullYear()}/${String(createdDate.getMonth() + 1).padStart(2, '0')}/${String(createdDate.getDate()).padStart(2, '0')} ${String(createdDate.getHours()).padStart(2, '0')}:${String(createdDate.getMinutes()).padStart(2, '0')}`;

  const metricItems = [
    { key: 'coverageRate', label: '覆盖率', value: selectedReport.metrics.coverageRate, unit: '%', icon: Target, color: 'green' },
    { key: 'waitTime', label: '等待时长', value: selectedReport.metrics.waitTime, unit: '分钟', icon: Clock, color: 'blue' },
    { key: 'wasteRate', label: '浪费率', value: selectedReport.metrics.wasteRate, unit: '%', icon: Trash2, color: 'orange' },
    { key: 'workPressure', label: '人力压力', value: selectedReport.metrics.workPressure, unit: '', icon: Users, color: 'purple' },
  ];

  const colorClasses: Record<string, { bg: string; text: string; light: string }> = {
    green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' },
  };

  const impactColors: Record<string, { bg: string; text: string; label: string }> = {
    high: { bg: 'bg-red-100', text: 'text-red-600', label: '高影响' },
    medium: { bg: 'bg-orange-100', text: 'text-orange-600', label: '中影响' },
    low: { bg: 'bg-green-100', text: 'text-green-600', label: '低影响' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleReportModal}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <button
          onClick={toggleReportModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 rounded-full text-orange-600 text-sm font-medium mb-4">
                <FileText className="w-4 h-4" />
                运营复盘报告
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedReport.name}</h2>
              <p className="text-gray-500 text-sm mt-1">生成时间：{formattedDate}</p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">
                      {selectedReport.score}
                    </div>
                    <div className="text-xs text-orange-100 mt-1">综合得分</div>
                  </div>
                </div>
                <div
                  className={`absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold ${color}`}
                >
                  {grade}
                </div>
              </div>
              {selectedReport.riskDeduction > 0 && (
                <div className="mt-4 px-4 py-1.5 bg-red-50 rounded-full text-red-600 text-sm font-medium">
                  风险扣分：-{selectedReport.riskDeduction} 分
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-500" />
                配置参数
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedReport.params.mealCount}</div>
                  <div className="text-xs text-gray-500 mt-1">备餐数量（份）</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedReport.params.deliveryBatches}</div>
                  <div className="text-xs text-gray-500 mt-1">配送批次（次）</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedReport.params.volunteerGroups}</div>
                  <div className="text-xs text-gray-500 mt-1">志愿者分组（组）</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-amber-600">{selectedReport.params.riskThreshold}</div>
                  <div className="text-xs text-gray-500 mt-1">风险阈值</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                实时指标
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {metricItems.map((item) => {
                  const colors = colorClasses[item.color];
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
                      <div className="flex items-end gap-2">
                        <span className={`text-2xl font-bold ${colors.text}`}>
                          {item.value}
                        </span>
                        <span className="text-sm text-gray-400 mb-1">{item.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                风险扣分项
              </h3>
              <div className="space-y-3">
                {selectedReport.risks.filter(r => r.isOverThreshold).length > 0 ? (
                  selectedReport.risks
                    .filter(r => r.isOverThreshold)
                    .map((risk) => (
                      <div
                        key={risk.id}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-700">
                              {risk.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-red-600">
                              -{risk.deduction} 分
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-red-600">
                          当前值：{risk.value} | 阈值：{risk.threshold}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-medium">无风险项，表现优秀！</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedReport.suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  优化建议
                </h3>
                <div className="space-y-3">
                  {selectedReport.suggestions.map((suggestion) => {
                    const impact = impactColors[suggestion.impact];
                    return (
                      <div
                        key={suggestion.id}
                        className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-800">
                                {suggestion.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${impact.bg} ${impact.text}`}>
                                {impact.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

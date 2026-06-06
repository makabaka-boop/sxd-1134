import { X, Star, Award, TrendingUp, TrendingDown, Minus, AlertTriangle, FileText, Plus } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getScoreGrade, getBestReport } from '@/utils/calculator';

export function SettlementModal() {
  const { showSettlement, toggleSettlement, currentScore, metrics, risks, reports, generateReport } =
    useGameStore();

  const { grade, color } = getScoreGrade(currentScore);
  const bestReport = getBestReport(reports);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [reportName, setReportName] = useState('');

  const scoreDiff = bestReport ? currentScore - bestReport.score : 0;

  const weakMetrics: string[] = [];
  if (metrics.coverageRate < 70) weakMetrics.push('覆盖率');
  if (metrics.waitTime > 40) weakMetrics.push('等待时长');
  if (metrics.wasteRate > 25) weakMetrics.push('浪费率');
  if (metrics.workPressure > 60) weakMetrics.push('人力压力');

  const riskAlerts = risks
    .filter(r => r.isOverThreshold)
    .map(r => r.name);

  const handleGenerate = () => {
    if (reportName.trim()) {
      generateReport(reportName.trim());
      setReportName('');
      setShowSaveInput(false);
      toggleSettlement();
    }
  };

  if (!showSettlement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleSettlement}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={toggleSettlement}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
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
            <p className="text-gray-500 text-sm mt-1">查看最终得分与复盘摘要</p>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white">
                    {currentScore}
                  </div>
                  <div className="text-sm text-teal-100 mt-1">最终得分</div>
                </div>
              </div>
              <div
                className={`absolute -top-2 -right-2 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl font-bold ${color}`}
              >
                {grade}
              </div>
            </div>

            <div className="flex items-center gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${
                    currentScore >= (i + 1) * 20
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-6 p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
            <h3 className="text-sm font-bold text-orange-800 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              本次复盘摘要
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">相对历史最佳</span>
                <div className="flex items-center gap-1">
                  {scoreDiff > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : scoreDiff < 0 ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-400" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      scoreDiff > 0
                        ? 'text-green-600'
                        : scoreDiff < 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {scoreDiff > 0 ? '+' : ''}
                    {scoreDiff} 分
                  </span>
                </div>
              </div>

              {weakMetrics.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 mb-2 block">主要短板指标</span>
                  <div className="flex flex-wrap gap-2">
                    {weakMetrics.map((metric, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {riskAlerts.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 mb-2 block flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    风险提醒
                  </span>
                  <div className="space-y-1.5">
                    {riskAlerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg"
                      >
                        • {alert}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {weakMetrics.length === 0 && riskAlerts.length === 0 && (
                <div className="text-center py-2">
                  <span className="text-sm text-green-600 font-medium">
                    🎉 各项指标表现优秀，无明显短板！
                  </span>
                </div>
              )}
            </div>
          </div>

          {!showSaveInput ? (
            <div className="space-y-3">
              <button
                onClick={() => setShowSaveInput(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md shadow-orange-200 hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                生成完整复盘报告
              </button>
              <button
                onClick={toggleSettlement}
                className="w-full px-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                返回游戏
              </button>
            </div>
          ) : (
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-sm text-orange-700 mb-3 font-medium">为本次方案生成复盘报告</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="输入报告名称..."
                  className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowSaveInput(false);
                    setReportName('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { X, Star, Award } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getScoreGrade } from '@/utils/calculator';

export function SettlementModal() {
  const { showSettlement, toggleSettlement, currentScore, riskDeduction } =
    useGameStore();

  const { grade, color } = getScoreGrade(currentScore);

  if (!showSettlement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleSettlement}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full">
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
            <p className="text-gray-500 text-sm mt-1">仅可查看最终得分</p>
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

          {riskDeduction > 0 && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
              <div className="text-sm text-red-600">
                风险扣分：<span className="font-bold">-{riskDeduction} 分</span>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={toggleSettlement}
              className="px-8 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
            >
              返回游戏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

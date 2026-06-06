import { useState } from 'react';
import {
  Save,
  Trash2,
  Play,
  GitCompare,
  Check,
  Plus,
  X,
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getScoreGrade } from '@/utils/calculator';
import type { Solution } from '@/types';

export function SolutionManager() {
  const {
    solutions,
    saveSolution,
    deleteSolution,
    loadSolution,
    toggleSolutionSelection,
    selectedSolutions,
  } = useGameStore();

  const [showSaveInput, setShowSaveInput] = useState(false);
  const [solutionName, setSolutionName] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const handleSave = () => {
    if (solutionName.trim()) {
      saveSolution(solutionName.trim());
      setSolutionName('');
      setShowSaveInput(false);
    }
  };

  const selectedSolutionData = solutions.filter((s) =>
    selectedSolutions.includes(s.id)
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">方案管理</h2>
          <p className="text-sm text-gray-500">保存与对比多套方案</p>
        </div>
        <button
          onClick={() => setShowSaveInput(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          保存方案
        </button>
      </div>

      {showSaveInput && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={solutionName}
              onChange={(e) => setSolutionName(e.target.value)}
              placeholder="输入方案名称..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowSaveInput(false);
                setSolutionName('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {solutions.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            disabled={selectedSolutions.length < 2}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedSolutions.length >= 2
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            对比选中方案 ({selectedSolutions.length}/至少2个)
          </button>
        </div>
      )}

      {showComparison && selectedSolutionData.length >= 2 && (
        <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <h3 className="text-sm font-medium text-orange-700 mb-3 flex items-center gap-2">
            <GitCompare className="w-4 h-4" />
            方案对比
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2 pr-2">指标</th>
                  {selectedSolutionData.map((s) => (
                    <th key={s.id} className="pb-2 px-2 whitespace-nowrap">
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="py-1.5 pr-2 text-gray-500">得分</td>
                  {selectedSolutionData.map((s) => (
                    <td key={s.id} className="py-1.5 px-2 font-bold">
                      {s.score}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 text-gray-500">覆盖率</td>
                  {selectedSolutionData.map((s) => (
                    <td key={s.id} className="py-1.5 px-2">
                      {s.metrics.coverageRate}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 text-gray-500">等待时长</td>
                  {selectedSolutionData.map((s) => (
                    <td key={s.id} className="py-1.5 px-2">
                      {s.metrics.waitTime}分钟
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 text-gray-500">浪费率</td>
                  {selectedSolutionData.map((s) => (
                    <td key={s.id} className="py-1.5 px-2">
                      {s.metrics.wasteRate}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 text-gray-500">人力压力</td>
                  {selectedSolutionData.map((s) => (
                    <td key={s.id} className="py-1.5 px-2">
                      {s.metrics.workPressure}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 pt-3 border-t border-orange-200">
            <div className="text-xs text-orange-600">
              推荐方案：
              <span className="font-bold">
                {
                  selectedSolutionData.sort((a, b) => b.score - a.score)[0]
                    .name
                }
              </span>
              （得分最高）
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {solutions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Save className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">暂无保存的方案</p>
            <p className="text-xs mt-1">调整参数后点击"保存方案"</p>
          </div>
        ) : (
          solutions
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                isSelected={selectedSolutions.includes(solution.id)}
                onToggleSelect={() => toggleSolutionSelection(solution.id)}
                onLoad={() => loadSolution(solution.id)}
                onDelete={() => deleteSolution(solution.id)}
              />
            ))
        )}
      </div>
    </div>
  );
}

interface SolutionCardProps {
  solution: Solution;
  isSelected: boolean;
  onToggleSelect: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

function SolutionCard({
  solution,
  isSelected,
  onToggleSelect,
  onLoad,
  onDelete,
}: SolutionCardProps) {
  const { grade, color } = getScoreGrade(solution.score);

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-teal-500 bg-teal-50'
          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggleSelect}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
              isSelected
                ? 'bg-teal-500 border-teal-500'
                : 'border-gray-300 hover:border-teal-400'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </button>

          <div>
            <h4 className="font-medium text-gray-800 text-sm">
              {solution.name}
            </h4>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>{solution.params.mealCount}份</span>
              <span>{solution.params.deliveryBatches}次配送</span>
              <span>{solution.params.volunteerGroups}组</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className={`text-lg font-bold ${color}`}>{grade}</span>
          <span className="text-sm text-gray-500">{solution.score}分</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={onLoad}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Play className="w-3 h-3" />
          加载
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

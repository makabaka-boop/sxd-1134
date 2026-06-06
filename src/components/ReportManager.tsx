import { useState } from 'react';
import {
  FileText,
  Plus,
  Check,
  X,
  Eye,
  Trash2,
  Play,
  Clock,
  Trophy,
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getScoreGrade, getBestReport } from '@/utils/calculator';
import type { Report } from '@/types';

export function ReportManager() {
  const {
    reports,
    generateReport,
    deleteReport,
    loadReportParams,
    setSelectedReport,
  } = useGameStore();

  const [showSaveInput, setShowSaveInput] = useState(false);
  const [reportName, setReportName] = useState('');

  const handleGenerate = () => {
    if (reportName.trim()) {
      generateReport(reportName.trim());
      setReportName('');
      setShowSaveInput(false);
    }
  };

  const bestReport = getBestReport(reports);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">运营复盘报告</h2>
          <p className="text-sm text-gray-500">生成方案复盘与历史记录</p>
        </div>
        <button
          onClick={() => setShowSaveInput(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-orange-200 hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          生成报告
        </button>
      </div>

      {showSaveInput && (
        <div className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-sm text-orange-700 mb-3 font-medium">为当前方案生成复盘报告</p>
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
              <Check className="w-4 h-4" />
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

      {bestReport && (
        <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700">历史最佳方案</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{bestReport.name}</p>
              <p className="text-xs text-gray-500">{formatDate(bestReport.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-amber-600">{bestReport.score} 分</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">暂无历史报告</p>
            <p className="text-xs mt-1">调整参数后点击"生成报告"</p>
          </div>
        ) : (
          [...reports]
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                isBest={bestReport?.id === report.id}
                onView={() => setSelectedReport(report)}
                onLoad={() => loadReportParams(report.id)}
                onDelete={() => deleteReport(report.id)}
                formatDate={formatDate}
              />
            ))
        )}
      </div>
    </div>
  );
}

interface ReportCardProps {
  report: Report;
  isBest: boolean;
  onView: () => void;
  onLoad: () => void;
  onDelete: () => void;
  formatDate: (timestamp: number) => string;
}

function ReportCard({
  report,
  isBest,
  onView,
  onLoad,
  onDelete,
  formatDate,
}: ReportCardProps) {
  const { grade, color } = getScoreGrade(report.score);

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
        isBest
          ? 'border-amber-300 bg-amber-50'
          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-800 text-sm">
              {report.name}
            </h4>
            {isBest && (
              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">
                最佳
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(report.createdAt)}
            </span>
            <span>{report.params.mealCount}份</span>
            <span>{report.params.deliveryBatches}次</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className={`text-lg font-bold ${color}`}>{grade}</span>
          <span className="text-sm text-gray-500">{report.score}分</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-3 h-3" />
          查看
        </button>
        <button
          onClick={onLoad}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-600 hover:bg-teal-100 transition-colors"
        >
          <Play className="w-3 h-3" />
          载入参数
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

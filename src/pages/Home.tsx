import { Calculator, BarChart3, Shield, FileText } from 'lucide-react';
import { ParameterPanel } from '@/components/ParameterPanel';
import { MetricsPanel } from '@/components/MetricsPanel';
import { RiskPanel } from '@/components/RiskPanel';
import { SolutionManager } from '@/components/SolutionManager';
import { ReportManager } from '@/components/ReportManager';
import { SettlementModal } from '@/components/SettlementModal';
import { ReportModal } from '@/components/ReportModal';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const { toggleSettlement } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  公益配餐调试模拟器
                </h1>
                <p className="text-xs text-gray-500">优化运营策略，平衡效率与公平
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>参数调节</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <Shield className="w-4 h-4" />
                <span>风险提示</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <FileText className="w-4 h-4" />
                <span>结算查看</span>
              </div>
            </div>

            <button
              onClick={toggleSettlement}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              查看结算
            </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <ParameterPanel />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <MetricsPanel />
            <ReportManager />
            <SolutionManager />
          </div>

          <div className="lg:col-span-4">
            <RiskPanel />
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            三级权限机制 · 玩家调参 · 提示面板看风险 · 结算面板看得分
          </p>
        </div>
      </footer>

      <SettlementModal />
      <ReportModal />
    </div>
  );
}

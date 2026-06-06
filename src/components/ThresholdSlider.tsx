import { useRef, useState, useCallback, useEffect } from 'react';

interface ThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  riskValue: number;
}

export function ThresholdSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  riskValue,
}: ThresholdSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;
  const riskPercentage = ((riskValue - min) / (max - min)) * 100;
  const isOverThreshold = riskValue > value;

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const newValue = Math.round(min + (newPercentage / 100) * (max - min));
      onChange(newValue);
    },
    [min, max, onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updateValueFromPosition(e.clientX);
    },
    [updateValueFromPosition]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      if (e.touches.length > 0) {
        updateValueFromPosition(e.touches[0].clientX);
      }
    },
    [updateValueFromPosition]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValueFromPosition(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        e.preventDefault();
        updateValueFromPosition(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateValueFromPosition]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">风险阈值</span>
        <span
          className={`text-lg font-bold transition-colors duration-300 ${
            isOverThreshold ? 'text-red-500' : 'text-teal-600'
          }`}
        >
          {value}
        </span>
      </div>

      <div
        ref={sliderRef}
        className="relative h-8 bg-gray-100 rounded-lg cursor-pointer select-none overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />

        <div
          className={`absolute top-0 h-full w-1 bg-red-400 transition-all duration-300 ${
            isOverThreshold ? 'animate-pulse' : ''
          }`}
          style={{ left: `${riskPercentage}%` }}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                isOverThreshold
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              当前风险 {Math.round(riskValue)}
            </span>
          </div>
        </div>

        <div
          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-teal-500 rounded-full shadow-md transition-shadow duration-150 hover:shadow-lg ${
            isDragging ? 'cursor-grabbing shadow-lg scale-110' : 'cursor-grab'
          }`}
          style={{ left: `calc(${percentage}% - 12px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-teal-500 rounded-full" />
        </div>
      </div>

      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>低风险</span>
        <span>高风险</span>
      </div>

      {isOverThreshold && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          警告：当前风险已超过阈值！额外扣 5 分
        </div>
      )}
    </div>
  );
}

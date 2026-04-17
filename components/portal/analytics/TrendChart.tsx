'use client';

import { MessageTrendPoint } from '@/lib/portal/analytics';

interface TrendChartProps {
  data: MessageTrendPoint[];
  title?: string;
}

export function TrendChart({ data, title = 'Messages over time' }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <p className="text-xs text-gray-500 mt-4">No data available</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <p className="text-sm font-medium text-gray-300 mb-6">{title}</p>

      <div className="flex items-end gap-3 h-40">
        {data.map((point) => (
          <div key={point.date} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full flex items-end justify-center h-32 relative">
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm transition-all hover:from-purple-400 hover:to-purple-300 cursor-pointer"
                style={{
                  height: `${(point.count / maxCount) * 100}%`,
                  minHeight: point.count > 0 ? '4px' : '0px',
                }}
                title={`${point.count} messages`}
              />
            </div>
            <span className="text-xs text-gray-400 text-center whitespace-nowrap">
              {point.date.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        {data.reduce((sum, d) => sum + d.count, 0)} total messages
      </p>
    </div>
  );
}

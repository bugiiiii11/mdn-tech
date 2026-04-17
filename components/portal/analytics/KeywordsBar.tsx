'use client';

import { Keyword } from '@/lib/portal/analytics';

interface KeywordsBarProps {
  keywords: Keyword[];
  title?: string;
}

export function KeywordsBar({ keywords, title = 'Top keywords asked about' }: KeywordsBarProps) {
  if (keywords.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <p className="text-xs text-gray-500 mt-4">No keywords found</p>
      </div>
    );
  }

  const maxCount = Math.max(...keywords.map((k) => k.count), 1);

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <p className="text-sm font-medium text-gray-300 mb-6">{title}</p>

      <div className="space-y-3">
        {keywords.map((keyword) => {
          const percentage = (keyword.count / maxCount) * 100;
          return (
            <div key={keyword.word} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-24 truncate" title={keyword.word}>
                {keyword.word}
              </span>
              <div className="flex-1 bg-gray-800 rounded-full overflow-hidden h-6 flex items-center">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${percentage}%`, minWidth: '24px' }}
                  title={`${keyword.count} mentions`}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-medium text-white">{keyword.count}</span>
                  )}
                </div>
              </div>
              {percentage <= 15 && (
                <span className="text-xs text-gray-500 w-6 text-right">{keyword.count}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

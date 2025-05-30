'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

import { laneDisplayNames, rankDisplayNames } from '@/constants/game';
import { HeroStats, Lane, RankRange } from '@/types/stats';
import { formatYYYYMMDDtoISO } from '@/utils/format';

interface ChampionStatsProps {
  stats: Record<RankRange, Record<Lane, HeroStats>>;
}

// Memoized component with performance improvements
export const ChampionStats = memo(function ChampionStats({
  stats,
}: ChampionStatsProps) {
  const [selectedRank, setSelectedRank] = useState<RankRange>('0');

  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold base-card-title-text">統計情報</h2>
        <p className="mt-4 text-slate-700 dark:text-slate-300">
          このチャンピオンの統計情報はありません。
        </p>
      </div>
    );
  }

  const currentStats = stats[selectedRank] || {};
  const lanes = Object.keys(currentStats) as Lane[];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold base-card-title-text">統計情報</h2>

      {/* Rank Filter Card */}
      <div className="base-card mt-4 rounded-lg py-4 duration-300 shadow-lg shadow-blue-500/5">
        <div className="flex gap-2 overflow-x-auto pb-2 px-4">
          {(Object.keys(rankDisplayNames) as RankRange[]).map(rank => (
            <button
              key={rank}
              onClick={() => setSelectedRank(rank)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selectedRank === rank ? 'base-btn-on' : 'base-btn-off'
              }`}
            >
              {rankDisplayNames[rank]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6">
        {lanes.length === 0 ? (
          <div className="base-card rounded-lg p-6 duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg shadow-blue-500/5">
            <p className="text-slate-700 dark:text-slate-300">
              このランクでの統計情報はありません。
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lanes.map(lane => {
              const laneStats = currentStats[lane];
              if (!laneStats) return null;

              return (
                <div
                  key={lane}
                  className="base-card group rounded-lg p-6 duration-300 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg shadow-blue-500/5"
                >
                  <h3 className="text-lg font-medium base-card-title-text group-hover:to-blue-600 dark:group-hover:to-blue-300 transition-all flex items-center justify-between">
                    <span>{laneDisplayNames[lane]}レーン</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      <CalendarIcon className="w-3.5 h-3.5 inline-block mr-1 mb-1" />
                      最終更新日: {formatYYYYMMDDtoISO(laneStats.dtstatdate)}
                    </span>
                  </h3>

                  <div className="mt-4 space-y-4">
                    {/* Win Rate */}
                    <div className="group/stat flex justify-between items-center p-2 rounded-md transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                      <span className="stats-card-title-text">勝率</span>
                      <span
                        className={`font-medium ${getWinRateColor(parseFloat(laneStats.win_rate_percent))} group-hover/stat:scale-110 transition-transform`}
                      >
                        {laneStats.win_rate_percent}%
                      </span>
                    </div>

                    {/* Pick Rate */}
                    <div className="group/stat stats-card-title">
                      <span className="stats-card-title-text">ピック率</span>
                      <span className="font-medium text-blue-600 dark:text-blue-300 group-hover/stat:scale-110 transition-transform">
                        {laneStats.appear_rate_percent}%
                      </span>
                    </div>

                    {/* Ban Rate */}
                    <div className="group/stat stats-card-title">
                      <span className="stats-card-title-text">バン率</span>
                      <span className="font-medium text-blue-600 dark:text-purple-300 group-hover/stat:scale-110 transition-transform">
                        {laneStats.forbid_rate_percent}%
                      </span>
                    </div>

                    {/* Strength Index */}
                    <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-white/10">
                      <div className="group/stat stats-card-title">
                        <span className="stats-card-title-text">強さ指数</span>
                        <span
                          className={`font-medium ${getStrengthColor(parseInt(laneStats.strength, 10))} group-hover/stat:scale-110 transition-transform`}
                        >
                          {laneStats.strength}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

// Function to return color based on win rate
function getWinRateColor(winRate: number): string {
  if (winRate >= 52) return 'text-green-600 dark:text-green-400';
  if (winRate <= 48) return 'text-red-600 dark:text-red-400';
  return 'text-yellow-600 dark:text-yellow-400';
}

// Function to return a color based on a strength index
function getStrengthColor(strength: number): string {
  if (strength >= 80) return 'text-purple-600 dark:text-purple-400';
  if (strength >= 60) return 'text-blue-600 dark:text-blue-400';
  if (strength >= 40) return 'text-green-600 dark:text-green-400';
  if (strength >= 20) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

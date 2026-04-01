import React from 'react';
import { BubbleIcon } from '../ui/BubbleIcon';
import { formatNumber } from '../../utils/format';
import { t } from '../../i18n';
import { audio } from '../../game/audio';

interface TopBarProps {
  gold: number;
  pps: number;
  isAnimating: boolean;
  setIsAnimating: (v: boolean) => void;
  language: string;
  arenaLevel: number;
  currentTrack: any;
}

export const TopBar: React.FC<TopBarProps> = ({
  gold,
  pps,
  isAnimating,
  setIsAnimating,
  language,
  arenaLevel,
  currentTrack
}) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 grid grid-cols-3 items-start pointer-events-none z-10">
      {/* Top Left: Gold & PPS */}
      <div className="pointer-events-none flex flex-col gap-1 items-start">
        <div className="flex items-center gap-3">
          <div
            className={`${isAnimating ? 'animate-wobble-zoom' : ''}`}
            onAnimationEnd={() => setIsAnimating(false)}
          >
            <BubbleIcon size={48} className="text-[#FFD6A5] drop-shadow-md" />
          </div>
          <span className="text-4xl font-bold text-[#9D8189] drop-shadow-sm">{formatNumber(gold)}</span>
        </div>
        <div className="text-[#9D8189]/80 font-bold text-lg ml-2">
          {formatNumber(pps)} {t('pps', language as any)}
        </div>
      </div>

      {/* Top Center: Logo & Level */}
      <div className="flex flex-col items-center">
        <div className="text-6xl font-bold text-[#9D8189] tracking-tight drop-shadow-sm mt-2">
          Breakdle
        </div>
        <div className="text-xl font-bold text-[#9D8189]/60 mt-1">
          {t('level', language as any)} {arenaLevel}
        </div>
      </div>

      {/* Top Right: Now Playing */}
      <div className="flex flex-col items-end">
        {audio.tracks.length > 0 && currentTrack && (
          <div className="pointer-events-auto flex flex-col gap-1 bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-sm max-w-[200px] text-right">
            <span className="text-xs font-bold text-[#9D8189]/70 uppercase tracking-wider">{t('now_playing', language as any)}</span>
            <a href={currentTrack.publicLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#9D8189] truncate hover:underline">
              {currentTrack.title}
            </a>
            <a href={currentTrack.artistLink} target="_blank" rel="noopener noreferrer" className="text-xs text-[#9D8189]/70 truncate hover:underline">
              {t('by', language as any)} {currentTrack.author}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Play } from 'lucide-react';
import { BubbleIcon } from '../ui/BubbleIcon';
import { t } from '../../i18n';

interface StartScreenProps {
  onStart: () => void;
  language: string;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, language }) => {
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFF5F5]/60 backdrop-blur-md animate-in fade-in duration-500">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFC6FF]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#A0C4FF]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative flex flex-col items-center gap-12 text-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-wobble-zoom">
            <BubbleIcon size={84} className="text-[#FFD6A5] drop-shadow-xl" />
          </div>
          <h1 className="text-8xl font-black text-[#9D8189] tracking-tighter drop-shadow-sm">
            Breakdle
          </h1>
          <p className="text-xl font-bold text-[#9D8189]/50 uppercase tracking-[0.3em] ml-2">
            The idle brick breaker
          </p>
        </div>

        <button
          onClick={onStart}
          className="group relative flex items-center gap-4 px-12 py-6 bg-white rounded-[2rem] shadow-xl border border-white/50 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#CAFFBF]/20 to-[#A0C4FF]/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
          <Play size={32} className="text-[#9D8189] fill-[#9D8189]/20" />
          <span className="text-3xl font-black text-[#9D8189] relative z-10">
            {t('start_game', language as any)}
          </span>
        </button>
      </div>

      <div className="absolute bottom-12 text-[#9D8189]/40 font-bold tracking-widest text-sm uppercase">
        © 2026 Sammwy
      </div>
    </div>
  );
};

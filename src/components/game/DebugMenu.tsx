import React, { useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { state } from '../../game/state';
import { SKILLS } from '../../game/skills';
import { t } from '../../i18n';

interface DebugMenuProps {
  isPaused: boolean;
  setIsPaused: (v: boolean) => void;
  timeScale: number;
  setTimeScale: (v: number) => void;
  language: string;
  arenaLevel: number;
  setArenaLevel: (v: number) => void;
  paddleMode: string;
  setPaddleMode: (v: any) => void;
  skills: Record<string, number>;
  setSkills: (v: any) => void;
}

export const DebugMenu: React.FC<DebugMenuProps> = ({
  isPaused,
  setIsPaused,
  timeScale,
  setTimeScale,
  language,
  arenaLevel,
  setArenaLevel,
  paddleMode,
  setPaddleMode,
  skills,
  setSkills
}) => {
  const [debugTab, setDebugTab] = useState<'general' | 'skills'>('general');

  return (
    <div className="absolute bottom-24 left-6 pointer-events-auto bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/80 flex flex-col gap-4 w-80 animate-in slide-in-from-bottom-4 fade-in duration-200 z-20">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-bold text-[#9D8189]">Debug Stats</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              state.isPaused = !state.isPaused;
              setIsPaused(state.isPaused);
            }}
            className="p-2 bg-[#A0C4FF] text-white rounded-xl hover:bg-[#8AB4F8] transition-colors active:scale-95"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button
            onClick={() => { state.forceRespawn = true; }}
            className="p-2 bg-[#A0C4FF] text-white rounded-xl hover:bg-[#8AB4F8] transition-colors active:scale-95"
            title="Force Arena Respawn"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 bg-[#9D8189]/5 rounded-2xl">
        <div className="flex justify-between text-xs font-bold text-[#9D8189]/60 uppercase tracking-wider">
          <span>Game Speed</span>
          <span>{timeScale.toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.25"
          value={timeScale}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            state.timeScale = val;
            setTimeScale(val);
          }}
          className="w-full h-2 bg-[#9D8189]/10 rounded-lg appearance-none cursor-pointer accent-[#9D8189]"
        />
        <div className="flex justify-between text-[10px] text-[#9D8189]/40 font-bold">
          <span>0.25x</span>
          <span>1.0x</span>
          <span>2.0x</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setDebugTab('general')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-sm transition-colors ${debugTab === 'general' ? 'bg-[#FFC6FF] text-[#9D8189]' : 'bg-white/50 text-[#9D8189]/50 hover:bg-white/80'}`}
        >
          General
        </button>
        <button
          onClick={() => setDebugTab('skills')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-sm transition-colors ${debugTab === 'skills' ? 'bg-[#FFC6FF] text-[#9D8189]' : 'bg-white/50 text-[#9D8189]/50 hover:bg-white/80'}`}
        >
          Skills
        </button>
      </div>

      {debugTab === 'general' && (
        <div className="flex flex-col gap-5">
          <Slider label={t('level', language as any)} value={arenaLevel} min={1} max={100} onChange={setArenaLevel} />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-semibold text-[#9D8189]">
              <span>Game Speed</span>
              <span>{timeScale.toFixed(2)}x</span>
            </div>
            <div className="flex gap-1 overflow-x-auto py-1 no-scrollbar">
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(s => (
                <button
                  key={s}
                  onClick={() => { state.timeScale = s; setTimeScale(s); }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-colors shrink-0 ${timeScale === s ? 'bg-[#FFC6FF] text-[#9D8189]' : 'bg-white/50 text-[#9D8189]/50 hover:bg-white/80'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#9D8189]">Paddle Mode</span>
            <button
              onClick={() => setPaddleMode((m: any) => m === 'auto' ? 'manual' : 'auto')}
              className="px-3 py-1 bg-[#FFC6FF] hover:bg-[#FFB2FF] text-[#9D8189] font-bold rounded-lg uppercase text-xs transition-colors"
            >
              {paddleMode}
            </button>
          </div>
        </div>
      )}

      {debugTab === 'skills' && (
        <div className="flex flex-col gap-5 max-h-64 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FFC6FF transparent' }}>
          {Object.keys(skills).map(skillId => (
            <div key={skillId}>
              <Slider
                label={t(SKILLS.find(s => s.id === skillId)?.nameKey || skillId, language as any)}
                value={skills[skillId]}
                min={1}
                max={50}
                onChange={(v) => {
                  const newSkills = { ...skills, [skillId]: v };
                  setSkills(newSkills);
                  state.skills = newSkills;
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

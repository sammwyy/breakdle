import React, { useEffect, useRef, useState } from 'react';
import { Bug, Play, Pause } from 'lucide-react';

import { state } from './game/state';
import { SKILLS } from './game/skills';
import { BreakdleEngine } from './game/engine';
import { audio } from './game/audio';
import { t } from './i18n';

import { TopBar } from './components/game/TopBar';
import { SideButtons } from './components/game/SideButtons';
import { DebugMenu } from './components/game/DebugMenu';
import { StatsModal } from './components/modals/StatsModal';
import { ShopModal } from './components/modals/ShopModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ResetConfirmModal } from './components/modals/ResetConfirmModal';
import { formatNumber } from './utils/format';

const DEBUG_ENABLED = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true';
const VERSION = '1.0.0';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  
  const [volumes, setVolumes] = useState(state.settings.volumes);
  const [pauseOnMenu, setPauseOnMenu] = useState(state.settings.pauseOnMenu);
  const [language, setLanguage] = useState(state.settings.language);
  const [wasPausedBeforeMenu, setWasPausedBeforeMenu] = useState(false);
  
  const [gold, setGold] = useState(state.gold);
  const [pps, setPps] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(state.isPaused);
  const [timeScale, setTimeScale] = useState(state.timeScale);

  const [arenaLevel, setArenaLevel] = useState(state.arenaLevel);
  const [paddleMode, setPaddleMode] = useState(state.paddleMode);
  const [skills, setSkills] = useState<Record<string, number>>({ ...state.skills });

  const handleUpgrade = (skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return;

    const currentLevel = skills[skillId] ?? 0;
    if (currentLevel >= skill.maxLevel) return;

    const cost = skill.cost(currentLevel);
    if (state.gold >= cost) {
      state.gold -= cost;
      state.stats.totalGoldSpent += cost;
      setGold(state.gold);

      const newSkills = { ...skills, [skillId]: currentLevel + 1 };
      setSkills(newSkills);
      state.skills = newSkills;
      state.save();
    }
  };

  useEffect(() => {
    state.arenaLevel = arenaLevel;
  }, [arenaLevel]);

  useEffect(() => {
    state.paddleMode = paddleMode;
  }, [paddleMode]);

  useEffect(() => {
    let history: number[] = [];
    let lastGold = state.gold;
    const interval = setInterval(() => {
      const currentGold = state.gold;
      const diff = currentGold - lastGold;
      lastGold = currentGold;
      history.push(diff);
      if (history.length > 10) history.shift();

      const totalDiff = history.reduce((a, b) => a + b, 0);
      const currentPps = totalDiff / history.length;
      setPps(currentPps);
      if (currentPps > state.stats.peakPps) {
        state.stats.peakPps = currentPps;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVolumeChange = (key: string, value: number) => {
    const newVolumes = { ...volumes, [key]: value };
    setVolumes(newVolumes);
    (state.settings.volumes as any)[key] = value;
    if (key === 'bgm') {
      audio.updateBgmVolume();
    }
    state.save();
  };

  const handleResetData = () => {
    state.reset();
    state.isPaused = true;
    window.location.reload();
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new BreakdleEngine(canvasRef.current);
    engine.start();

    const initAudio = () => {
      audio.init();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);

    let lastGold = state.gold;
    const interval = setInterval(() => {
      if (state.gold > lastGold) {
        setIsAnimating(true);
        lastGold = state.gold;
      }
      setGold(state.gold);
      setArenaLevel(state.arenaLevel);
      setIsPaused(state.isPaused);
      setTimeScale(state.timeScale);
    }, 100);

    return () => {
      engine.stop();
      clearInterval(interval);
    };
  }, []);

  const [currentTrack, setCurrentTrack] = useState(audio.getCurrentTrack());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrack(audio.getCurrentTrack());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const openModal = (setter: (v: boolean) => void) => {
    if (state.settings.pauseOnMenu && !state.isPaused) {
      setWasPausedBeforeMenu(false);
      state.isPaused = true;
      setIsPaused(true);
    } else if (state.isPaused) {
      setWasPausedBeforeMenu(true);
    }
    setter(true);
  };

  const closeModal = (setter: (v: boolean) => void) => {
    if (state.settings.pauseOnMenu && !wasPausedBeforeMenu) {
      state.isPaused = false;
      setIsPaused(false);
    }
    setter(false);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[#FFF5F5]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      <TopBar
        gold={gold}
        pps={pps}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        language={language}
        arenaLevel={arenaLevel}
        currentTrack={currentTrack}
      />

      {debugOpen && DEBUG_ENABLED && (
        <DebugMenu
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          timeScale={timeScale}
          setTimeScale={setTimeScale}
          language={language}
          arenaLevel={arenaLevel}
          setArenaLevel={setArenaLevel}
          paddleMode={paddleMode}
          setPaddleMode={setPaddleMode}
          skills={skills}
          setSkills={setSkills}
        />
      )}

      {/* Bottom Left: Debug & Pause Buttons */}
      <div className="absolute bottom-6 left-6 pointer-events-auto z-10 flex gap-3">
        {DEBUG_ENABLED && (
          <button
            onClick={() => setDebugOpen(!debugOpen)}
            className="p-3 bg-white/50 backdrop-blur-md text-[#9D8189] rounded-2xl font-bold hover:bg-white/80 transition-all active:scale-95 shadow-sm border border-white/50"
          >
            <Bug size={28} />
          </button>
        )}
        <button
          onClick={() => { state.isPaused = !state.isPaused; setIsPaused(state.isPaused); }}
          className="p-3 bg-white/50 backdrop-blur-md text-[#9D8189] rounded-2xl font-bold hover:bg-white/80 transition-all active:scale-95 shadow-sm border border-white/50"
        >
          {isPaused ? <Play size={28} /> : <Pause size={28} />}
        </button>
      </div>

      <SideButtons
        onOpenShop={() => openModal(setShopOpen)}
        onOpenStats={() => openModal(setStatsOpen)}
        onOpenSettings={() => openModal(setSettingsOpen)}
        language={language}
      />

      {statsOpen && (
        <StatsModal
          onClose={() => closeModal(setStatsOpen)}
          language={language}
          formatNumber={formatNumber}
        />
      )}

      {shopOpen && (
        <ShopModal
          onClose={() => closeModal(setShopOpen)}
          language={language}
          gold={gold}
          skills={skills}
          handleUpgrade={handleUpgrade}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          onClose={() => closeModal(setSettingsOpen)}
          onResetData={() => setResetConfirmOpen(true)}
          language={language}
          setLanguage={setLanguage}
          volumes={volumes}
          handleVolumeChange={handleVolumeChange}
          pauseOnMenu={pauseOnMenu}
          setPauseOnMenu={setPauseOnMenu}
          version={VERSION}
        />
      )}

      {resetConfirmOpen && (
        <ResetConfirmModal
          onClose={() => setResetConfirmOpen(false)}
          onConfirm={handleResetData}
          language={language}
        />
      )}
    </div>
  );
}

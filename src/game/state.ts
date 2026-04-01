import { Language } from '../i18n';

export class GameState {
  gold = 0;
  arenaLevel = 1;
  paddleMode: 'auto' | 'manual' = 'manual';
  forceRespawn = false;
  isPaused = false;
  timeScale = 1;
  
  stats = {
    totalGoldEarned: 0,
    totalGoldSpent: 0,
    peakPps: 0,
    blocksDestroyed: 0,
    ballsSpawned: 0,
    arenasCompleted: 0
  };
  
  skills: Record<string, number> = {
    multiball: 0,
    spikes: 0,
    multipaddle: 0,
    fastRespawn: 0,
    fastTravel: 0,
    bigPaddles: 0,
    fastBarrier: 0,
    drill: 0,
    explosion: 0,
    expl_nova: 0,
    expl_demolition: 0,
    ghost_ball: 0,
    gold_mastery: 0
  };
  
  settings = {
    volumes: {
      bgm: 0.5,
      hitBlock: 0.5,
      hitPaddle: 0.5,
      arenaClear: 0.5,
      arenaReset: 0.5
    },
    pauseOnMenu: true,
    language: 'en' as Language
  };
  
  savedBricks: any[] | null = null;
  canSave = true;

  save() {
    if (!this.canSave) return;
    const data = {
      gold: this.gold,
      arenaLevel: this.arenaLevel,
      stats: this.stats,
      skills: this.skills,
      settings: this.settings,
      savedBricks: this.savedBricks
    };
    localStorage.setItem('breakdle_save', JSON.stringify(data));
  }

  load() {
    const dataStr = localStorage.getItem('breakdle_save');
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        this.gold = data.gold ?? 0;
        this.arenaLevel = data.arenaLevel ?? 1;
        this.stats = { ...this.stats, ...(data.stats || {}) };
        this.skills = { ...this.skills, ...(data.skills || {}) };
        this.settings = { ...this.settings, ...(data.settings || {}) };
        this.savedBricks = data.savedBricks ?? null;
      } catch (e) {
        console.error('Failed to load savegame', e);
      }
    }
  }

  reset() {
    this.gold = 0;
    this.arenaLevel = 1;
    this.paddleMode = 'manual';
    this.stats = {
      totalGoldEarned: 0,
      totalGoldSpent: 0,
      peakPps: 0,
      blocksDestroyed: 0,
      ballsSpawned: 0,
      arenasCompleted: 0
    };
    this.skills = {
      multiball: 0,
      spikes: 0,
      multipaddle: 0,
      fastRespawn: 0,
      fastTravel: 0,
      bigPaddles: 0,
      fastBarrier: 0,
      drill: 0,
      explosion: 0,
      expl_nova: 0,
      expl_demolition: 0,
      ghost_ball: 0,
      gold_mastery: 0
    };
    this.settings = {
      volumes: {
        bgm: 0.5,
        hitBlock: 0.5,
        hitPaddle: 0.5,
        arenaClear: 0.5,
        arenaReset: 0.5
      },
      pauseOnMenu: true,
      language: 'en' as Language
    };
    this.savedBricks = null;
    this.canSave = false;
    localStorage.removeItem('breakdle_save');
  }
}

export const state = new GameState();
state.load();

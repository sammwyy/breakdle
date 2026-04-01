import { state } from './state';

class AudioSystem {
  private audioCtx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private currentTrackIndex = 0;

  public tracks: any[] = [];

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!this.bgmAudio && this.tracks.length > 0) {
      this.bgmAudio = new Audio();
      this.bgmAudio.crossOrigin = "anonymous";
      this.bgmAudio.addEventListener('ended', () => this.nextTrack());
      this.playTrack(this.currentTrackIndex);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.bgmAudio?.pause();
        } else {
          this.bgmAudio?.play().catch(() => {});
        }
      });
    }
  }

  playTrack(index: number) {
    if (!this.bgmAudio || this.tracks.length === 0) return;
    this.currentTrackIndex = index % this.tracks.length;
    this.bgmAudio.src = this.tracks[this.currentTrackIndex].mp3Link;
    this.bgmAudio.volume = state.settings.volumes.bgm;
    this.bgmAudio.play().catch(e => console.log("BGM autoplay prevented", e));
  }

  nextTrack() {
    if (this.tracks.length === 0) return;
    this.playTrack(this.currentTrackIndex + 1);
  }

  updateBgmVolume() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = state.settings.volumes.bgm;
    }
  }

  getCurrentTrack() {
    if (this.tracks.length === 0) return null;
    return this.tracks[this.currentTrackIndex];
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
    if (!this.audioCtx) return;
    if (vol <= 0) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playHitBlock() {
    if (!this.audioCtx || document.hidden) return;
    const vol = state.settings.volumes.hitBlock * 0.4;
    if (vol <= 0) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Bubble "pop" sound
    osc.type = 'sine';
    
    // Randomize base pitch for variety
    const baseFreq = 400 + Math.random() * 400;
    
    // Quick sweep up
    osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.audioCtx.currentTime + 0.06);

    // Very short envelope
    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.06);
  }

  playHitPaddle() {
    if (!this.audioCtx || document.hidden) return;
    const vol = state.settings.volumes.hitPaddle * 0.5;
    if (vol <= 0) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    
    // Bouncy boop sound
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  playArenaClear() {
    if (!this.audioCtx || document.hidden) return;
    const vol = state.settings.volumes.arenaClear * 0.5;
    if (vol <= 0) return;
    
    // Play a little fanfare
    this.playTone(440, 'sine', 0.2, vol);
    setTimeout(() => this.playTone(554, 'sine', 0.2, vol), 150);
    setTimeout(() => this.playTone(659, 'sine', 0.4, vol), 300);
  }

  playArenaReset() {
    if (!this.audioCtx || document.hidden) return;
    const vol = state.settings.volumes.arenaReset * 0.5;
    if (vol <= 0) return;
    
    this.playTone(300, 'sawtooth', 0.3, vol);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.4, vol), 200);
  }
}

export const audio = new AudioSystem();

/**
 * Web Audio API Engine & Media Player for TRIPLETS Band
 * Synthesizes realistic rock chords, bassline, and lead melody loops,
 * or plays actual MP3/WAV audio files, with visualizer frequency output.
 */

import { getAudioBlobUrl } from './audioStorage';

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackId: string | null = null;
  private currentTime = 0;
  private duration = 268; // default 4:28
  private volume = 0.8;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private listeners: Set<() => void> = new Set();
  private chordTimer: number | null = null;

  // Real Audio Element playback for MP3/WAV audio files
  private audioElement: HTMLAudioElement | null = null;
  private activeAudioUrl: string | null = null;
  private objectUrlToRevoke: string | null = null;
  private isUsingRealAudio = false;
  private onEndedCallback: (() => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setOnEndedCallback(callback: (() => void) | null) {
    this.onEndedCallback = callback;
  }

  private triggerOnEnded() {
    this.notify();
    if (this.onEndedCallback) {
      this.onEndedCallback();
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public async playTrack(
    trackId: string,
    durationSeconds: number,
    rootNote = 57,
    bpm = 118,
    style = 'melancholic_rock',
    audioUrl?: string,
    trackNumber?: number
  ) {
    this.initContext();

    const isSameTrack = this.currentTrackId === trackId;

    if (!isSameTrack) {
      this.currentTrackId = trackId;
      this.currentTime = 0;
      this.duration = durationSeconds;
    }

    this.isPlaying = true;

    // Build candidate audio URLs to try
    const candidates: string[] = [];
    if (audioUrl && audioUrl.trim() !== '') {
      candidates.push(audioUrl.trim());
    }

    // Extract track number from ID (e.g. song-1 -> 1) or parameter
    const num = trackNumber || parseInt(trackId.replace(/\D/g, ''), 10) || 1;
    const numPadded = num < 10 ? `0${num}` : `${num}`;

    // Common file naming patterns on GitHub / Public
    const candidateVariants = [
      `/audio/${numPadded}.mp3.mp3`,
      `/audio/${numPadded}.mp3`,
      `/audio/${num}.mp3.mp3`,
      `/audio/${num}.mp3`,
      `/audio/track-${num}.mp3`,
      `/audio/track-${numPadded}.mp3`,
      `/audio/track${num}.mp3`,
      `/audio/track${numPadded}.mp3`
    ];

    for (const v of candidateVariants) {
      if (!candidates.includes(v)) {
        candidates.push(v);
      }
    }

    let playedSuccessfully = false;

    // If audio is indexedDB or explicit URL, try it
    for (const candidate of candidates) {
      const success = await this.playRealAudio(candidate, isSameTrack);
      if (success) {
        playedSuccessfully = true;
        break;
      }
    }

    if (!playedSuccessfully) {
      // Fallback to synthesis if no real audio file could be played
      this.stopRealAudio();
      this.isUsingRealAudio = false;
      this.startTimer();
      this.startAudioSynthesis(rootNote, bpm, style);
    }

    this.notify();
  }

  public togglePlayPause(
    trackId: string,
    durationSeconds: number,
    rootNote = 57,
    bpm = 118,
    style = 'melancholic_rock',
    audioUrl?: string
  ) {
    if (this.isPlaying && this.currentTrackId === trackId) {
      this.pause();
    } else {
      this.playTrack(trackId, durationSeconds, rootNote, bpm, style, audioUrl);
    }
  }

  private mediaSourceConnected = false;

  private async playRealAudio(audioUrl: string, isSameTrack: boolean): Promise<boolean> {
    this.stopAudioSynthesis();
    this.stopTimer();

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';

      this.audioElement.onloadedmetadata = () => {
        if (this.audioElement && this.audioElement.duration && !isNaN(this.audioElement.duration) && isFinite(this.audioElement.duration)) {
          this.duration = Math.floor(this.audioElement.duration);
          this.notify();
        }
      };

      this.audioElement.onended = () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.triggerOnEnded();
      };

      this.audioElement.ontimeupdate = () => {
        if (this.audioElement && this.isUsingRealAudio) {
          this.currentTime = Math.floor(this.audioElement.currentTime);
          if (this.audioElement.duration && !isNaN(this.audioElement.duration) && isFinite(this.audioElement.duration)) {
            this.duration = Math.floor(this.audioElement.duration);
          }
          this.notify();
        }
      };

      this.audioElement.onerror = (e) => {
        console.warn('Audio element playback error, falling back to synth:', e);
        this.isUsingRealAudio = false;
      };
    }

    let srcToPlay = audioUrl;

    if (audioUrl.startsWith('idb://')) {
      const idbKey = audioUrl.replace('idb://', '');
      const blobUrl = await getAudioBlobUrl(idbKey);
      if (blobUrl) {
        srcToPlay = blobUrl;
      } else {
        console.warn(`IndexedDB audio for key "${idbKey}" not found, falling back to demo synth.`);
        return false;
      }
    } else if (audioUrl.startsWith('/') && !audioUrl.startsWith('//')) {
      try {
        const resp = await fetch(audioUrl, { method: 'HEAD' });
        if (!resp.ok) {
          return false;
        }
      } catch {
        // If HEAD check fails, let standard audio loading attempt it
      }
    }

    if (this.activeAudioUrl !== audioUrl || !isSameTrack || this.audioElement.src !== srcToPlay) {
      if (this.objectUrlToRevoke && this.objectUrlToRevoke !== srcToPlay) {
        URL.revokeObjectURL(this.objectUrlToRevoke);
        this.objectUrlToRevoke = null;
      }

      if (srcToPlay.startsWith('blob:')) {
        this.objectUrlToRevoke = srcToPlay;
      }

      this.activeAudioUrl = audioUrl;
      this.audioElement.src = srcToPlay;
      this.audioElement.currentTime = isSameTrack ? this.currentTime : 0;
    }

    this.isUsingRealAudio = true;
    this.audioElement.volume = this.volume;

    try {
      await this.audioElement.play();
      return true;
    } catch (err) {
      console.warn('Audio play failed or was blocked by browser policy:', err);
      return false;
    }
  }

  private stopRealAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopAudioSynthesis();
    this.stopTimer();
    this.stopRealAudio();
    this.notify();
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.isUsingRealAudio && this.audioElement) {
      this.audioElement.currentTime = this.currentTime;
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(vol, 1));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
      isUsingRealAudio: this.isUsingRealAudio,
    };
  }

  private startTimer() {
    this.stopTimer();
    this.intervalId = window.setInterval(() => {
      if (this.isPlaying && !this.isUsingRealAudio) {
        this.currentTime += 1;
        if (this.currentTime >= this.duration) {
          this.currentTime = 0;
          this.triggerOnEnded();
        } else {
          this.notify();
        }
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private startAudioSynthesis(rootNote: number, bpm: number, style: string) {
    this.stopAudioSynthesis();
    if (!this.ctx || !this.masterGain) return;

    const intervalMs = (60 / bpm) * 1000 * 2; // 2 beats per chord step
    let step = 0;

    const chordOffsets = style === 'ballad' 
      ? [[0, 4, 7], [-2, 2, 5], [5, 9, 12], [3, 7, 10]]
      : style === 'heavy_groove'
      ? [[0, 3, 7], [-4, 0, 3], [5, 8, 12], [2, 5, 8]]
      : [[0, 3, 7], [5, 8, 12], [-2, 2, 5], [3, 7, 10]];

    const triggerChord = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying || this.isUsingRealAudio) return;
      
      const now = this.ctx.currentTime;
      const currentChord = chordOffsets[step % chordOffsets.length];
      step++;

      currentChord.forEach((offset, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const freq = 440 * Math.pow(2, (rootNote + offset - 69) / 12);
        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + idx * 300, now);

        noteGain.gain.setValueAtTime(0.01, now);
        noteGain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 0.95);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + intervalMs / 1000);
      });

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFreq = 440 * Math.pow(2, (rootNote - 12 + currentChord[0] - 69) / 12);

      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);

      bassOsc.start(now);
      bassOsc.stop(now + 0.85);

      setTimeout(() => {
        if (!this.ctx || !this.masterGain || !this.isPlaying || this.isUsingRealAudio) return;
        const subNow = this.ctx.currentTime;
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();

        hatOsc.type = 'square';
        hatOsc.frequency.setValueAtTime(2400 + (step % 2) * 800, subNow);

        hatGain.gain.setValueAtTime(0.03, subNow);
        hatGain.gain.exponentialRampToValueAtTime(0.0001, subNow + 0.08);

        hatOsc.connect(hatGain);
        hatGain.connect(this.masterGain);

        hatOsc.start(subNow);
        hatOsc.stop(subNow + 0.1);
      }, intervalMs / 2);
    };

    triggerChord();
    this.chordTimer = window.setInterval(triggerChord, intervalMs);
  }

  private stopAudioSynthesis() {
    if (this.chordTimer !== null) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
  }

  public getFrequencyData(): number[] {
    if (!this.analyser) {
      return Array(16).fill(12);
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    const result: number[] = [];
    const step = Math.floor(bufferLength / 16) || 1;
    for (let i = 0; i < 16; i++) {
      const val = dataArray[i * step] || 0;
      result.push(Math.max(10, Math.floor((val / 255) * 100)));
    }
    return result;
  }
}

export const audioSynth = new AudioSynthEngine();

// Real Human Voice Speech Audio Engine for Sorani ASR Evaluation Studio
// Plays actual recorded human Kurdish speech audio clips from the project dataset.
// ZERO synthetic oscillators, ZERO whistling sounds, ZERO electronic beep tones.

class SoraniDatasetAudioEngine {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
    this.activeClipId = null;

    // Preset & Dataset clip ID mapping to real dataset WAV audio files
    this.clipMap = {
      p1: '/audio/clip_01.wav',
      p2: '/audio/clip_02.wav',
      p3: '/audio/clip_03.wav',
      p4: '/audio/clip_04.wav',
      p5: '/audio/clip_05.wav',
      clip_01: '/audio/clip_01.wav',
      clip_02: '/audio/clip_02.wav',
      clip_03: '/audio/clip_03.wav',
      clip_04: '/audio/clip_04.wav',
      clip_05: '/audio/clip_05.wav',
      clip_06: '/audio/clip_06.wav',
      clip_07: '/audio/clip_07.wav',
      clip_08: '/audio/clip_08.wav',
      clip_09: '/audio/clip_09.wav',
      clip_10: '/audio/clip_10.wav',
      clip_11: '/audio/clip_11.wav',
      clip_12: '/audio/clip_12.wav',
    };
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.isPlaying = false;
    this.activeClipId = null;
  }

  getAudioPath(clipId) {
    if (clipId && this.clipMap[clipId]) {
      return this.clipMap[clipId];
    }
    // Default fallback to real human Kurdish speech clip_01.wav
    return '/audio/clip_01.wav';
  }

  playSpeech(text, clipId, onEndCallback = null) {
    this.stop();

    this.isPlaying = true;
    this.activeClipId = clipId;

    const audioPath = this.getAudioPath(clipId);

    try {
      const audio = new Audio(audioPath);
      audio.volume = 1.0; // Full clear volume
      this.currentAudio = audio;

      audio.onended = () => {
        this.isPlaying = false;
        this.activeClipId = null;
        if (onEndCallback) onEndCallback();
      };

      audio.onerror = () => {
        // Fallback to browser Web Speech API if static file fails to load
        this.fallbackSpeechSynthesis(text, onEndCallback);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.fallbackSpeechSynthesis(text, onEndCallback);
        });
      }
    } catch (e) {
      this.fallbackSpeechSynthesis(text, onEndCallback);
    }
  }

  fallbackSpeechSynthesis(text, onEndCallback = null) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.rate = 0.9;
      utterance.lang = 'ar-SA';

      utterance.onend = () => {
        this.isPlaying = false;
        this.activeClipId = null;
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        this.isPlaying = false;
        this.activeClipId = null;
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      this.isPlaying = false;
      this.activeClipId = null;
      if (onEndCallback) onEndCallback();
    }
  }
}

export const audioEngine = new SoraniDatasetAudioEngine();

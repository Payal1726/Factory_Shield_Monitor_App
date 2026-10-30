/**
 * FactoryShield Monitor - Audio Synthesis & Speech Engine
 * Uses Web Audio API for industrial sound cues and Web Speech API for bilingual voice alerts.
 */

class SoundAndVoiceEngine {
  private audioCtx: AudioContext | null = null;
  private voiceEnabled: boolean = true;
  private language: 'en' | 'hi' = 'en';

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  public setLanguage(lang: 'en' | 'hi') {
    this.language = lang;
  }

  /**
   * Play an industrial critical alarm (pulsing two-tone emergency buzzer)
   */
  public playCriticalAlarm() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(440, now + 0.3);

      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.3);

      // Repeat second pulse for urgency
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(880, now + 0.35);
      osc2.frequency.exponentialRampToValueAtTime(440, now + 0.65);

      gain2.gain.setValueAtTime(0.2, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.35);
      osc2.stop(now + 0.65);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Play an amber warning chime
   */
  public playWarningChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(783.99, now + 0.15); // G5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // safe fallback
    }
  }

  /**
   * Play positive remediation success chime
   */
  public playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {
      // safe fallback
    }
  }

  /**
   * Speak voice alert using SpeechSynthesis in English or Hindi
   */
  public speakAlert(textEn: string, textHi: string, isCritical: boolean = false) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (isCritical) {
        this.playCriticalAlarm();
      } else {
        this.playWarningChime();
      }
      return;
    }

    // Play tone first
    if (isCritical) {
      this.playCriticalAlarm();
    } else {
      this.playWarningChime();
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      
      const textToSpeak = this.language === 'hi' ? textHi : textEn;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Match voice language
      utterance.lang = this.language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to find a matching installed voice
      const voices = window.speechSynthesis.getVoices();
      const targetLangPrefix = this.language === 'hi' ? 'hi' : 'en';
      const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLangPrefix));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }

  /**
   * Test current voice settings
   */
  public testVoice() {
    const enText = "FactoryShield voice alert test. Industrial security monitoring online.";
    const hiText = "फैक्ट्री शील्ड वॉयस अलर्ट परीक्षण। औद्योगिक सुरक्षा निगरानी सक्रिय है।";
    this.speakAlert(enText, hiText, false);
  }
}

export const soundAndVoice = new SoundAndVoiceEngine();

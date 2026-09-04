// Client-side Web Speech API voice commentary for FunnyChess
// 100% Free, browser-native SpeechSynthesis, supports English, Hindi, and Bengali

export type VoiceLanguage = 'en' | 'hi' | 'bn';

class VoiceSystem {
  private enabled: boolean = true;
  private volume: number = 0.9;
  private isSpeaking: boolean = false;
  private queue: { text: string; lang: VoiceLanguage }[] = [];

  constructor() {
    // Warm up voices if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // triggers browser to load installed voices
        window.speechSynthesis.getVoices();
      };
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.cancel();
    }
  }

  public isVoiceEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public getVolume(): number {
    return this.volume;
  }

  public speak(text: string, lang: VoiceLanguage = 'en') {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Stop current speech to immediately deliver the latest witty reaction
    window.speechSynthesis.cancel();

    try {
      // Remove emojis from text before speaking so browser doesn't say "grinning face with sweat"
      const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.volume = this.volume;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (lang === 'hi') {
        matchedVoice = voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('Hindi'));
      } else if (lang === 'bn') {
        matchedVoice = voices.find((v) => v.lang.startsWith('bn') || v.lang.includes('Bengali') || v.lang.includes('Bangla'));
      } else {
        matchedVoice = voices.find((v) => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB') || v.lang.startsWith('en')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft')));
      }

      // If specific regional voice not found, use any voice matching the language or default
      if (!matchedVoice && lang !== 'en') {
        matchedVoice = voices.find((v) => v.lang.startsWith(lang));
      }
      if (!matchedVoice) {
        matchedVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis error ignored gracefully
      this.isSpeaking = false;
    }
  }

  public cancel() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const aiVoice = new VoiceSystem();

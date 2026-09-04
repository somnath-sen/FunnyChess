import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceLanguage } from '@/lib/audio/voiceSpeech';
import { transliterateBengali } from '@/lib/audio/bengaliTransliterator';

export type SpeechPriority = 'high' | 'medium' | 'low';

export interface SpeakOptions {
  lang?: VoiceLanguage;
  priority?: SpeechPriority;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface VoiceSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  language: VoiceLanguage;
}

const STORAGE_KEY = 'funnychess_voice_settings';

export function useSpeech(defaultLang: VoiceLanguage = 'en') {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeVoiceName, setActiveVoiceName] = useState<string>('');
  const [hasNativeBengaliVoice, setHasNativeBengaliVoice] = useState<boolean>(false);

  // Persistent settings
  const [voiceEnabled, setVoiceEnabledState] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(0.9);
  const [voiceLanguage, setVoiceLanguageState] = useState<VoiceLanguage>(defaultLang);

  // References to keep queue & active utterance state
  const isPlayingRef = useRef<boolean>(false);
  const queueRef = useRef<{ text: string; options: SpeakOptions }[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Initialize & load voices and settings
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsAvailable(false);
      return;
    }

    setIsAvailable(true);

    // Load persisted settings
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Partial<VoiceSettings> = JSON.parse(saved);
        if (typeof parsed.enabled === 'boolean') setVoiceEnabledState(parsed.enabled);
        if (typeof parsed.volume === 'number') setVolumeState(parsed.volume);
        if (parsed.language) setVoiceLanguageState(parsed.language);
      }
    } catch {}

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);

      const hasBn = available.some(
        (v) =>
          v.lang.toLowerCase().startsWith('bn') ||
          v.name.toLowerCase().includes('bengali') ||
          v.name.toLowerCase().includes('bangla')
      );
      setHasNativeBengaliVoice(hasBn);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update voice language when site default changes if no custom override
  useEffect(() => {
    setVoiceLanguageState((prev) => prev || defaultLang);
  }, [defaultLang]);

  // Persist settings helper
  const persistSettings = (newSettings: Partial<VoiceSettings>) => {
    try {
      const current: VoiceSettings = {
        enabled: voiceEnabled,
        volume,
        language: voiceLanguage,
        ...newSettings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}
  };

  const setVoiceEnabled = (enabled: boolean) => {
    setVoiceEnabledState(enabled);
    persistSettings({ enabled });
    if (!enabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      isPlayingRef.current = false;
      queueRef.current = [];
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    persistSettings({ volume: clamped });
  };

  const setVoiceLanguage = (lang: VoiceLanguage) => {
    setVoiceLanguageState(lang);
    persistSettings({ language: lang });
  };

  // Find best matching voice for a language
  const getBestVoiceForLanguage = useCallback(
    (lang: VoiceLanguage): { voice: SpeechSynthesisVoice | null; isPhoneticFallback: boolean } => {
      if (voices.length === 0) return { voice: null, isPhoneticFallback: false };

      if (lang === 'hi') {
        const hiVoice = voices.find((v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
        return { voice: hiVoice || voices[0], isPhoneticFallback: false };
      }

      if (lang === 'bn') {
        const bnVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('bn') ||
            v.name.toLowerCase().includes('bengali') ||
            v.name.toLowerCase().includes('bangla')
        );

        if (bnVoice) {
          return { voice: bnVoice, isPhoneticFallback: false };
        }

        // Native Bengali voice not found on OS! Fallback to Indian English / Hindi voice for phonetics
        const indianVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().includes('in') ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('ravi') ||
            v.name.toLowerCase().includes('heera')
        );

        return { voice: indianVoice || voices[0], isPhoneticFallback: true };
      }

      // Default English
      const enVoice = voices.find(
        (v) =>
          (v.lang.toLowerCase().startsWith('en-us') ||
            v.lang.toLowerCase().startsWith('en-gb') ||
            v.lang.toLowerCase().startsWith('en')) &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft'))
      );

      return { voice: enVoice || voices[0], isPhoneticFallback: false };
    },
    [voices]
  );

  // Update active voice indicator
  useEffect(() => {
    const { voice, isPhoneticFallback } = getBestVoiceForLanguage(voiceLanguage);
    if (!voice) {
      setActiveVoiceName('Default System Voice');
    } else if (voiceLanguage === 'bn' && isPhoneticFallback) {
      setActiveVoiceName(`${voice.name} (Phonetic Bengali Fallback)`);
    } else {
      setActiveVoiceName(`${voice.name} (${voice.lang})`);
    }
  }, [voiceLanguage, getBestVoiceForLanguage]);

  // Clean text by stripping emojis for natural speech
  const cleanEmojiText = (text: string): string => {
    return text
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ''
      )
      .replace(/["“”'‘’]/g, '')
      .trim();
  };

  // Process next item in speech queue
  const processQueue = useCallback(() => {
    if (
      queueRef.current.length === 0 ||
      isPlayingRef.current ||
      !voiceEnabled ||
      typeof window === 'undefined' ||
      !window.speechSynthesis
    ) {
      return;
    }

    const nextItem = queueRef.current.shift();
    if (!nextItem) return;

    const { text, options } = nextItem;
    let cleanText = cleanEmojiText(text);
    if (!cleanText) {
      processQueue();
      return;
    }

    try {
      const targetLang = options.lang || voiceLanguage;
      const { voice: chosenVoice, isPhoneticFallback } = getBestVoiceForLanguage(targetLang);

      // If Bengali and relying on phonetic fallback, transliterate to romanized phonetics for speech
      if (targetLang === 'bn' && isPhoneticFallback) {
        cleanText = transliterateBengali(cleanText);
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      } else {
        utterance.lang = targetLang === 'hi' ? 'hi-IN' : 'en-US';
      }

      utterance.volume = volume;
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setIsPlaying(true);
        isPlayingRef.current = true;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        currentUtteranceRef.current = null;
        if (options.onEnd) options.onEnd();
        // Continue queue if any remain
        setTimeout(processQueue, 150);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        currentUtteranceRef.current = null;
        setTimeout(processQueue, 150);
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, [voiceEnabled, voiceLanguage, volume, getBestVoiceForLanguage]);

  // Main Speak Function with Priority Queueing
  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
        return;
      }

      const priority = options.priority || 'medium';

      // 1. HIGH PRIORITY (e.g. Checkmate, Resignation): Interrupt everything immediately
      if (priority === 'high') {
        window.speechSynthesis.cancel();
        queueRef.current = [];
        isPlayingRef.current = false;
        setIsPlaying(false);
        queueRef.current.push({ text, options });
        processQueue();
        return;
      }

      // 2. LOW PRIORITY (e.g. quiet moves, pawn snacks): Drop if currently talking to avoid chatter
      if (priority === 'low' && isPlayingRef.current) {
        return;
      }

      // 3. MEDIUM PRIORITY (e.g. checks, piece captures): Queue or play immediately
      if (isPlayingRef.current) {
        // If queue already has 2 items, replace the last one to stay fresh
        if (queueRef.current.length >= 2) {
          queueRef.current.pop();
        }
        queueRef.current.push({ text, options });
      } else {
        queueRef.current.push({ text, options });
        processQueue();
      }
    },
    [voiceEnabled, processQueue]
  );

  // Stop current speech
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      queueRef.current = [];
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, []);

  // Test current voice with sample witty text
  const testVoice = useCallback(() => {
    const testSamples: Record<VoiceLanguage, string> = {
      en: 'Hello Grandmaster! FunnyChess AI voice is active and ready to play!',
      hi: 'नमस्ते ग्रैंडमास्टर! फनीचेस वॉइस तैयार है, चलिए खेलते हैं!',
      bn: 'নমস্কার গ্র্যান্ডমাস্টার! ফানিচেস ভয়েস তৈরি, চলুন খেলা শুরু করা যাক!',
    };
    speak(testSamples[voiceLanguage], { priority: 'high' });
  }, [voiceLanguage, speak]);

  return {
    isAvailable,
    isPlaying,
    voices,
    voiceEnabled,
    volume,
    voiceLanguage,
    activeVoiceName,
    setVoiceEnabled,
    setVolume,
    setVoiceLanguage,
    speak,
    stop,
    testVoice,
  };
}

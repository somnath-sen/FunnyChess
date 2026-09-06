import { AIPersonalityId, PersonalityDefinition, AIEmotionalState } from './types';

export const AI_PERSONALITIES: Record<AIPersonalityId, PersonalityDefinition> = {
  chill: {
    id: 'chill',
    nameKey: 'aiPersonality.chillName',
    descKey: 'aiPersonality.chillDesc',
    emoji: '😎',
    iconName: 'Coffee',
    avatarBg: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    accentColor: '#38bdf8',
    thinkingKey: 'aiPersonality.chillThinking',
    defaultEmotion: 'neutral',
    frequencyModifier: 1.0,
  },
  professor: {
    id: 'professor',
    nameKey: 'aiPersonality.professorName',
    descKey: 'aiPersonality.professorDesc',
    emoji: '🧠',
    iconName: 'GraduationCap',
    avatarBg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    accentColor: '#818cf8',
    thinkingKey: 'aiPersonality.professorThinking',
    defaultEmotion: 'neutral',
    frequencyModifier: 0.9,
  },
  troll: {
    id: 'troll',
    nameKey: 'aiPersonality.trollName',
    descKey: 'aiPersonality.trollDesc',
    emoji: '😈',
    iconName: 'Laugh',
    avatarBg: 'linear-gradient(135deg, #ec4899, #d946ef)',
    accentColor: '#f472b6',
    thinkingKey: 'aiPersonality.trollThinking',
    defaultEmotion: 'neutral',
    frequencyModifier: 1.2,
  },
  competitive: {
    id: 'competitive',
    nameKey: 'aiPersonality.competitiveName',
    descKey: 'aiPersonality.competitiveDesc',
    emoji: '😤',
    iconName: 'Flame',
    avatarBg: 'linear-gradient(135deg, #f97316, #ea580c)',
    accentColor: '#fb923c',
    thinkingKey: 'aiPersonality.competitiveThinking',
    defaultEmotion: 'neutral',
    frequencyModifier: 1.05,
  },
  grandmaster: {
    id: 'grandmaster',
    nameKey: 'aiPersonality.grandmasterName',
    descKey: 'aiPersonality.grandmasterDesc',
    emoji: '👑',
    iconName: 'Crown',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    accentColor: '#fbbf24',
    thinkingKey: 'aiPersonality.grandmasterThinking',
    defaultEmotion: 'neutral',
    frequencyModifier: 0.45, // Grandmaster speaks concisely and far less often
  },
};

export const PERSONALITY_LIST: AIPersonalityId[] = [
  'chill',
  'professor',
  'troll',
  'competitive',
  'grandmaster',
];

export const DEFAULT_PERSONALITY_ID: AIPersonalityId = 'chill';

export const EMOTION_CONFIG: Record<
  AIEmotionalState,
  { labelKey: string; emoji: string; badgeColor: string }
> = {
  neutral: {
    labelKey: 'aiEmotion.neutral',
    emoji: '😐',
    badgeColor: 'rgba(255, 255, 255, 0.1)',
  },
  confident: {
    labelKey: 'aiEmotion.confident',
    emoji: '🔥',
    badgeColor: 'rgba(245, 158, 11, 0.2)',
  },
  surprised: {
    labelKey: 'aiEmotion.surprised',
    emoji: '👀',
    badgeColor: 'rgba(56, 189, 248, 0.2)',
  },
  pressured: {
    labelKey: 'aiEmotion.pressured',
    emoji: '😰',
    badgeColor: 'rgba(239, 68, 68, 0.2)',
  },
  frustrated: {
    labelKey: 'aiEmotion.frustrated',
    emoji: '😤',
    badgeColor: 'rgba(225, 29, 72, 0.2)',
  },
  celebrating: {
    labelKey: 'aiEmotion.celebrating',
    emoji: '🎉',
    badgeColor: 'rgba(16, 185, 129, 0.2)',
  },
};

export const THINKING_STATUS_TEXT: Record<
  AIPersonalityId,
  { en: string; hi: string; bn: string }
> = {
  chill: {
    en: 'Thinking... 😎',
    hi: 'सोच रहा हूँ... 😎',
    bn: 'ভাবছি একটু... 😎',
  },
  professor: {
    en: 'Analyzing the position...',
    hi: 'स्थिति का विश्लेषण कर रहा हूँ...',
    bn: 'পজিশন বিশ্লেষণ করছি...',
  },
  troll: {
    en: 'Let me think about this... 😏',
    hi: 'ज़रा सोचने दीजिए... 😏',
    bn: 'দাঁড়ান একটু ভেবে নিই... 😏',
  },
  competitive: {
    en: 'Calculating your downfall...',
    hi: 'अगली चाल की गणना कर रहा हूँ...',
    bn: 'পরের চাল হিসেব করছি...',
  },
  grandmaster: {
    en: 'Considering...',
    hi: 'विचार कर रहा हूँ...',
    bn: 'বিবেচনা করছি...',
  },
};

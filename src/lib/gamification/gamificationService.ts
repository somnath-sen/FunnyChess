export interface ChessLevelInfo {
  level: number;
  title: { en: string; hi: string; bn: string };
  icon: string;
  minXP: number;
  maxXP: number;
}

export const CHESS_LEVELS: ChessLevelInfo[] = [
  {
    level: 1,
    title: { en: 'Pawn Rookie', hi: 'प्यादा नौसिखिया', bn: 'বোড়ে রুকি' },
    icon: '♟️',
    minXP: 0,
    maxXP: 250,
  },
  {
    level: 2,
    title: { en: 'Piece Explorer', hi: 'मोहरा खोजी', bn: 'ঘুঁটি অভিযাত্রী' },
    icon: '🐎',
    minXP: 250,
    maxXP: 600,
  },
  {
    level: 3,
    title: { en: 'Board Thinker', hi: 'बिसात विचारक', bn: 'দাবা চিন্তাবিদ' },
    icon: '🎯',
    minXP: 600,
    maxXP: 1200,
  },
  {
    level: 4,
    title: { en: 'Tactical Beginner', hi: 'सामरिक आरंभकर्ता', bn: 'কৌশলী শিক্ষার্থী' },
    icon: '⚡',
    minXP: 1200,
    maxXP: 2200,
  },
  {
    level: 5,
    title: { en: 'Chess Fighter', hi: 'शतरंज योद्धा', bn: 'দাবা যোদ্ধা' },
    icon: '⚔️',
    minXP: 2200,
    maxXP: 3800,
  },
  {
    level: 6,
    title: { en: 'Checkmate Hunter', hi: 'चेकमेट शिकारी', bn: 'কিস্তিমাত শিকারি' },
    icon: '👑',
    minXP: 3800,
    maxXP: 999999,
  },
];

export function getLevelFromXP(xp: number): ChessLevelInfo {
  for (let i = CHESS_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= CHESS_LEVELS[i].minXP) {
      return CHESS_LEVELS[i];
    }
  }
  return CHESS_LEVELS[0];
}

export interface AchievementItem {
  id: string;
  icon: string;
  title: { en: string; hi: string; bn: string };
  desc: { en: string; hi: string; bn: string };
  xpReward: number;
}

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'first_game',
    icon: '🏆',
    title: { en: 'First Game', hi: 'पहला मुकाबला', bn: 'প্রথম ম্যাচ' },
    desc: {
      en: 'Played your very first chess match',
      hi: 'अपना पहला शतरंज खेल खेला',
      bn: 'আপনার জীবনের প্রথম দাবার ম্যাচটি খেললেন',
    },
    xpReward: 50,
  },
  {
    id: 'all_pieces',
    icon: '♟️',
    title: { en: 'Piece Explorer', hi: 'सारे मोहरे सीखे', bn: 'ঘুঁটি বিশেষজ্ঞ' },
    desc: {
      en: 'Completed all foundational piece movement lessons',
      hi: 'सभी प्रमुख मोहरों की चाल सीखी',
      bn: 'দাবার সমস্ত ঘুঁটির চালের পাঠ সমাপ্ত করেছেন',
    },
    xpReward: 100,
  },
  {
    id: 'chess_student',
    icon: '📚',
    title: { en: 'Chess Student', hi: 'शतरंज विद्यार्थी', bn: 'দাবার মনোযোগী ছাত্র' },
    desc: {
      en: 'Completed at least 10 lessons in Learn Chess',
      hi: 'कम से कम 10 शतरंज अध्याय पूरे किए',
      bn: 'অন্তত ১০টি দাবার শিক্ষণীয় পাঠ সমাপ্ত করেছেন',
    },
    xpReward: 120,
  },
  {
    id: 'first_mate',
    icon: '🔥',
    title: { en: 'First Checkmate', hi: 'पहला चेकमेट', bn: 'প্রথম কিস্তিমাত' },
    desc: {
      en: 'Delivered your first victorious checkmate',
      hi: 'पहला विजयी चेकमेट दिया',
      bn: 'আপনার প্রথম বিজয়ী কিস্তিমাত সম্পন্ন করলেন',
    },
    xpReward: 100,
  },
  {
    id: 'first_hack',
    icon: '🧠',
    title: { en: 'First HACK', hi: 'पहला हैक (HACK)', bn: 'প্রথম হ্যাক পরামর্শ' },
    desc: {
      en: 'Used the HACK Learning Assistant to evaluate a position',
      hi: 'स्थिति समझने के लिए HACK का उपयोग किया',
      bn: 'বোর্ডের অবস্থান বুঝতে হ্যাক অ্যাসিস্ট্যান্ট ব্যবহার করেছেন',
    },
    xpReward: 50,
  },
  {
    id: 'good_moves',
    icon: '🎯',
    title: { en: 'Good Thinker', hi: 'कुशल विचारक', bn: 'সূক্ষ্ম চিন্তাবিদ' },
    desc: {
      en: 'Found high-accuracy tactical moves through practice',
      hi: 'अभ्यास में बेहतरीन सामरिक चालें खोजीं',
      bn: 'অনুশীলনের মাধ্যমে উচ্চমানের কৌশলগত চাল খুঁজে পেয়েছেন',
    },
    xpReward: 80,
  },
  {
    id: 'beat_easy',
    icon: '🟢',
    title: { en: 'Beat Easy AI', hi: 'आसान AI को हराया', bn: 'সহজ AI জয়ী' },
    desc: {
      en: 'Defeated the AI opponent on Easy difficulty',
      hi: 'Easy स्तर पर AI प्रतिद्वंद्वी को मात दी',
      bn: 'সহজ লেভেলে কৃত্রিম বুদ্ধিমত্তাকে পরাজিত করেছেন',
    },
    xpReward: 80,
  },
  {
    id: 'beat_inter',
    icon: '⚔️',
    title: { en: 'Beat Intermediate AI', hi: 'मध्यम AI पर विजय', bn: 'মাঝারি AI জয়ী' },
    desc: {
      en: 'Conquered the AI opponent on Intermediate difficulty',
      hi: 'Intermediate स्तर पर AI को हराया',
      bn: 'মাঝারি লেভেলে কঠিন লড়াইয়ে AI কে হারিয়েছেন',
    },
    xpReward: 120,
  },
  {
    id: 'beat_hard',
    icon: '💀',
    title: { en: 'Beat Hard AI', hi: 'कठिन AI को मात', bn: 'কঠিন AI বিজয়ী' },
    desc: {
      en: 'Triumphed against the formidable Hard Stockfish AI',
      hi: 'Hard Stockfish AI को पराजित किया',
      bn: 'অত্যন্ত কঠিন হার্ড AI কে পর্যুদস্ত করেছেন',
    },
    xpReward: 200,
  },
  {
    id: 'first_friend',
    icon: '👥',
    title: { en: 'First Friend Game', hi: 'मित्र के साथ पहला मैच', bn: 'বন্ধুর সাথে প্রথম খেলা' },
    desc: {
      en: 'Completed your first live multiplayer match with a friend',
      hi: 'मित्र के साथ पहला रीयल-टाइम मैच पूरा किया',
      bn: 'বন্ধুর সাথে সরাসরি রিয়েল-টাইম ম্যাচ সম্পন্ন করেছেন',
    },
    xpReward: 100,
  },
];

export interface PersistedGameRecord {
  id: string;
  game_type: 'ai' | 'friend';
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  playerColor: 'white' | 'black';
  difficulty?: string;
  movesCount: number;
  moveHistory: string[];
  initialFen?: string;
  date: string;
}

const STORAGE_GAME_HISTORY = 'funnychess_game_history';

export function getSavedGameHistory(): PersistedGameRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_GAME_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGameRecord(record: PersistedGameRecord): PersistedGameRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getSavedGameHistory();
    // Prepend new game, keep latest 30
    const updated = [record, ...history.filter((g) => g.id !== record.id)].slice(0, 30);
    localStorage.setItem(STORAGE_GAME_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

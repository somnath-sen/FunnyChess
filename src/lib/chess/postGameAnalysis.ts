import { Chess, Square, Move } from 'chess.js';
import { AIPersonalityId } from '@/lib/ai/personality/types';
import { detectFunnyMoments, FunnyMoment, LocalizedString } from './funnyMoments';

export type MoveQuality =
  | 'brilliant'
  | 'great'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder';

export interface AnalyzedMove {
  moveNumber: number;
  plyIndex: number; // 0-indexed in moveHistory
  san: string;
  from: string;
  to: string;
  piece: string;
  captured?: string;
  color: 'w' | 'b';
  isPlayerMove: boolean;
  fenBefore: string;
  fenAfter: string;
  quality: MoveQuality;
  explanation: LocalizedString;
  arrow?: { from: string; to: string; color: string };
  bestAlternative?: {
    from: string;
    to: string;
    san: string;
    explanation: LocalizedString;
  };
}

export interface GameAnalysisResult {
  performanceScore: number;
  performanceTier: {
    label: LocalizedString;
    color: string;
    badge: string;
  };
  bestMove: AnalyzedMove | null;
  biggestMistake: AnalyzedMove | null;
  missedOpportunity: AnalyzedMove | null;
  funnyMoments: FunnyMoment[];
  moves: AnalyzedMove[];
  coachAdvice: LocalizedString;
  stats: {
    brilliantCount: number;
    greatCount: number;
    goodCount: number;
    inaccuracyCount: number;
    mistakeCount: number;
    blunderCount: number;
    totalMoves: number;
  };
}

const PIECE_VALS: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

/**
 * Deterministically analyzes a completed game to produce actionable, beginner-friendly coaching feedback.
 * Operates purely locally and instantly without expensive network or paid API dependencies.
 */
export async function analyzeGame(
  moveHistory: string[],
  playerColor: 'white' | 'black' = 'white',
  gameResult: 'win' | 'loss' | 'draw' = 'win',
  personalityId: AIPersonalityId = 'chill'
): Promise<GameAnalysisResult> {
  const chess = new Chess();
  const analyzedMoves: AnalyzedMove[] = [];

  let brilliantCount = 0;
  let greatCount = 0;
  let goodCount = 0;
  let inaccuracyCount = 0;
  let mistakeCount = 0;
  let blunderCount = 0;

  let bestMoveCandidate: AnalyzedMove | null = null;
  let biggestMistakeCandidate: AnalyzedMove | null = null;
  let missedOppCandidate: AnalyzedMove | null = null;

  for (let i = 0; i < moveHistory.length; i++) {
    const san = moveHistory[i];
    const isPlayerMove =
      (i % 2 === 0 && playerColor === 'white') ||
      (i % 2 === 1 && playerColor === 'black');

    const moveNumber = Math.floor(i / 2) + 1;
    const fenBefore = chess.fen();

    // Check if there was a missed mate in 1 on player move
    let hadMissedMate = false;
    let alternativeMateMove: Move | null = null;

    if (isPlayerMove) {
      const legalMoves = chess.moves({ verbose: true });
      for (const m of legalMoves) {
        chess.move(m);
        if (chess.isCheckmate()) {
          hadMissedMate = true;
          alternativeMateMove = m;
          chess.undo();
          break;
        }
        chess.undo();
      }
    }

    // Execute move
    const move = chess.move(san);
    if (!move) break;

    const fenAfter = chess.fen();
    let quality: MoveQuality = 'good';
    let explanation: LocalizedString = {
      en: 'Solid development maintaining positional control.',
      hi: 'संतुलित चाल जो बोर्ड पर नियंत्रण बनाए रखती है।',
      bn: 'সুসংহত চাল যা বোর্ডে নিয়ন্ত্রণ বজায় রাখে।',
    };

    let arrowColor = '#10b981'; // Green default

    // Detect quality and human-friendly explanation
    if (chess.isCheckmate() || san.includes('#')) {
      if (move.captured || move.piece === 'n' || move.piece === 'b') {
        quality = 'brilliant';
        arrowColor = '#8b5cf6';
        explanation = {
          en: 'Brilliant decisive checkmate! Clinical tactical finish.',
          hi: 'अद्भुत निर्णायक चेकमेट! मुकाबले का बेहतरीन अंत।',
          bn: 'অসাধারণ কিস্তিমাত! নিখুঁত কৌশলগত ফিনিশ।',
        };
      } else {
        quality = 'great';
        arrowColor = '#f59e0b'; // Gold
        explanation = {
          en: 'Decisive checkmate! Clean execution to seal victory.',
          hi: 'निर्णायक चेकमेट! जीत पक्की करने वाली बेहतरीन चाल।',
          bn: 'নির্ণায়ক কিস্তিমাত! জয় নিশ্চিত করতে নিখুঁত চাল।',
        };
      }
    } else if (hadMissedMate && !san.includes('#')) {
      quality = 'mistake';
      arrowColor = '#f97316';
      explanation = {
        en: `Missed immediate checkmate with ${alternativeMateMove?.san || 'a direct attack'}.`,
        hi: `${alternativeMateMove?.san || 'सीधे हमले'} से तत्काल चेकमेट का मौका चूक गया।`,
        bn: `${alternativeMateMove?.san || 'সরাসরি আক্রমণ'} দিয়ে তাৎক্ষণিক কিস্তিমাত ফসকে গেল।`,
      };
    } else if (move.captured === 'q') {
      quality = 'great';
      arrowColor = '#10b981';
      explanation = {
        en: "Captured the opponent's Queen, gaining huge material advantage!",
        hi: 'विपक्षी रानी को काटकर भारी बढ़त हासिल की!',
        bn: 'প্রতিপক্ষের রানি কেটে বিশাল সুবিধাজনক অবস্থানে পৌঁছে গেলেন!',
      };
    } else if (move.piece === 'q' && !move.captured) {
      // Check if Queen was hung
      const opponentResponses = chess.moves({ verbose: true });
      const capturesQueen = opponentResponses.find((om) => om.to === move.to);
      if (capturesQueen) {
        quality = 'blunder';
        arrowColor = '#ef4444';
        explanation = {
          en: 'Moved the Queen onto an attacked square without enough defense.',
          hi: 'रानी को बिना पर्याप्त सुरक्षा के सीधे खतरे में डाल दिया।',
          bn: 'রানিকে যথেষ্ট ব্যাকআপ ছাড়া সরাসরি আক্রমণের মুখে নিয়ে গেলেন।',
        };
      }
    } else if (move.flags.includes('k') || move.flags.includes('q')) {
      quality = 'good';
      explanation = {
        en: 'Castled to ensure King safety and activate the rook.',
        hi: 'कैसलिंग करके राजा को सुरक्षित किया और हाथी को सक्रिय किया।',
        bn: 'ক্যাসলিং করে রাজাকে নিরাপদে রাখলেন এবং নৌকা সক্রিয় করলেন।',
      };
    } else if (move.piece === 'k' && !move.flags.includes('k') && !move.flags.includes('q') && moveNumber < 15 && !san.includes('+')) {
      quality = 'inaccuracy';
      arrowColor = '#eab308';
      explanation = {
        en: 'Early king move surrendered castling rights without immediate threat.',
        hi: 'शुरुआत में राजा को हिलाने से कैसलिंग का अधिकार चला गया।',
        bn: 'শুরুতেই রাজাকে সরিয়ে ক্যাসলিং সুবিধা হারালেন।',
      };
    } else if (move.san.includes('+')) {
      quality = 'great';
      arrowColor = '#3b82f6';
      explanation = {
        en: 'Aggressive check forcing the opponent king into defense.',
        hi: 'आक्रामक चेक जिससे विपक्षी राजा बचाव की मुद्रा में आ गया।',
        bn: 'আক্রমণাত্মক কিস্তি যা প্রতিপক্ষের রাজাকে ডিফেন্সে নামতে বাধ্য করল।',
      };
    } else if (move.captured && PIECE_VALS[move.captured] >= 3) {
      quality = 'great';
      arrowColor = '#10b981';
      explanation = {
        en: 'Won valuable material in a favorable piece exchange.',
        hi: 'फायदेमंद सौदे में एक महत्वपूर्ण मोहरा जीता।',
        bn: 'সুবিধাজনক আদানপ্রদানে একটি মূল্যবান ঘুঁটি দখল করলেন।',
      };
    }

    // Tally stats for player moves
    if (isPlayerMove) {
      const q: MoveQuality = quality;
      if (q === 'brilliant') brilliantCount++;
      else if (q === 'great') greatCount++;
      else if (q === 'good') goodCount++;
      else if (q === 'inaccuracy') inaccuracyCount++;
      else if (q === 'mistake') mistakeCount++;
      else if (q === 'blunder') blunderCount++;
    }

    const analyzedItem: AnalyzedMove = {
      moveNumber,
      plyIndex: i,
      san,
      from: move.from,
      to: move.to,
      piece: move.piece,
      captured: move.captured,
      color: move.color,
      isPlayerMove,
      fenBefore,
      fenAfter,
      quality,
      explanation,
      arrow: { from: move.from, to: move.to, color: arrowColor },
      bestAlternative:
        hadMissedMate && alternativeMateMove
          ? {
              from: alternativeMateMove.from,
              to: alternativeMateMove.to,
              san: alternativeMateMove.san,
              explanation: {
                en: `Winning sequence: ${alternativeMateMove.san} delivered checkmate.`,
                hi: `विजयी चाल: ${alternativeMateMove.san} से चेकमेट हो रहा था।`,
                bn: `বিজয়ী চাল: ${alternativeMateMove.san} দিয়ে কিস্তিমাত হচ্ছিল।`,
              },
            }
          : undefined,
    };

    analyzedMoves.push(analyzedItem);

    // Track Best Move and Biggest Mistake candidates for the player
    if (isPlayerMove) {
      if (
        !bestMoveCandidate ||
        (quality === 'great' && bestMoveCandidate.quality !== 'great') ||
        san.includes('#')
      ) {
        bestMoveCandidate = analyzedItem;
      }

      if (quality === 'blunder') {
        biggestMistakeCandidate = analyzedItem;
      } else if (quality === 'mistake' && (!biggestMistakeCandidate || biggestMistakeCandidate.quality !== 'blunder')) {
        biggestMistakeCandidate = analyzedItem;
      }

      if (hadMissedMate && !missedOppCandidate) {
        missedOppCandidate = analyzedItem;
      }
    }
  }

  // Calculate Deterministic Performance Score (0-100)
  const playerMovesCount = Math.max(
    1,
    analyzedMoves.filter((m) => m.isPlayerMove).length
  );

  let rawScore = 72;

  // Outcome modifier
  if (gameResult === 'win') rawScore += 16;
  else if (gameResult === 'draw') rawScore += 8;
  else rawScore -= 8;

  // Quality ratios
  const greatRatio = (greatCount + brilliantCount) / playerMovesCount;
  const mistakeRatio = (mistakeCount + blunderCount) / playerMovesCount;

  rawScore += Math.round(greatRatio * 18);
  rawScore -= Math.round(mistakeRatio * 24);

  // Bounds clamp
  const performanceScore = Math.max(30, Math.min(98, rawScore));

  // Determine Performance Tier
  let performanceTier: GameAnalysisResult['performanceTier'];
  if (performanceScore >= 90) {
    performanceTier = {
      label: {
        en: 'Outstanding',
        hi: 'असाधारण',
        bn: 'অসাধারণ',
      },
      color: '#10b981',
      badge: '👑',
    };
  } else if (performanceScore >= 80) {
    performanceTier = {
      label: {
        en: 'Great Play',
        hi: 'शानदार खेल',
        bn: 'চমৎকার খেলা',
      },
      color: '#34d399',
      badge: '⭐',
    };
  } else if (performanceScore >= 70) {
    performanceTier = {
      label: {
        en: 'Solid Game',
        hi: 'संतुलित मुकाबला',
        bn: 'সুষম লড়াই',
      },
      color: '#f59e0b',
      badge: '🎯',
    };
  } else if (performanceScore >= 55) {
    performanceTier = {
      label: {
        en: 'Fighting Spirit',
        hi: 'जुझारू प्रयास',
        bn: 'লড়াকু প্রচেষ্টা',
      },
      color: '#fb923c',
      badge: '⚔️',
    };
  } else {
    performanceTier = {
      label: {
        en: 'Needs Practice',
        hi: 'अभ्यास की ज़रूरत',
        bn: 'অনুশীলন প্রয়োজন',
      },
      color: '#f87171',
      badge: '🌱',
    };
  }

  // Generate actionable, friendly coach advice
  let coachAdvice: LocalizedString;
  if (blunderCount > 0) {
    coachAdvice = {
      en: 'Golden Rule: Before touching any piece, look twice to ensure none of your heavy pieces are left hanging!',
      hi: 'अहम सीख: चाल चलने से पहले एक बार ज़रूर देखें कि आपका कोई बड़ा मोहरा बिना बचाव के तो नहीं छूटा!',
      bn: 'সোনার নিয়ম: কোনো ঘুঁটিতে হাত দেওয়ার আগে নিশ্চিত হন যে আপনার কোনো বড় ঘুঁটি অরক্ষিত পড়ে নেই!',
    };
  } else if (missedOppCandidate) {
    coachAdvice = {
      en: 'Keep scanning for forcing moves: checks, captures, and threats often reveal quick checkmates!',
      hi: 'हमलावर चालों पर नज़र रखें: चेक और मोहरों के शिकार से कई बार तुरंत जीत मिल जाती है!',
      bn: 'আক্রমণাত্মক চালের দিকে নজর রাখুন: কিস্তি এবং ঘুঁটি ধরার সুযোগ অনেক সময় দ্রুত জয় এনে দেয়!',
    };
  } else if (gameResult === 'win') {
    coachAdvice = {
      en: 'Excellent tactical vision! You capitalized on weaknesses and converted your advantage cleanly.',
      hi: 'शानदार रणनीति! आपने मौके का फायदा उठाया और बढ़त को जीत में बदल दिया।',
      bn: 'চমৎকার কৌশলগত দৃষ্টি! আপনি সুযোগ কাজে লাগিয়ে পরিচ্ছন্নভাবে জয় তুলে নিলেন।',
    };
  } else {
    coachAdvice = {
      en: 'Good fight! Work on piece coordination and king safety in the opening to dominate the center.',
      hi: 'अच्छा मुकाबला! शुरुआत में राजा की सुरक्षा और मोहरों के तालमेल पर ध्यान देने से खेल और मजबूत होगा।',
      bn: 'ভালো লড়াই! শুরুতে রাজার সুরক্ষা এবং ঘুঁটির মেলবন্ধনে জোর দিলে বোর্ডের নিয়ন্ত্রণ আপনার হাতে থাকবে।',
    };
  }

  // Detect funny / memorable moments
  const funnyMoments = detectFunnyMoments(moveHistory, playerColor, personalityId);

  return {
    performanceScore,
    performanceTier,
    bestMove: bestMoveCandidate,
    biggestMistake: biggestMistakeCandidate,
    missedOpportunity: missedOppCandidate,
    funnyMoments,
    moves: analyzedMoves,
    coachAdvice,
    stats: {
      brilliantCount,
      greatCount,
      goodCount,
      inaccuracyCount,
      mistakeCount,
      blunderCount,
      totalMoves: playerMovesCount,
    },
  };
}

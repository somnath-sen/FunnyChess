import { Chess } from 'chess.js';
import { AIPersonalityId } from '@/lib/ai/personality/types';

export type FunnyMomentType =
  | 'missed_mate'
  | 'queen_blunder'
  | 'hanging_piece'
  | 'brilliant_tactic'
  | 'comeback'
  | 'queen_sacrifice'
  | 'repeated_move'
  | 'stalemate'
  | 'back_rank_mate'
  | 'fork'
  | 'pin'
  | 'chaos_fallback';

export interface LocalizedString {
  en: string;
  hi: string;
  bn: string;
}

export interface FunnyMoment {
  id: string;
  type: FunnyMomentType;
  title: LocalizedString;
  quote: LocalizedString;
  description: LocalizedString;
  moveIndex: number; // 0-based index in move history
  fen: string;
  highlightSquares: string[];
  arrow?: { from: string; to: string; color: string };
  personalityComment?: {
    personaId: AIPersonalityId;
    text: LocalizedString;
  };
}

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

/**
 * Deterministically detect memorable and funny moments from a completed game
 */
export function detectFunnyMoments(
  moveHistory: string[],
  playerColor: 'white' | 'black' = 'white',
  personalityId: AIPersonalityId = 'chill'
): FunnyMoment[] {
  const detectedMoments: FunnyMoment[] = [];
  if (!moveHistory || moveHistory.length === 0) return detectedMoments;

  const chess = new Chess();
  const playerTurnColor = playerColor === 'white' ? 'w' : 'b';

  let minPlayerAdvantage = 0;
  let hasBeenDownMaterial = false;

  // Track moves history for repetition
  const fenSeenCount: Record<string, number> = {};

  for (let i = 0; i < moveHistory.length; i++) {
    const san = moveHistory[i];
    const isPlayerMove = (i % 2 === 0 && playerColor === 'white') ||
                         (i % 2 === 1 && playerColor === 'black');

    const fenBefore = chess.fen();

    // Check if player had mate in 1 in the position BEFORE their move
    if (isPlayerMove) {
      const legalMoves = chess.moves({ verbose: true });
      const matingMove = legalMoves.find((m) => {
        chess.move(m);
        const isMate = chess.isCheckmate();
        chess.undo();
        return isMate;
      });

      if (matingMove && !san.includes('#')) {
        // Player had mate in 1, but missed it!
        detectedMoments.push({
          id: `missed_mate_${i}`,
          type: 'missed_mate',
          title: {
            en: '😂 Missed Checkmate',
            hi: '😂 चेकमेट का मौका छूटा!',
            bn: '😂 কিস্তিমাত ফসকে গেল!',
          },
          quote: {
            en: '“You had mate in 1... and chose chaos.”',
            hi: '“चेकमेट का मौका था... पर आपने ड्रामा चुना!”',
            bn: '“কিস্তিমাত হাতের মুঠোয় ছিল... আর আপনি অন্য কিছু বেছে নিলেন!”',
          },
          description: {
            en: `You could have delivered immediate checkmate with ${matingMove.san}!`,
            hi: `आप ${matingMove.san} चलकर तुरंत मैच जीत सकते थे!`,
            bn: `আপনি ${matingMove.san} চেলে সাথে সাথে খেলা শেষ করতে পারতেন!`,
          },
          moveIndex: i,
          fen: fenBefore,
          highlightSquares: [matingMove.from, matingMove.to],
          arrow: { from: matingMove.from, to: matingMove.to, color: '#10b981' },
          personalityComment: {
            personaId: personalityId,
            text: {
              en: 'Phew! I saw that mate in my nightmares. Thanks for sparing me! 😅',
              hi: 'उफ्फ! मुझे लगा अब मेरा खेल खत्म, शुक्रिया बख्शने के लिए! 😅',
              bn: 'উফফ! ভাবলাম খেলা তো শেষ, বাঁচিয়ে দেওয়ার জন্য ধন্যবাদ! 😅',
            },
          },
        });
      }
    }

    // Execute the move
    const move = chess.move(san);
    if (!move) break;

    const fenAfter = chess.fen();
    const fenKey = fenAfter.split(' ').slice(0, 3).join(' ');
    fenSeenCount[fenKey] = (fenSeenCount[fenKey] || 0) + 1;

    // Check Queen Blunder / Queen Sacrifice
    if (move.piece === 'q' && move.captured !== 'q') {
      // Check if queen moved into an attacked square
      const opponentMoves = chess.moves({ verbose: true });
      const queenAttacked = opponentMoves.some((om) => om.to === move.to);

      if (queenAttacked) {
        // Did it lead to mate for the player?
        if (chess.isCheckmate() || san.includes('#')) {
          detectedMoments.push({
            id: `queen_sac_${i}`,
            type: 'queen_sacrifice',
            title: {
              en: '👑 Glorious Queen Sacrifice',
              hi: '👑 रानी का ऐतिहासिक बलिदान!',
              bn: '👑 রানির ঐতিহাসিক আত্মবলিদান!',
            },
            quote: {
              en: '“Your queen sacrificed herself for the grand master plan.”',
              hi: '“रानी ने एक बड़े मिशन के लिए कुर्बानी दी!”',
              bn: '“রানি এক ঐতিহাসিক পরিকল্পনার জন্য আত্মবলিদান দিল!”',
            },
            description: {
              en: 'Sacrificing the most valuable piece to deliver a textbook checkmate!',
              hi: 'जीत की खातिर सबसे कीमती मोहरे का साहसिक बलिदान!',
              bn: 'জয়ের লক্ষ্যে সবচেয়ে মূল্যবান ঘুঁটির সাহসী আত্মত্যাগ!',
            },
            moveIndex: i,
            fen: fenBefore,
            highlightSquares: [move.from, move.to],
            arrow: { from: move.from, to: move.to, color: '#f59e0b' },
          });
        } else if (isPlayerMove && moveHistory.length > i + 1) {
          // Did the opponent immediately take the queen?
          const nextMove = chess.history({ verbose: true })[i + 1];
          if (nextMove && nextMove.to === move.to) {
            detectedMoments.push({
              id: `queen_blunder_${i}`,
              type: 'queen_blunder',
              title: {
                en: '🤦 Queen Retirement Notice',
                hi: '🤦 रानी साहिबा का संन्यास!',
                bn: '🤦 রানির অকাল অবসর!',
              },
              quote: {
                en: '“Your queen just volunteered for early retirement.”',
                hi: '“रानी साहिबा ने अचानक समय से पहले संन्यास ले लिया!”',
                bn: '“রানি মশাই হঠাৎ সময়ের আগেই অবসরে চলে গেল!”',
              },
              description: {
                en: 'The queen moved onto a targeted square without adequate defense.',
                hi: 'रानी बिना किसी सुरक्षा के सीधे निशाने पर आ गई।',
                bn: 'রানি কোনো ব্যাকআপ ছাড়াই সরাসরি আক্রমণের মুখে চলে এল।',
              },
              moveIndex: i,
              fen: fenBefore,
              highlightSquares: [move.from, move.to],
              arrow: { from: move.from, to: move.to, color: '#ef4444' },
              personalityComment: {
                personaId: personalityId,
                text: {
                  en: 'I almost felt guilty taking that queen. Almost! 😂',
                  hi: 'रानी लेते हुए मुझे थोड़ा सा बुरा लगा... बस थोड़ा सा! 😂',
                  bn: 'রানিটা নেওয়ার সময় আমার একটু মন খারাপ হয়েছিল... সামান্য! 😂',
                },
              },
            });
          }
        }
      }
    }

    // Fork detection (Knight attacking King & Queen or two heavy pieces)
    if (move.piece === 'n') {
      const knightAttacks = chess.moves({ verbose: true }).filter((m) => m.from === move.to);
      const highValueTargets = knightAttacks.filter((m) => m.captured && ['k', 'q', 'r'].includes(m.captured));
      if (highValueTargets.length >= 2) {
        detectedMoments.push({
          id: `fork_${i}`,
          type: 'fork',
          title: {
            en: '🎯 The Royal Fork',
            hi: '🎯 घातक दोहरा वार (Fork)!',
            bn: '🎯 মারাত্মক কাঁটা চাল (Fork)!',
          },
          quote: {
            en: '“One horse. Two targets. Very efficient.”',
            hi: '“एक घोड़ा, दो शिकार! कमाल की चाल।”',
            bn: '“এক ঘোড়ায় দুই শিকার! অসম্ভব ক্ষিপ্র।”',
          },
          description: {
            en: 'The knight branched out to threaten multiple high-value targets simultaneously.',
            hi: 'घोड़े ने एक साथ दो बड़े मोहरों पर हमला बोल दिया।',
            bn: 'ঘোড়াটি একই সাথে দুটি বড় ঘুঁটিকে আক্রমণের মুখে ফেলে দিল।',
          },
          moveIndex: i,
          fen: fenBefore,
          highlightSquares: [move.from, move.to, ...highValueTargets.map((t) => t.to)],
          arrow: { from: move.from, to: move.to, color: '#3b82f6' },
        });
      }
    }

    // Calculate material balance
    const board = chess.board();
    let whiteMat = 0;
    let blackMat = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          const val = PIECE_VALUES[piece.type] || 0;
          if (piece.color === 'w') whiteMat += val;
          else blackMat += val;
        }
      }
    }

    const currentDiff = playerColor === 'white' ? whiteMat - blackMat : blackMat - whiteMat;
    if (currentDiff <= -6) {
      hasBeenDownMaterial = true;
    }
  }

  // End of game events
  const isCheckmate = chess.isCheckmate();
  const isDraw = chess.isDraw();

  // 1. Back rank mate
  if (isCheckmate) {
    const lastMove = chess.history({ verbose: true }).slice(-1)[0];
    if (lastMove && (lastMove.to.endsWith('1') || lastMove.to.endsWith('8')) && ['r', 'q'].includes(lastMove.piece)) {
      detectedMoments.push({
        id: 'back_rank_mate',
        type: 'back_rank_mate',
        title: {
          en: '💀 The Back Rank Trap',
          hi: '💀 आखिरी पंक्ति का फंदा!',
          bn: '💀 পেছনের সারির ফাঁদ!',
        },
        quote: {
          en: '“The back rank had absolutely no escape.”',
          hi: '“आखिरी पंक्ति में राजा के लिए कोई रास्ता नहीं बचा था!”',
          bn: '“পেছনের সারিতে রাজার পালানোর কোনো পথই ছিল না!”',
        },
        description: {
          en: 'The enemy king was suffocated behind their own loyal pawns.',
          hi: 'राजा अपने ही प्यादों के पीछे फंसा रह गया।',
          bn: 'রাজা মশাই নিজের বোড়েদের আড়ালেই অবরুদ্ধ হয়ে পড়ল।',
        },
        moveIndex: moveHistory.length - 1,
        fen: chess.fen(),
        highlightSquares: [lastMove.from, lastMove.to],
        arrow: { from: lastMove.from, to: lastMove.to, color: '#ef4444' },
      });
    }
  }

  // 2. Epic Comeback
  if (hasBeenDownMaterial && isCheckmate) {
    const lastTurn = chess.turn();
    const winningColor = lastTurn === 'w' ? 'black' : 'white';
    if (winningColor === playerColor) {
      detectedMoments.push({
        id: 'epic_comeback',
        type: 'comeback',
        title: {
          en: '🔥 Legendary Comeback',
          hi: '🔥 ऐतिहासिक वापसी!',
          bn: '🔥 ইতিহাস গড়া প্রত্যাবর্তন!',
        },
        quote: {
          en: '“You were on the ropes and somehow turned this entirely around.”',
          hi: '“हार के कगार से ऐसी शानदार वापसी!”',
          bn: '“পরাজয়ের মুখে দাঁড়িয়ে খেলাটা সম্পূর্ণ ঘুরিয়ে দিলেন!”',
        },
        description: {
          en: 'Trailing by heavy material, you kept your composure and delivered the final blow!',
          hi: 'मोहरों में काफी पीछे होने के बावजूद आपने धैर्य रखा और मैच जीत लिया!',
          bn: 'ঘুঁটিতে অনেক পিছিয়ে থেকেও মাথা ঠান্ডা রেখে অন্তিম কিস্তি দিলেন!',
        },
        moveIndex: moveHistory.length - 1,
        fen: chess.fen(),
        highlightSquares: [],
      });
    }
  }

  // 3. Tragic / Funny Stalemate
  if (isDraw && chess.isStalemate()) {
    detectedMoments.push({
      id: 'tragic_stalemate',
      type: 'stalemate',
      title: {
        en: '🧱 The Accidental Stalemate',
        hi: '🧱 अचानक हो गया गतिरोध (Stalemate)!',
        bn: '🧱 আচমকা ড্র হয়ে গেল (Stalemate)!',
      },
      quote: {
        en: '“So close to glory... and then nobody could move.”',
        hi: '“जीत इतनी करीब थी... और फिर राजा के पास कोई चाल ही नहीं बची!”',
        bn: '“জয় এত কাছে ছিল... আর তারপর কোনো চালই দেওয়া গেল না!”',
      },
      description: {
        en: 'A completely winning position slipped into an immediate draw!',
        hi: 'एकतरफा जीती हुई बाजी अचानक ड्रॉ में बदल गई!',
        bn: 'নিশ্চিত জয়ের ম্যাচ মুহূর্তের মধ্যে ড্রতে পরিণত হলো!',
      },
      moveIndex: moveHistory.length - 1,
      fen: chess.fen(),
      highlightSquares: [],
    });
  }

  // 4. Repeated Shuffle
  const maxRepetition = Math.max(0, ...Object.values(fenSeenCount));
  if (maxRepetition >= 3) {
    detectedMoments.push({
      id: 'repeated_shuffle',
      type: 'repeated_move',
      title: {
        en: '🫠 The Infinite Dance',
        hi: '🫠 अंतहीन चक्रव्यूह!',
        bn: '🫠 অনন্ত চক্রে ঘোরাফেরা!',
      },
      quote: {
        en: '“Both sides apparently forgot there are 63 other squares.”',
        hi: '“दोनों खिलाड़ी शायद भूल गए कि बोर्ड पर 63 और खाने भी हैं!”',
        bn: '“দুজনই বোধহয় ভুলে গিয়েছিলেন যে বোর্ডে আরও ৬৩টি ঘর আছে!”',
      },
      description: {
        en: 'The same position repeated multiple times in a diplomatic standoff.',
        hi: 'एक ही स्थिति बार-बार दोहराई गई।',
        bn: 'একই পজিশন বারবার পুনরাবৃত্তি হলো।',
      },
      moveIndex: moveHistory.length - 1,
      fen: chess.fen(),
      highlightSquares: [],
    });
  }

  // Priority Sorting for Funny Moments
  const PRIORITY_MAP: Record<FunnyMomentType, number> = {
    back_rank_mate: 1,
    missed_mate: 2,
    queen_blunder: 3,
    queen_sacrifice: 4,
    comeback: 5,
    stalemate: 6,
    fork: 7,
    pin: 8,
    brilliant_tactic: 9,
    hanging_piece: 10,
    repeated_move: 11,
    chaos_fallback: 12,
  };

  detectedMoments.sort((a, b) => (PRIORITY_MAP[a.type] || 99) - (PRIORITY_MAP[b.type] || 99));

  // If no chaotic/funny moment occurred, provide a subtle, graceful fallback
  if (detectedMoments.length === 0) {
    detectedMoments.push({
      id: 'quiet_discipline',
      type: 'chaos_fallback',
      title: {
        en: '😌 Pure Tactical Discipline',
        hi: '😌 शांत और सुलझा हुआ खेल',
        bn: '😌 শান্ত ও সুশৃঙ্খল খেলা',
      },
      quote: {
        en: '“Not much chaos this time, just solid chess principles.”',
        hi: '“इस बार कोई ड्रामा नहीं, बस संतुलित और समझदारी भरा खेल।”',
        bn: '“এবার কোনো হুলস্থুল নয়, একদম সংযত ও সুন্দর দাবা খেলা।”',
      },
      description: {
        en: 'A steady game with clean moves and zero theatrical blunders.',
        hi: 'एक साफ-सुथरा मुकाबला जिसमें कोई बड़ी चूक नहीं हुई।',
        bn: 'একটি পরিচ্ছন্ন ম্যাচ যেখানে কোনো বড় ধরনের ভুল চাল ছিল না।',
      },
      moveIndex: Math.max(0, moveHistory.length - 1),
      fen: chess.fen(),
      highlightSquares: [],
    });
  }

  // Return the top 1-3 best moments
  return detectedMoments.slice(0, 3);
}

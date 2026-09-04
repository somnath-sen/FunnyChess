import { Chess, Square, Move } from 'chess.js';
import { chessAI } from '@/lib/chess/aiEngine';

export interface HackAnalysis {
  fen: string;
  turn: 'w' | 'b';
  bestMove: {
    from: string;
    to: string;
    san: string;
    piece: string;
    promotion?: string;
  } | null;
  whyPoints: string[];
  threats: {
    text: string;
    squares: string[];
    severity: 'high' | 'medium' | 'none';
  }[];
  tactics: {
    type: 'fork' | 'pin' | 'skewer' | 'hanging' | 'mate';
    title: string;
    desc: string;
    squares: string[];
  }[];
  alternatives: {
    san: string;
    desc: string;
  }[];
  principle: string;
  lessonLink?: {
    title: string;
    slug: string;
  };
  evaluation: number; // centipawns / score
  checklist: string[];
}

const PIECE_NAMES: Record<string, { en: string; hi: string; bn: string; lesson: string }> = {
  p: { en: 'Pawn', hi: 'प्यादा', bn: 'বোড়ে', lesson: 'the-pawn' },
  n: { en: 'Knight', hi: 'घोड़ा', bn: 'ঘোড়া', lesson: 'the-knight' },
  b: { en: 'Bishop', hi: 'ऊंट', bn: 'গজ', lesson: 'the-bishop' },
  r: { en: 'Rook', hi: 'हाथी', bn: 'নৌকা', lesson: 'the-rook' },
  q: { en: 'Queen', hi: 'वज़ीर / रानी', bn: 'রানি', lesson: 'the-queen' },
  k: { en: 'King', hi: 'राजा', bn: 'রাজা', lesson: 'the-king' },
};

// Center squares
const CENTER_SQUARES = ['d4', 'e4', 'd5', 'e5', 'c4', 'c5', 'f4', 'f5'];

export async function analyzePosition(
  fen: string,
  lang: 'en' | 'hi' | 'bn' = 'en'
): Promise<HackAnalysis> {
  const chess = new Chess(fen);
  const turn = chess.turn();

  // If game is over, return empty analysis
  if (chess.isGameOver()) {
    return {
      fen,
      turn,
      bestMove: null,
      whyPoints: [
        lang === 'hi' ? 'खेल समाप्त हो चुका है।' : lang === 'bn' ? 'খেলা সমাপ্ত হয়ে গেছে।' : 'The game is over.',
      ],
      threats: [],
      tactics: [],
      alternatives: [],
      principle:
        lang === 'hi' ? 'समीक्षा: खेल के नतीजों का विश्लेषण करें।' : lang === 'bn' ? 'পর্যালোচনা: খেলার ফলাফল বিশ্লেষণ করুন।' : 'Review the game to learn from key moments.',
      evaluation: 0,
      checklist: [],
    };
  }

  // 1. Calculate Best Move using the existing AI engine
  let bestMoveResult: { from: string; to: string; promotion?: string; evaluation?: number } | null = null;
  let bestMoveObj: Move | null = null;
  const legalMoves = chess.moves({ verbose: true });

  try {
    bestMoveResult = await chessAI.getBestMove(chess, 'hard');
    if (bestMoveResult) {
      bestMoveObj =
        legalMoves.find((m) => m.from === bestMoveResult!.from && m.to === bestMoveResult!.to) || legalMoves[0];
    }
  } catch {
    bestMoveObj = legalMoves[0] || null;
  }

  // 2. Identify Alternatives (next best legal moves)
  const alternatives: { san: string; desc: string }[] = [];
  const otherMoves = legalMoves.filter(
    (m) => !(m.from === bestMoveObj?.from && m.to === bestMoveObj?.to)
  );

  if (otherMoves.length > 0) {
    const alt1 = otherMoves[0];
    alternatives.push({
      san: alt1.san,
      desc:
        lang === 'hi'
          ? `सॉलिड विकल्प: ${alt1.san}`
          : lang === 'bn'
          ? `দৃঢ় বিকল্প: ${alt1.san}`
          : `Solid alternative: ${alt1.san}`,
    });
  }
  if (otherMoves.length > 1) {
    const alt2 = otherMoves[1];
    alternatives.push({
      san: alt2.san,
      desc:
        lang === 'hi'
          ? `दूसरा विकल्प: ${alt2.san}`
          : lang === 'bn'
          ? `দ্বিতীয় বিকল্প: ${alt2.san}`
          : `Another option: ${alt2.san}`,
    });
  }

  // 3. Why is the best move good? (Construct concrete educational reasons)
  const whyPoints: string[] = [];
  if (bestMoveObj) {
    const pInfo = PIECE_NAMES[bestMoveObj.piece] || PIECE_NAMES.p;
    const pieceLabel = pInfo[lang];

    if (bestMoveObj.captured) {
      const capturedName = (PIECE_NAMES[bestMoveObj.captured] || PIECE_NAMES.p)[lang];
      whyPoints.push(
        lang === 'hi'
          ? `💥 ${pieceLabel} से विपक्षी ${capturedName} को काटकर बढ़त बनाता है।`
          : lang === 'bn'
          ? `💥 ${pieceLabel} দিয়ে প্রতিপক্ষের ${capturedName} কেটে সুবিধা অর্জন করে।`
          : `💥 Captures the opponent's ${capturedName} to gain material advantage.`
      );
    }

    if (bestMoveObj.san.includes('+')) {
      whyPoints.push(
        lang === 'hi'
          ? `⚠️ विपक्षी राजा को चेक देकर दबाव में डालता है!`
          : lang === 'bn'
          ? `⚠️ প্রতিপক্ষের রাজাকে কিস্তি দিয়ে চাপে ফেলে!`
          : `⚠️ Puts the opponent’s King in immediate check!`
      );
    }

    if (bestMoveObj.san.includes('#')) {
      whyPoints.push(
        lang === 'hi'
          ? `👑 निर्णायक चेकमेट! खेल तुरंत समाप्त होता है!`
          : lang === 'bn'
          ? `👑 নিশ্চিত কিস্তিমাত! খেলা এখানেই শেষ!`
          : `👑 Immediate checkmate! Delivers the game-winning blow!`
      );
    }

    if (bestMoveObj.flags.includes('k') || bestMoveObj.flags.includes('q')) {
      whyPoints.push(
        lang === 'hi'
          ? `🏰 राजा को सुरक्षित किले में ले जाता है और हाथी को सक्रिय करता है।`
          : lang === 'bn'
          ? `🏰 রাজাকে কেল্লায় সুরক্ষিত করে এবং কিস্তিকে সক্রিয় করে।`
          : `🏰 Castles the King to safety and activates your Rook.`
      );
    }

    if (CENTER_SQUARES.includes(bestMoveObj.to)) {
      whyPoints.push(
        lang === 'hi'
          ? `🎯 बोर्ड के महत्वपूर्ण केंद्रीय वर्ग ${bestMoveObj.to} पर नियंत्रण बढ़ाता है।`
          : lang === 'bn'
          ? `🎯 বোর্ডের গুরুত্বপূর্ণ কেন্দ্রবিন্দু ${bestMoveObj.to} নিয়ন্ত্রণ করে।`
          : `🎯 Controls the vital central square ${bestMoveObj.to}.`
      );
    }

    if (['n', 'b'].includes(bestMoveObj.piece) && ['1', '8'].includes(bestMoveObj.from[1])) {
      whyPoints.push(
        lang === 'hi'
          ? `🐎 अपने ${pieceLabel} को सक्रिय वर्ग पर विकसित करता है।`
          : lang === 'bn'
          ? `🐎 নিজের ${pieceLabel} কে সক্রিয় ঘরে নিয়ে এসে উন্নত করে।`
          : `🐎 Develops your ${pieceLabel} into an active square.`
      );
    }

    // Default fallback point if list is short
    if (whyPoints.length === 0) {
      whyPoints.push(
        lang === 'hi'
          ? `🛡️ स्थिति में सुधार करता है और मोहरों का तालमेल बेहतर बनाता है।`
          : lang === 'bn'
          ? `🛡️ অবস্থান উন্নত করে এবং ঘুঁটির সঠিক সমন্বয় বজায় রাখে।`
          : `🛡️ Improves piece coordination and tactical stability.`
      );
    }
  }

  // 4. Threat Detection (Examine opponent's threats against our pieces)
  const threats: HackAnalysis['threats'] = [];
  const opponentTurnChess = new Chess(fen);
  // Switch turn artificially to see what opponent can capture if they moved right now
  const tokens = fen.split(' ');
  tokens[1] = turn === 'w' ? 'b' : 'w';
  const oppFen = tokens.join(' ');

  try {
    const oppChess = new Chess(oppFen);
    const oppMoves = oppChess.moves({ verbose: true });
    const attackedPlayerPieces = oppMoves.filter((m) => m.captured);

    if (attackedPlayerPieces.length > 0) {
      // Find highest value attacked piece
      const target = attackedPlayerPieces[0];
      const targetName = (PIECE_NAMES[target.captured || 'p'] || PIECE_NAMES.p)[lang];
      threats.push({
        text:
          lang === 'hi'
            ? `⚠️ आपका ${targetName} (${target.to}) विपक्षी मोहरे के निशाने पर है!`
            : lang === 'bn'
            ? `⚠️ আপনার ${targetName} (${target.to}) প্রতিপক্ষের আক্রমণের মুখে রয়েছে!`
            : `⚠️ Your ${targetName} on ${target.to} is currently targeted by an opponent piece!`,
        squares: [target.to],
        severity: ['q', 'r'].includes(target.captured || '') ? 'high' : 'medium',
      });
    }
  } catch {}

  if (threats.length === 0) {
    threats.push({
      text:
        lang === 'hi'
          ? '🟢 कोई तत्काल खतरा नहीं मिला। अपनी योजना आगे बढ़ाएं।'
          : lang === 'bn'
          ? '🟢 কোনো তাৎক্ষণিক বিপদ নেই। নিজের পরিকল্পনা অনুযায়ী চাল দিন।'
          : '🟢 No immediate threat detected. You have time to execute your plan.',
      squares: [],
      severity: 'none',
    });
  }

  // 5. Tactical Opportunities (Fork, Pin, Hanging Piece, Checkmate)
  const tactics: HackAnalysis['tactics'] = [];

  // Check for immediate mate
  const mateMove = legalMoves.find((m) => m.san.includes('#'));
  if (mateMove) {
    tactics.push({
      type: 'mate',
      title: lang === 'hi' ? '👑 चेकमेट का मौका!' : lang === 'bn' ? '👑 কিস্তিমাতের দারুণ সুযোগ!' : '👑 Checkmate in 1!',
      desc:
        lang === 'hi'
          ? `चाल ${mateMove.san} तुरंत जीत दिलाती है!`
          : lang === 'bn'
          ? `চাল ${mateMove.san} এখনই আপনাকে জয় এনে দেবে!`
          : `Move ${mateMove.san} delivers an immediate checkmate!`,
      squares: [mateMove.to],
    });
  }

  // Check for hanging / free capture
  const captures = legalMoves.filter((m) => m.captured && ['q', 'r', 'b', 'n'].includes(m.captured));
  if (captures.length > 0 && !mateMove) {
    const bestCap = captures[0];
    const capName = (PIECE_NAMES[bestCap.captured || 'p'] || PIECE_NAMES.p)[lang];
    tactics.push({
      type: 'hanging',
      title: lang === 'hi' ? '💥 मोहरा जीतने का मौका' : lang === 'bn' ? '💥 ঘুঁটি জেতার সুবর্ণ সুযোগ' : '💥 Free Material Available',
      desc:
        lang === 'hi'
          ? `${bestCap.san} चलकर विपक्षी ${capName} को कब्जे में लें!`
          : lang === 'bn'
          ? `${bestCap.san} খেলে প্রতিপক্ষের ${capName} জয় করে নিন!`
          : `Play ${bestCap.san} to capture the opponent’s ${capName}!`,
      squares: [bestCap.to],
    });
  }

  // Check for Fork (Knight attacking 2 pieces)
  const knightMoves = legalMoves.filter((m) => m.piece === 'n');
  for (const km of knightMoves) {
    // Check if destination attacks multiple high-value targets
    chess.move(km);
    const attacks = chess.moves({ verbose: true }).filter((m) => m.captured && ['k', 'q', 'r'].includes(m.captured));
    chess.undo();
    if (attacks.length >= 2) {
      tactics.push({
        type: 'fork',
        title: lang === 'hi' ? '🍴 फोर्क (Fork) का अवसर!' : lang === 'bn' ? '🍴 ফর্ক (Fork) আক্রমণের সুযোগ!' : '🍴 Tactical Fork Opportunity!',
        desc:
          lang === 'hi'
            ? `घोड़ा ${km.san} दो प्रमुख मोहरों पर एक साथ हमला बोलता है!`
            : lang === 'bn'
            ? `ঘোড়া ${km.san} একই সাথে দুটি বড় ঘুঁটিকে নিশানা বানাচ্ছে!`
            : `Knight ${km.san} attacks two major targets simultaneously!`,
        squares: [km.to],
      });
      break;
    }
  }

  // 6. Connect to Chess Principle & Phase 2 Lesson
  let principle =
    lang === 'hi'
      ? 'शतरंज का नियम: केंद्र पर नियंत्रण और मोहरों का विकास।'
      : lang === 'bn'
      ? 'দাবার মূলনীতি: কেন্দ্রবিন্দু নিয়ন্ত্রণ এবং ঘুঁটির দ্রুত উন্নয়ন।'
      : 'Fundamental principle: Control the center and develop your minor pieces before attacking.';

  let lessonLink = {
    title: lang === 'hi' ? 'अध्याय 5: घोड़े की चाल सीखें' : lang === 'bn' ? 'পাঠ ৫: ঘোড়ার চাল পর্যালোচনা' : 'Lesson 5: Master The Knight',
    slug: 'the-knight',
  };

  if (bestMoveObj) {
    const pSlug = PIECE_NAMES[bestMoveObj.piece]?.lesson || 'the-pawn';
    const pLabel = (PIECE_NAMES[bestMoveObj.piece] || PIECE_NAMES.p)[lang];

    lessonLink = {
      title:
        lang === 'hi'
          ? `📚 अध्याय: ${pLabel} का सही उपयोग`
          : lang === 'bn'
          ? `📚 পাঠ: ${pLabel} এর সঠিক ব্যবহার`
          : `📚 Review: ${pLabel} Movement`,
      slug: pSlug,
    };

    if (bestMoveObj.piece === 'k') {
      principle =
        lang === 'hi'
          ? 'राजा की सुरक्षा सबसे पहले! कैसलिंग कर राजा को सुरक्षित रखें।'
          : lang === 'bn'
          ? 'রাজার সুরক্ষাই প্রধান! ক্যাসলিং করে রাজাকে কেল্লায় নিয়ে যান।'
          : 'King safety is paramount. Keep your King protected behind pawns.';
    } else if (CENTER_SQUARES.includes(bestMoveObj.to)) {
      principle =
        lang === 'hi'
          ? 'केंद्र पर कब्जा करने वाला खिलाड़ी पूरे बोर्ड पर राज करता है।'
          : lang === 'bn'
          ? 'কেন্দ্র দখলকারী খেলোয়াড় পুরো দাবার বোর্ড নিয়ন্ত্রণ করে।'
          : 'Whoever controls the four center squares dominates the entire board.';
    }
  }

  // 7. Interactive Thinking Checklist
  const checklist = [
    lang === 'hi' ? 'क्या मेरा राजा अभी सुरक्षित है?' : lang === 'bn' ? 'আমার রাজা কি সুরক্ষিত আছে?' : 'Is my King safe right now?',
    lang === 'hi' ? 'विपक्षी की चाल से क्या खतरा पैदा हुआ?' : lang === 'bn' ? 'প্রতিপক্ষের চালে কী নতুন বিপদ এলো?' : 'What is my opponent threatening?',
    lang === 'hi' ? 'क्या मेरा कोई मोहरा बिना सुरक्षा के छूट रहा है?' : lang === 'bn' ? 'আমার কোনো ঘুঁটি কি অরক্ষিত অবস্থায় আছে?' : 'Is any of my pieces hanging or attacked?',
    lang === 'hi' ? 'क्या मैं कोई मोहरा मुफ्त में काट सकता हूँ?' : lang === 'bn' ? 'আমি কি বিনা বাধায় কোনো ঘুঁটি কাটতে পারি?' : 'Can I capture any undefended piece?',
    lang === 'hi' ? 'क्या मैं चेक या गंभीर हमला दे सकता हूँ?' : lang === 'bn' ? 'আমি কি কোনো জোরালো কিস্তি দিতে পারি?' : 'Can I give check or create an active threat?',
    lang === 'hi' ? 'क्या मेरी चाल मेरे मोहरों को केंद्र की ओर लाती है?' : lang === 'bn' ? 'আমার চাল কি ঘুঁটিগুলোকে কেন্দ্রের দিকে নিয়ে যাচ্ছে?' : 'Does this move develop a piece towards the center?',
  ];

  return {
    fen,
    turn,
    bestMove: bestMoveObj
      ? {
          from: bestMoveObj.from,
          to: bestMoveObj.to,
          san: bestMoveObj.san,
          piece: bestMoveObj.piece,
          promotion: bestMoveObj.promotion,
        }
      : null,
    whyPoints,
    threats,
    tactics,
    alternatives,
    principle,
    lessonLink,
    evaluation: bestMoveResult?.evaluation || 0.4,
    checklist,
  };
}

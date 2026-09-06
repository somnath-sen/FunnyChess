export type ChallengeTheme =
  | 'mate_in_1'
  | 'mate_in_2'
  | 'fork'
  | 'pin'
  | 'skewer'
  | 'piece_win'
  | 'best_move';

export interface DailyPuzzle {
  id: string;
  title: string;
  theme: ChallengeTheme;
  themeLabel: string;
  initialFen: string;
  playerColor: 'white' | 'black';
  objective: string;
  solution: { from: string; to: string; promotion?: string };
  expectedSan: string;
  explanation: string;
}

export const DAILY_PUZZLES: DailyPuzzle[] = [
  {
    id: 'daily_puzzle_01',
    title: 'Queen & Bishop Battery Mate',
    theme: 'mate_in_1',
    themeLabel: 'Mate in 1',
    initialFen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    playerColor: 'white',
    objective: 'White to move: Deliver immediate checkmate!',
    solution: { from: 'f3', to: 'f7' },
    expectedSan: 'Qxf7#',
    explanation: 'Qxf7# attacks the vulnerable f7 square protected by the bishop on c4, delivering Scholar’s Mate!',
  },
  {
    id: 'daily_puzzle_02',
    title: 'Royal Knight Fork',
    theme: 'fork',
    themeLabel: 'Royal Fork',
    initialFen: 'r1b1k2r/pppp1ppp/8/4q3/1bP1n3/4PN2/PP1N1PPP/R2QKB1R b KQkq - 1 8',
    playerColor: 'black',
    objective: 'Black to move: Win the opponent’s Queen!',
    solution: { from: 'b4', to: 'd2' },
    expectedSan: 'Bxd2+',
    explanation: 'Bxd2+ forces White’s King or Queen to respond, winning decisive material in the center.',
  },
  {
    id: 'daily_puzzle_03',
    title: 'Back Rank Deflection',
    theme: 'mate_in_1',
    themeLabel: 'Back Rank Mate',
    initialFen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Punish the uncastled back rank!',
    solution: { from: 'd1', to: 'd8' },
    expectedSan: 'Rxd8#',
    explanation: 'Rxd8# captures the rook and delivers back-rank checkmate because Black’s pawns trap their own King!',
  },
  {
    id: 'daily_puzzle_04',
    title: 'The Smothered Knight Sneak',
    theme: 'mate_in_1',
    themeLabel: 'Smothered Mate',
    initialFen: '6k1/5ppp/8/8/8/5N2/5PPP/6K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Find the tactical knight penetration.',
    solution: { from: 'f3', to: 'e5' },
    expectedSan: 'Ne5',
    explanation: 'Ne5 controls critical forward squares and creates inescapable forward outpost pressure.',
  },
  {
    id: 'daily_puzzle_05',
    title: 'Absolute Pin Down the File',
    theme: 'pin',
    themeLabel: 'Absolute Pin',
    initialFen: 'r1b1k2r/pp3ppp/2n1p3/3p4/3P4/2q1PN2/P2B1PPP/R2QKB1R w KQkq - 0 1',
    playerColor: 'white',
    objective: 'White to move: Attack the pinned enemy Queen!',
    solution: { from: 'd2', to: 'c3' },
    expectedSan: 'Bxc3',
    explanation: 'Bxc3 captures the queen directly! Always look for unguarded major pieces.',
  },
  {
    id: 'daily_puzzle_06',
    title: 'Deadly Bishop Skewer',
    theme: 'skewer',
    themeLabel: 'Bishop Skewer',
    initialFen: '4k3/8/8/8/8/B7/8/4K2r w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Skewer the King and Rook!',
    solution: { from: 'a3', to: 'f8' },
    expectedSan: 'Bf8',
    explanation: 'Bf8 attacks the enemy King while lining up with the undefended Rook behind it!',
  },
  {
    id: 'daily_puzzle_07',
    title: 'Anastasia’s Mate Net',
    theme: 'mate_in_1',
    themeLabel: 'Checkmate Net',
    initialFen: '5rk1/1p3ppp/8/8/4N3/8/5PPP/R5K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Centralize the knight with tempo.',
    solution: { from: 'e4', to: 'd6' },
    expectedSan: 'Nd6',
    explanation: 'Nd6 forks Black’s b7 and f7 pawns, dominating the 7th rank infiltration zone.',
  },
  {
    id: 'daily_puzzle_08',
    title: 'Corridor Rook Mate',
    theme: 'mate_in_1',
    themeLabel: 'Corridor Mate',
    initialFen: 'k7/8/1K6/8/8/8/8/R7 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Deliver the clean corridor checkmate!',
    solution: { from: 'a1', to: 'a8' },
    expectedSan: 'Ra8#',
    explanation: 'Ra8# seals off the entire a-file while White’s King on b6 blocks all escape squares!',
  },
  {
    id: 'daily_puzzle_09',
    title: 'Discovered Attack on the Queen',
    theme: 'best_move',
    themeLabel: 'Discovered Attack',
    initialFen: 'r1b1kb1r/pppp1ppp/8/4q3/2B1n3/4Q3/PPP2PPP/RNB1K2R w KQkq - 0 8',
    playerColor: 'white',
    objective: 'White to move: Defend with the pawn while opening the bishop line.',
    solution: { from: 'f2', to: 'f3' },
    expectedSan: 'f3',
    explanation: 'f3 attacks Black’s pinned knight on e4, winning material since the knight cannot escape without exposing the Queen.',
  },
  {
    id: 'daily_puzzle_10',
    title: 'Knight Outpost Infiltration',
    theme: 'fork',
    themeLabel: 'Fork Opportunity',
    initialFen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1b1PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 1 5',
    playerColor: 'white',
    objective: 'White to move: Break the center open!',
    solution: { from: 'd4', to: 'e5' },
    expectedSan: 'dxe5',
    explanation: 'dxe5 wins a center pawn and attacks the f6 Knight, gaining key tempo in the opening.',
  },
  {
    id: 'daily_puzzle_11',
    title: 'Arabian Mate Finale',
    theme: 'mate_in_1',
    themeLabel: 'Arabian Mate',
    initialFen: '7k/R7/5N2/8/8/8/8/6K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Deliver the legendary Arabian Mate!',
    solution: { from: 'a7', to: 'h7' },
    expectedSan: 'Rh7#',
    explanation: 'Rh7# checkmates the cornered King, protected by the Knight on f6 preventing g8 escape!',
  },
  {
    id: 'daily_puzzle_12',
    title: 'Queen Trap in the Corner',
    theme: 'piece_win',
    themeLabel: 'Trapped Queen',
    initialFen: 'rnb1k1nr/pppp1ppp/8/4p3/1b2P2q/2NP4/PPP2PPP/R1BQKBNR w KQkq - 1 4',
    playerColor: 'white',
    objective: 'White to move: Repel Black’s overextended queen with development.',
    solution: { from: 'g1', to: 'f3' },
    expectedSan: 'Nf3',
    explanation: 'Nf3 develops with tempo, attacking the queen and seizing the initiative in the center.',
  },
  {
    id: 'daily_puzzle_13',
    title: 'Opera Box Mate',
    theme: 'mate_in_1',
    themeLabel: 'Opera Mate',
    initialFen: '4kb1r/p2n1ppp/4p3/8/1r1B4/8/P1P2PPP/RN1R2K1 w k - 0 16',
    playerColor: 'white',
    objective: 'White to move: Centralize and attack the a7 pawn.',
    solution: { from: 'd4', to: 'a7' },
    expectedSan: 'Bxa7',
    explanation: 'Bxa7 eliminates a key flank pawn and creates an outside passed pawn for the endgame.',
  },
  {
    id: 'daily_puzzle_14',
    title: 'Blackburne’s Mate',
    theme: 'mate_in_1',
    themeLabel: 'Mate in 1',
    initialFen: 'rnbqk2r/pppp1ppp/5n2/4p3/1bB1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4',
    playerColor: 'white',
    objective: 'White to move: Castle to safety and activate the Rook!',
    solution: { from: 'e1', to: 'g1' },
    expectedSan: 'O-O',
    explanation: 'Castling kingside tucks your King away into a safe shelter and connects the rooks.',
  },
  {
    id: 'daily_puzzle_15',
    title: 'Overloaded Defender',
    theme: 'piece_win',
    themeLabel: 'Winning a Piece',
    initialFen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
    playerColor: 'white',
    objective: 'White to move: Secure kingside safety.',
    solution: { from: 'e1', to: 'g1' },
    expectedSan: 'O-O',
    explanation: 'O-O completes the opening triad: piece development, central control, and king safety.',
  },
  {
    id: 'daily_puzzle_16',
    title: 'Hook Mate Weapon',
    theme: 'mate_in_1',
    themeLabel: 'Hook Mate',
    initialFen: '6k1/R4p1p/4p1p1/3p4/8/8/5PPP/6K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Advance the kingside majority.',
    solution: { from: 'f2', to: 'f4' },
    expectedSan: 'f4',
    explanation: 'f4 takes space on the kingside and restricts any forward movement by Black’s e-pawn.',
  },
  {
    id: 'daily_puzzle_17',
    title: 'Boden’s Crisscross Mate',
    theme: 'mate_in_1',
    themeLabel: 'Diagonal Strike',
    initialFen: '2kr1b1r/pppn1ppp/8/8/4B3/8/PPP2PPP/R1B1K2R w KQ - 1 12',
    playerColor: 'white',
    objective: 'White to move: Activate the bishop with tempo.',
    solution: { from: 'c1', to: 'e3' },
    expectedSan: 'Be3',
    explanation: 'Be3 develops the dark-squared bishop, targeting Black’s queenside and preparing queenside castling.',
  },
  {
    id: 'daily_puzzle_18',
    title: 'Fierce Knight Fork on c7',
    theme: 'fork',
    themeLabel: 'c7 Fork',
    initialFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    playerColor: 'white',
    objective: 'White to move: Target the f7 weakness (Fried Liver attack idea)!',
    solution: { from: 'f3', to: 'g5' },
    expectedSan: 'Ng5',
    explanation: 'Ng5 joins the Bishop on c4 to create an overwhelming double assault against the weak f7 square.',
  },
  {
    id: 'daily_puzzle_19',
    title: 'Dovetail Mate',
    theme: 'mate_in_1',
    themeLabel: 'Dovetail Mate',
    initialFen: '7k/Q7/8/8/8/8/5PPP/6K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Trap Black’s king along the rank!',
    solution: { from: 'a7', to: 'e7' },
    expectedSan: 'Qe7',
    explanation: 'Qe7 cuts off all forward escape squares, tightening the mating net around Black’s King.',
  },
  {
    id: 'daily_puzzle_20',
    title: 'Pawn Break Through',
    theme: 'best_move',
    themeLabel: 'Pawn Breakthrough',
    initialFen: '4k3/4p3/4P3/8/8/8/4P3/4K3 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: March the reserve pawn forward.',
    solution: { from: 'e2', to: 'e4' },
    expectedSan: 'e4',
    explanation: 'e4 creates an unstoppable passed pawn formation ensuring king coronation in the endgame.',
  },
  {
    id: 'daily_puzzle_21',
    title: 'The Queen’s Deadly Kiss',
    theme: 'mate_in_1',
    themeLabel: 'Mate in 1',
    initialFen: 'r1b1k2r/ppppqppp/2n5/4p3/2B5/5Q2/PPPP1PPP/R1B1K1NR w KQkq - 0 1',
    playerColor: 'white',
    objective: 'White to move: Deliver checkmate on the f7 square!',
    solution: { from: 'f3', to: 'f7' },
    expectedSan: 'Qxf7#',
    explanation: 'Qxf7# cannot be taken by the King because the white Bishop on c4 defends the Queen!',
  },
  {
    id: 'daily_puzzle_22',
    title: 'Epaulette Mate in the Corner',
    theme: 'mate_in_1',
    themeLabel: 'Epaulette Mate',
    initialFen: '3rkr2/8/8/8/8/8/4Q3/4K3 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Checkmate the king trapped between his rooks!',
    solution: { from: 'e2', to: 'e6' },
    expectedSan: 'Qe6#',
    explanation: 'Qe6# traps the black King with no legal moves since his own Rooks block both flanks!',
  },
  {
    id: 'daily_puzzle_23',
    title: 'The Corner Trap',
    theme: 'mate_in_1',
    themeLabel: 'Mate in 1',
    initialFen: '7k/6p1/7p/8/8/8/6PP/4R1K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Infiltrate the 8th rank!',
    solution: { from: 'e1', to: 'e8' },
    expectedSan: 'Re8#',
    explanation: 'Re8# attacks the King on h8 with no pieces available to block or capture the rook.',
  },
  {
    id: 'daily_puzzle_24',
    title: 'Double Attack on King & Rook',
    theme: 'fork',
    themeLabel: 'Queen Double Attack',
    initialFen: 'r3k2r/pppq1ppp/2np1n2/4p3/2B1P3/P1NP1N2/1PP2PPP/R1BQK2R w KQkq - 1 8',
    playerColor: 'white',
    objective: 'White to move: Castle to safety.',
    solution: { from: 'e1', to: 'g1' },
    expectedSan: 'O-O',
    explanation: 'Castling prepares future central expansion while safeguarding the monarch.',
  },
  {
    id: 'daily_puzzle_25',
    title: 'The Defiant Rook',
    theme: 'mate_in_1',
    themeLabel: 'Mate in 1',
    initialFen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 3',
    playerColor: 'white',
    objective: 'White to move: Deliver Scholar’s Mate!',
    solution: { from: 'h5', to: 'f7' },
    expectedSan: 'Qxf7#',
    explanation: 'Qxf7# delivers Scholar’s Mate on the unprotected f7 square, defended by the bishop on c4!',
  },
  {
    id: 'daily_puzzle_26',
    title: 'Knight Fork on King and Queen',
    theme: 'fork',
    themeLabel: 'Royal Fork',
    initialFen: 'r3k2r/ppp2ppp/2n5/3qp3/1b6/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 1 8',
    playerColor: 'white',
    objective: 'White to move: Neutralize the pin by castling.',
    solution: { from: 'e1', to: 'g1' },
    expectedSan: 'O-O',
    explanation: 'O-O breaks any pin on the e-file and prepares central piece coordination.',
  },
  {
    id: 'daily_puzzle_27',
    title: 'Vulnerable f2 Infiltration',
    theme: 'mate_in_1',
    themeLabel: 'Mate in 1',
    initialFen: 'rnb1k1nr/pppp1ppp/8/4p3/4P2q/8/PPPP1PPP/RNBQKBNR w KQkq - 1 3',
    playerColor: 'white',
    objective: 'White to move: Develop and defend e4!',
    solution: { from: 'b1', to: 'c3' },
    expectedSan: 'Nc3',
    explanation: 'Nc3 develops the queenside knight and firmly protects the central e4 pawn.',
  },
  {
    id: 'daily_puzzle_28',
    title: 'The Staircase Rook Slide',
    theme: 'mate_in_1',
    themeLabel: 'Ladder Mate',
    initialFen: 'k7/8/1K6/8/8/8/R7/1R6 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Deliver the final step of the ladder mate!',
    solution: { from: 'b1', to: 'b8' },
    expectedSan: 'Rb8#',
    explanation: 'Rb8# cuts off the remaining square, working in unison with the a-file rook for a classic ladder mate!',
  },
  {
    id: 'daily_puzzle_29',
    title: 'Center Fork Trick',
    theme: 'fork',
    themeLabel: 'Center Fork',
    initialFen: 'r1bqkb1r/pppp1ppp/2n5/4P3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 1 5',
    playerColor: 'white',
    objective: 'White to move: Advance the d-pawn to stake central territory.',
    solution: { from: 'd2', to: 'd4' },
    expectedSan: 'd4',
    explanation: 'd4 supports the advanced e5 pawn and unlocks the dark-squared bishop.',
  },
  {
    id: 'daily_puzzle_30',
    title: 'The Smothered Corner Trap',
    theme: 'mate_in_1',
    themeLabel: 'Smothered Mate',
    initialFen: '6k1/5Npp/8/8/8/8/5PPP/6K1 w - - 0 1',
    playerColor: 'white',
    objective: 'White to move: Attack the h7 pawn.',
    solution: { from: 'f7', to: 'g5' },
    expectedSan: 'Ng5',
    explanation: 'Ng5 targets both h7 and e6, creating multiple tactical threats.',
  },
  {
    id: 'daily_puzzle_31',
    title: 'Grandmaster Clearance',
    theme: 'mate_in_1',
    themeLabel: 'Clearance Strike',
    initialFen: 'r1b2rk1/pppp1ppp/8/8/4Q3/8/PPP2PPP/R1B1K2R w KQ - 1 12',
    playerColor: 'white',
    objective: 'White to move: Bring the King to safety.',
    solution: { from: 'e1', to: 'g1' },
    expectedSan: 'O-O',
    explanation: 'Castling secures the white King and joins the h1 rook with the active Queen.',
  },
];

/**
 * Deterministically select a puzzle based on date string (YYYY-MM-DD).
 * The same calendar day produces the EXACT same puzzle for all players globally.
 */
export function getDailyChallenge(date?: Date): {
  puzzle: DailyPuzzle;
  dateStr: string;
} {
  const targetDate = date || new Date();
  const year = targetDate.getUTCFullYear();
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  // Deterministic DJB2 hash of the date string
  let hash = 5381;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 33) ^ dateStr.charCodeAt(i);
  }
  const positiveHash = Math.abs(hash);
  const puzzleIndex = positiveHash % DAILY_PUZZLES.length;

  return {
    puzzle: DAILY_PUZZLES[puzzleIndex],
    dateStr,
  };
}

/**
 * Validate a player's move against the daily puzzle solution
 */
export function validateChallengeMove(
  puzzle: DailyPuzzle,
  from: string,
  to: string,
  promotion?: string
): boolean {
  const expected = puzzle.solution;
  if (expected.from !== from || expected.to !== to) {
    return false;
  }
  if (expected.promotion && promotion && expected.promotion !== promotion) {
    return false;
  }
  return true;
}

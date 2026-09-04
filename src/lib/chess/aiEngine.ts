import { Chess, Square, Move } from 'chess.js';

export type AIDifficulty = 'easy' | 'intermediate' | 'hard';

export interface BestMoveResult {
  from: string;
  to: string;
  promotion?: string;
  evaluation?: number;
  engineUsed: 'stockfish' | 'heuristic';
}

// Standard piece valuation
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square positional bonus tables
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

class AIEngine {
  private stockfishWorker: Worker | null = null;
  private workerReady: boolean = false;

  constructor() {
    this.initStockfishWorker();
  }

  private initStockfishWorker() {
    if (typeof window === 'undefined') return;

    try {
      // Load open-source Stockfish WASM/JS engine via web worker
      const workerCode = `
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      worker.onmessage = (e) => {
        const msg = typeof e.data === 'string' ? e.data : '';
        if (msg.includes('uciok') || msg.includes('readyok')) {
          this.workerReady = true;
        }
      };

      worker.postMessage('uci');
      worker.postMessage('isready');
      this.stockfishWorker = worker;
    } catch {
      // If Web Worker or external script fails, the heuristic minimax engine seamlessly handles moves
      this.workerReady = false;
    }
  }

  // Evaluate board statically from perspective of current player
  private evaluatePosition(chess: Chess): number {
    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        let pieceScore = PIECE_VALUES[piece.type] || 0;
        const index = r * 8 + c;

        // Positional tables for White (inverted for Black)
        const tableIndex = piece.color === 'w' ? index : 63 - index;
        if (piece.type === 'p') pieceScore += PAWN_TABLE[tableIndex];
        if (piece.type === 'n') pieceScore += KNIGHT_TABLE[tableIndex];
        if (piece.type === 'b') pieceScore += BISHOP_TABLE[tableIndex];

        if (piece.color === 'w') {
          score += pieceScore;
        } else {
          score -= pieceScore;
        }
      }
    }

    return score;
  }

  // Minimax with Alpha-Beta Pruning
  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): { score: number; bestMove?: Move } {
    if (depth === 0 || chess.isGameOver()) {
      if (chess.isCheckmate()) {
        return { score: isMaximizing ? -99999 : 99999 };
      }
      if (chess.isDraw()) {
        return { score: 0 };
      }
      return { score: this.evaluatePosition(chess) };
    }

    const moves = chess.moves({ verbose: true });
    let bestMove: Move | undefined;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const evalResult = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();

        if (evalResult.score > maxEval) {
          maxEval = evalResult.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, evalResult.score);
        if (beta <= alpha) break;
      }
      return { score: maxEval, bestMove };
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const evalResult = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();

        if (evalResult.score < minEval) {
          minEval = evalResult.score;
          bestMove = move;
        }
        beta = Math.min(beta, evalResult.score);
        if (beta <= alpha) break;
      }
      return { score: minEval, bestMove };
    }
  }

  // Calculate move based on calibrated difficulty
  public async getBestMove(
    chess: Chess,
    difficulty: AIDifficulty
  ): Promise<BestMoveResult> {
    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) {
      throw new Error('No legal moves available');
    }

    // 🟢 EASY DIFFICULTY:
    // 35% chance to make a random legal move (beginner blunder / casual mistake)
    // Otherwise depth 1 tactical capture check
    if (difficulty === 'easy') {
      await new Promise((res) => setTimeout(res, 500 + Math.random() * 500));
      const shouldBlunder = Math.random() < 0.35;
      if (shouldBlunder && legalMoves.length > 1) {
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        return {
          from: randomMove.from,
          to: randomMove.to,
          promotion: randomMove.promotion,
          engineUsed: 'heuristic',
        };
      }

      // Quick depth 1 evaluation
      const isWhite = chess.turn() === 'w';
      const result = this.minimax(chess, 1, -Infinity, Infinity, isWhite);
      const chosen = result.bestMove || legalMoves[0];
      return {
        from: chosen.from,
        to: chosen.to,
        promotion: chosen.promotion,
        engineUsed: 'heuristic',
      };
    }

    // 🟡 INTERMEDIATE DIFFICULTY:
    // Minimax depth 3 with positional evaluation tables (solid club level)
    if (difficulty === 'intermediate') {
      await new Promise((res) => setTimeout(res, 600 + Math.random() * 400));
      const isWhite = chess.turn() === 'w';
      const result = this.minimax(chess, 3, -Infinity, Infinity, isWhite);
      const chosen = result.bestMove || legalMoves[0];
      return {
        from: chosen.from,
        to: chosen.to,
        promotion: chosen.promotion,
        evaluation: result.score,
        engineUsed: 'heuristic',
      };
    }

    // 🔴 HARD DIFFICULTY:
    // If Stockfish worker is ready, use it with depth 12+
    // Otherwise use minimax depth 4
    if (difficulty === 'hard' && this.stockfishWorker && this.workerReady) {
      try {
        const stockfishResult = await this.queryStockfish(chess.fen(), 12);
        if (stockfishResult) {
          return {
            from: stockfishResult.from,
            to: stockfishResult.to,
            promotion: stockfishResult.promotion,
            engineUsed: 'stockfish',
          };
        }
      } catch {
        // fallback to deep minimax
      }
    }

    // Deep Minimax Fallback for Hard
    await new Promise((res) => setTimeout(res, 800));
    const isWhite = chess.turn() === 'w';
    const result = this.minimax(chess, 4, -Infinity, Infinity, isWhite);
    const chosen = result.bestMove || legalMoves[0];
    return {
      from: chosen.from,
      to: chosen.to,
      promotion: chosen.promotion,
      evaluation: result.score,
      engineUsed: 'heuristic',
    };
  }

  // Query Stockfish Worker with timeout
  private queryStockfish(
    fen: string,
    depth: number = 10
  ): Promise<{ from: string; to: string; promotion?: string } | null> {
    return new Promise((resolve) => {
      if (!this.stockfishWorker) {
        return resolve(null);
      }

      const timeout = setTimeout(() => {
        resolve(null);
      }, 2500);

      const handler = (e: MessageEvent) => {
        const msg = typeof e.data === 'string' ? e.data : '';
        if (msg.startsWith('bestmove')) {
          clearTimeout(timeout);
          this.stockfishWorker?.removeEventListener('message', handler);

          const parts = msg.split(' ');
          const moveStr = parts[1]; // e.g. "e2e4" or "e7e8q"
          if (moveStr && moveStr.length >= 4 && moveStr !== '(none)') {
            const from = moveStr.substring(0, 2);
            const to = moveStr.substring(2, 4);
            const promotion = moveStr.length > 4 ? moveStr[4] : undefined;
            resolve({ from, to, promotion });
          } else {
            resolve(null);
          }
        }
      };

      this.stockfishWorker.addEventListener('message', handler);
      this.stockfishWorker.postMessage(`position fen ${fen}`);
      this.stockfishWorker.postMessage(`go depth ${depth}`);
    });
  }
}

export const chessAI = new AIEngine();

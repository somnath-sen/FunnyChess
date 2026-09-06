/**
 * Centralized Chess Animation Configuration for FunnyChess
 * Ensures consistent, premium, physical movement feel across all chessboards.
 */

export interface ChessAnimationConfig {
  /** Target duration for standard piece travel in milliseconds */
  normalMoveDuration: number;
  /** Duration for captured piece fade and scale-down */
  captureFadeDuration: number;
  /** Fast transition duration for users preferring reduced motion */
  reducedMotionDuration: number;
  /** Premium cubic-bezier easing curve for physical movement */
  easing: string;
}

export const CHESS_ANIMATION_CONFIG: ChessAnimationConfig = {
  // ~550ms: Visually deliberate, smooth, elegant, and satisfying
  normalMoveDuration: 550,
  // 350ms: Subtle capture fade/scale-down as attacking piece arrives
  captureFadeDuration: 350,
  // 80ms: Instantaneous feel when reduced motion is requested
  reducedMotionDuration: 80,
  // Natural start, slight acceleration, graceful deceleration, precise landing
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
};

/**
 * Check if the user has requested reduced motion in their OS / browser preferences
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Convert an algebraic chess square (e.g., 'e4') to 0-indexed column and row coordinates
 * respecting white or black board orientation.
 * 
 * Column 0 is the leftmost file displayed; Row 0 is the topmost rank displayed.
 */
export function squareToCoords(
  square: string,
  orientation: 'white' | 'black' = 'white'
): { col: number; row: number } {
  if (!square || square.length < 2) return { col: 0, row: 0 };

  const file = square[0].toLowerCase();
  const rank = square[1];

  const fileIdx = file.charCodeAt(0) - 'a'.charCodeAt(0); // 0 (a) to 7 (h)
  const rankIdx = parseInt(rank, 10) - 1; // 0 (1) to 7 (8)

  if (orientation === 'white') {
    return {
      col: Math.max(0, Math.min(7, fileIdx)),
      row: Math.max(0, Math.min(7, 7 - rankIdx)),
    };
  } else {
    return {
      col: Math.max(0, Math.min(7, 7 - fileIdx)),
      row: Math.max(0, Math.min(7, rankIdx)),
    };
  }
}

/**
 * Convert 0-indexed column and row coordinates back to an algebraic square (e.g., 'e4')
 */
export function coordsToSquare(
  col: number,
  row: number,
  orientation: 'white' | 'black' = 'white'
): string {
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const fileIdx = orientation === 'white' ? col : 7 - col;
  const rankIdx = orientation === 'white' ? 8 - row : row + 1;

  const file = FILES[Math.max(0, Math.min(7, fileIdx))] || 'a';
  return `${file}${rankIdx}`;
}

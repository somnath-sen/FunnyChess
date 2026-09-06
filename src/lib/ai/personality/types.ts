/**
 * FunnyChess Phase 11 — AI Personality & Context-Aware Reaction Types
 */

export type AIPersonalityId =
  | 'chill'
  | 'professor'
  | 'troll'
  | 'competitive'
  | 'grandmaster';

export type AIEmotionalState =
  | 'neutral'
  | 'confident'
  | 'surprised'
  | 'pressured'
  | 'frustrated'
  | 'celebrating';

export type ChessEventType =
  | 'game_start'
  | 'quiet_move'
  | 'capture_pawn'
  | 'capture_piece'
  | 'capture_queen'
  | 'ai_captured_piece'
  | 'player_blunder'
  | 'ai_blunder'
  | 'check_by_ai'
  | 'check_by_player'
  | 'checkmate_ai_wins'
  | 'checkmate_player_wins'
  | 'draw'
  | 'castling'
  | 'promotion'
  | 'resignation';

export interface LocalizedReactionText {
  en: string;
  hi: string;
  bn: string;
}

export interface CuratedReaction {
  id: string;
  text: LocalizedReactionText;
  emotionalState?: AIEmotionalState;
}

export interface ChessContextInput {
  whoseMove: 'player' | 'ai';
  moveSan: string;
  moveFlags?: string;
  capturedPiece?: string; // 'p' | 'n' | 'b' | 'r' | 'q'
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isCastling?: boolean;
  isPromotion?: boolean;
  isEnPassant?: boolean;
  isBlunder?: boolean;
  aiCapturedPiece?: boolean;
  playerLostPiece?: boolean;
  gameStart?: boolean;
  resignation?: boolean;
  moveCount?: number;
}

export interface PersonalityDefinition {
  id: AIPersonalityId;
  nameKey: string;
  descKey: string;
  emoji: string;
  iconName: string;
  avatarBg: string;
  accentColor: string;
  thinkingKey: string;
  defaultEmotion: AIEmotionalState;
  frequencyModifier: number; // multiplier for commentary frequency (e.g. GM is lower)
}

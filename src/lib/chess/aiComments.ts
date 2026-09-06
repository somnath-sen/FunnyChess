/**
 * FunnyChess AI Comments & Banter Bridge
 * Integrates Phase 11 Personality & Context-Aware Reaction Engine
 */

import { AIPersonalityId, ChessEventType } from '@/lib/ai/personality/types';
import { REACTION_POOLS } from '@/lib/ai/personality/reactionPools';
import { AI_PERSONALITIES } from '@/lib/ai/personality/personalityConfig';

// Supported personalities including legacy aliases for backward-compatibility
export type AIPersonality =
  | 'chill'
  | 'professor'
  | 'troll'
  | 'competitive'
  | 'grandmaster'
  | 'comedian'
  | 'villain'
  | 'cat';

export type GameEvent =
  | 'check_by_ai'
  | 'check_by_player'
  | 'checkmate_ai_wins'
  | 'checkmate_player_wins'
  | 'capture_queen'
  | 'capture_piece'
  | 'capture_pawn'
  | 'player_blunder'
  | 'ai_blunder'
  | 'castling'
  | 'promotion'
  | 'quiet_move'
  | 'game_start';

// Map legacy names to new Phase 11 personalities
export function mapToPhase11Personality(p: AIPersonality): AIPersonalityId {
  switch (p) {
    case 'comedian':
      return 'troll';
    case 'villain':
      return 'competitive';
    case 'cat':
      return 'chill';
    case 'chill':
    case 'professor':
    case 'troll':
    case 'competitive':
    case 'grandmaster':
      return p;
    default:
      return 'chill';
  }
}

export function getAIComment(
  personality: AIPersonality,
  event: GameEvent,
  lang: 'en' | 'hi' | 'bn' = 'en'
): string {
  const pId = mapToPhase11Personality(personality);
  const pools = REACTION_POOLS[pId] || REACTION_POOLS.chill;
  const eventList = pools[event as ChessEventType] || pools.quiet_move || [];

  if (eventList.length === 0) {
    return '...';
  }

  const randomItem = eventList[Math.floor(Math.random() * eventList.length)];
  return randomItem.text[lang] || randomItem.text.en || '...';
}

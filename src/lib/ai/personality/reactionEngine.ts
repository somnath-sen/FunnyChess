import {
  AIPersonalityId,
  AIEmotionalState,
  ChessEventType,
  ChessContextInput,
  CuratedReaction,
} from './types';
import { AI_PERSONALITIES, DEFAULT_PERSONALITY_ID } from './personalityConfig';
import { REACTION_POOLS } from './reactionPools';

export interface ReactionResult {
  id: string;
  text: string;
  event: ChessEventType;
  newEmotion: AIEmotionalState;
}

export class ReactionEngine {
  private personalityId: AIPersonalityId;
  private emotionalState: AIEmotionalState;
  private recentReactionIds: string[] = [];
  private maxHistory: number = 8;

  constructor(initialPersonality: AIPersonalityId = DEFAULT_PERSONALITY_ID) {
    this.personalityId = initialPersonality;
    this.emotionalState = AI_PERSONALITIES[initialPersonality]?.defaultEmotion || 'neutral';
  }

  public setPersonality(personalityId: AIPersonalityId) {
    this.personalityId = personalityId;
    this.emotionalState = AI_PERSONALITIES[personalityId]?.defaultEmotion || 'neutral';
  }

  public getPersonality(): AIPersonalityId {
    return this.personalityId;
  }

  public getEmotionalState(): AIEmotionalState {
    return this.emotionalState;
  }

  public setEmotionalState(state: AIEmotionalState) {
    this.emotionalState = state;
  }

  public resetForNewGame() {
    this.recentReactionIds = [];
    this.emotionalState = AI_PERSONALITIES[this.personalityId]?.defaultEmotion || 'neutral';
  }

  /**
   * Deterministically analyze chess context to determine the primary event
   */
  public determineEvent(context: ChessContextInput): ChessEventType {
    if (context.gameStart) return 'game_start';

    if (context.isCheckmate) {
      return context.whoseMove === 'ai'
        ? 'checkmate_ai_wins'
        : 'checkmate_player_wins';
    }

    if (context.isDraw) return 'draw';

    if (context.isCheck) {
      return context.whoseMove === 'ai' ? 'check_by_ai' : 'check_by_player';
    }

    if (context.capturedPiece === 'q') {
      return 'capture_queen';
    }

    if (context.isBlunder) {
      return context.whoseMove === 'player' ? 'player_blunder' : 'ai_blunder';
    }

    if (context.capturedPiece) {
      if (context.whoseMove === 'ai') {
        return context.capturedPiece === 'p' ? 'capture_pawn' : 'capture_piece';
      } else {
        // Player captured AI piece
        return 'ai_captured_piece';
      }
    }

    if (context.isPromotion) return 'promotion';
    if (context.isCastling) return 'castling';

    return 'quiet_move';
  }

  /**
   * Determine whether a reaction should trigger based on event importance & personality frequency
   */
  public shouldReact(event: ChessEventType, force: boolean = false): boolean {
    if (force) return true;

    // High value events always or almost always react
    if (
      event === 'game_start' ||
      event === 'checkmate_ai_wins' ||
      event === 'checkmate_player_wins' ||
      event === 'draw'
    ) {
      return true;
    }

    const config = AI_PERSONALITIES[this.personalityId] || AI_PERSONALITIES[DEFAULT_PERSONALITY_ID];
    const mod = config.frequencyModifier;

    switch (event) {
      case 'check_by_ai':
      case 'check_by_player':
        return Math.random() < Math.min(0.95, 0.78 * mod);

      case 'capture_queen':
      case 'player_blunder':
      case 'ai_blunder':
        return Math.random() < Math.min(0.95, 0.8 * mod);

      case 'capture_piece':
      case 'ai_captured_piece':
        return Math.random() < Math.min(0.7, 0.42 * mod);

      case 'capture_pawn':
      case 'castling':
      case 'promotion':
        return Math.random() < Math.min(0.6, 0.35 * mod);

      case 'quiet_move':
      default:
        // Grandmaster speaks very little (~5%), Chill/Troll ~15-20%
        return Math.random() < Math.min(0.3, 0.16 * mod);
    }
  }

  /**
   * Select a reaction preventing recent repetition and updating emotional state
   */
  public generateReaction(
    context: ChessContextInput,
    lang: 'en' | 'hi' | 'bn' = 'en',
    force: boolean = false
  ): ReactionResult | null {
    const event = this.determineEvent(context);

    if (!this.shouldReact(event, force)) {
      return null;
    }

    const personaPools = REACTION_POOLS[this.personalityId] || REACTION_POOLS.chill;
    const candidates = personaPools[event] || personaPools.quiet_move || [];

    if (candidates.length === 0) {
      return null;
    }

    // Anti-repetition: filter out reactions shown recently in this game
    let eligible = candidates.filter((r) => !this.recentReactionIds.includes(r.id));

    // If all were used, recycle the candidate pool
    if (eligible.length === 0) {
      eligible = candidates;
    }

    const selected: CuratedReaction =
      eligible[Math.floor(Math.random() * eligible.length)];

    // Push into rolling history
    this.recentReactionIds.push(selected.id);
    if (this.recentReactionIds.length > this.maxHistory) {
      this.recentReactionIds.shift();
    }

    // Emotional state transition if specified, or infer from event
    if (selected.emotionalState) {
      this.emotionalState = selected.emotionalState;
    } else {
      if (event === 'checkmate_ai_wins') this.emotionalState = 'celebrating';
      else if (event === 'check_by_player') this.emotionalState = 'pressured';
      else if (event === 'check_by_ai') this.emotionalState = 'confident';
    }

    const text = selected.text[lang] || selected.text.en || '...';

    return {
      id: selected.id,
      text,
      event,
      newEmotion: this.emotionalState,
    };
  }
}

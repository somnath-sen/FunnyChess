import { PersistedGameRecord } from '@/lib/gamification/gamificationService';

export type ChessPersonalityId =
  | 'strategist'
  | 'attacker'
  | 'defender'
  | 'speedster'
  | 'tactician'
  | 'chaos'
  | 'endgameMaster';

export interface PersonalityMetrics {
  attackStyle: number; // 0 - 100
  tacticalPlay: number; // 0 - 100
  defence: number; // 0 - 100
  endgame: number; // 0 - 100
}

export interface ChessPersonalityResult {
  id: ChessPersonalityId;
  nameKey: string;
  descKey: string;
  icon: string;
  metrics: PersonalityMetrics;
  isDeveloping: boolean;
  gamesAnalyzed: number;
}

export const PERSONALITY_CONFIG: Record<
  ChessPersonalityId,
  { nameKey: string; descKey: string; icon: string }
> = {
  strategist: {
    nameKey: 'personality.strategist',
    descKey: 'personality.strategistDesc',
    icon: '🧠',
  },
  attacker: {
    nameKey: 'personality.attacker',
    descKey: 'personality.attackerDesc',
    icon: '⚔️',
  },
  defender: {
    nameKey: 'personality.defender',
    descKey: 'personality.defenderDesc',
    icon: '🛡️',
  },
  speedster: {
    nameKey: 'personality.speedster',
    descKey: 'personality.speedsterDesc',
    icon: '⚡',
  },
  tactician: {
    nameKey: 'personality.tactician',
    descKey: 'personality.tacticianDesc',
    icon: '🎯',
  },
  chaos: {
    nameKey: 'personality.chaos',
    descKey: 'personality.chaosDesc',
    icon: '😂',
  },
  endgameMaster: {
    nameKey: 'personality.endgameMaster',
    descKey: 'personality.endgameMasterDesc',
    icon: '👑',
  },
};

/**
 * Deterministically calculate a user's Chess Personality based on actual gameplay metrics.
 * Lightweight, reproducible, and zero expensive engine overhead.
 */
export function calculateChessPersonality(
  games: PersistedGameRecord[],
  profileStats: { games_played: number; wins: number; losses: number; draws: number }
): ChessPersonalityResult {
  const totalGames = Math.max(profileStats.games_played, games.length);

  // New account or insufficient games state
  if (totalGames < 2) {
    return {
      id: 'strategist',
      nameKey: 'personality.developingTitle',
      descKey: 'personality.developingDesc',
      icon: '🌱',
      metrics: {
        attackStyle: 40,
        tacticalPlay: 40,
        defence: 40,
        endgame: 35,
      },
      isDeveloping: true,
      gamesAnalyzed: totalGames,
    };
  }

  // Extract metrics from game history
  let totalCaptures = 0;
  let totalChecks = 0;
  let totalCastles = 0;
  let totalMoves = 0;
  let quickWins = 0;
  let longGames = 0;

  if (games.length > 0) {
    games.forEach((g) => {
      const history = g.moveHistory || [];
      totalMoves += g.movesCount || history.length;

      history.forEach((san) => {
        if (san.includes('x')) totalCaptures++;
        if (san.includes('+') || san.includes('#')) totalChecks++;
        if (san.includes('O-O')) totalCastles++;
      });

      if (g.result === 'win' && (g.movesCount || history.length) < 22) {
        quickWins++;
      }
      if ((g.movesCount || history.length) >= 32) {
        longGames++;
      }
    });
  } else {
    // Fallback approximation when history is empty but profileStats has games
    totalMoves = totalGames * 24;
    totalCaptures = totalGames * 6;
    totalChecks = totalGames * 2;
  }

  const sampleSize = Math.max(1, games.length || totalGames);
  const avgMoves = totalMoves / sampleSize;
  const avgCaptures = totalCaptures / sampleSize;
  const avgChecks = totalChecks / sampleSize;
  const winRate = profileStats.wins / Math.max(1, totalGames);
  const drawRate = profileStats.draws / Math.max(1, totalGames);

  // Calculate personality suitability scores
  const scores: Record<ChessPersonalityId, number> = {
    attacker: avgCaptures * 2.5 + avgChecks * 3.2 + quickWins * 4 + winRate * 10,
    tactician: avgChecks * 3.8 + avgCaptures * 2.0 + (quickWins + 1) * 3,
    strategist: avgMoves * 1.5 + winRate * 18 + totalCastles * 2 - avgChecks * 0.5,
    defender: drawRate * 35 + totalCastles * 3.5 + longGames * 4,
    speedster: (35 - Math.min(30, avgMoves)) * 2 + quickWins * 6 + (sampleSize > 3 ? 5 : 0),
    chaos: avgCaptures * 2.8 + (1 - winRate) * 12 + (totalChecks > totalCastles ? 6 : 2),
    endgameMaster: longGames * 6 + avgMoves * 1.8 + winRate * 12,
  };

  // Select dominant personality
  let dominantId: ChessPersonalityId = 'attacker';
  let maxScore = -Infinity;

  (Object.keys(scores) as ChessPersonalityId[]).forEach((id) => {
    if (scores[id] > maxScore) {
      maxScore = scores[id];
      dominantId = id;
    }
  });

  // Calculate normalized 0-100 metric bars
  const attackScore = Math.min(
    96,
    Math.max(45, Math.round(50 + (avgCaptures - 4) * 6 + (avgChecks - 1.5) * 8))
  );
  const tacticalScore = Math.min(
    95,
    Math.max(42, Math.round(48 + avgChecks * 9 + (quickWins > 0 ? 12 : 4)))
  );
  const defenceScore = Math.min(
    94,
    Math.max(40, Math.round(45 + drawRate * 40 + totalCastles * 5 + (avgMoves > 25 ? 10 : 0)))
  );
  const endgameScore = Math.min(
    95,
    Math.max(38, Math.round(42 + longGames * 8 + (avgMoves > 28 ? 14 : 4) + winRate * 10))
  );

  const config = PERSONALITY_CONFIG[dominantId];

  return {
    id: dominantId,
    nameKey: config.nameKey,
    descKey: config.descKey,
    icon: config.icon,
    metrics: {
      attackStyle: attackScore,
      tacticalPlay: tacticalScore,
      defence: defenceScore,
      endgame: endgameScore,
    },
    isDeveloping: false,
    gamesAnalyzed: totalGames,
  };
}

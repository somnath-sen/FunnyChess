'use client';

import React from 'react';
import { PostGameModal, GameResultType } from '@/components/PostGame/PostGameModal';
import { AIPersonalityId } from '@/lib/ai/personality/types';

export type { GameResultType };

interface GameOverModalProps {
  isOpen: boolean;
  result: GameResultType;
  reason: string;
  movesCount?: number;
  difficulty?: string;
  moveHistory?: string[];
  playerColor?: 'white' | 'black';
  personalityId?: AIPersonalityId;
  opponentName?: string;
  isMultiplayer?: boolean;
  onRematch: () => void;
  onNewSetup?: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  reason,
  difficulty = 'easy',
  moveHistory = [],
  playerColor = 'white',
  personalityId = 'chill',
  opponentName,
  isMultiplayer = false,
  onRematch,
  onNewSetup,
  onClose,
}) => {
  return (
    <PostGameModal
      isOpen={isOpen}
      result={result}
      reason={reason}
      moveHistory={moveHistory}
      playerColor={playerColor}
      difficulty={difficulty}
      personalityId={personalityId}
      opponentName={opponentName}
      isMultiplayer={isMultiplayer}
      onRematch={onRematch}
      onNewSetup={onNewSetup}
      onClose={onClose}
    />
  );
};

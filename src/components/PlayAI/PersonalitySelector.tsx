'use client';

import React from 'react';
import { AIPersonalityId } from '@/lib/ai/personality/types';
import { AI_PERSONALITIES, PERSONALITY_LIST } from '@/lib/ai/personality/personalityConfig';
import { useTranslation } from '@/context/LanguageContext';

interface PersonalitySelectorProps {
  selected: AIPersonalityId;
  onChange: (id: AIPersonalityId) => void;
  disabled?: boolean;
  compact?: boolean;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  selected,
  onChange,
  disabled = false,
  compact = false,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ width: '100%' }}>
      {/* Scrollable pill container on mobile, flex on desktop */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {PERSONALITY_LIST.map((id) => {
          const config = AI_PERSONALITIES[id];
          const isSelected = selected === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => !disabled && onChange(id)}
              disabled={disabled}
              title={t(config.descKey, '')}
              style={{
                flex: compact ? '1 1 auto' : '0 0 auto',
                minWidth: compact ? 'auto' : '120px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: compact ? '0.45rem 0.75rem' : '0.6rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected
                  ? 'rgba(245, 158, 11, 0.16)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? '1px solid var(--accent-gold)'
                  : '1px solid var(--border-subtle)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                fontSize: compact ? '0.8rem' : '0.86rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled && !isSelected ? 0.5 : 1,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 0 12px rgba(245, 158, 11, 0.2)' : 'none',
              }}
            >
              <span style={{ fontSize: compact ? '1rem' : '1.1rem' }}>{config.emoji}</span>
              <span>{t(config.nameKey, config.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

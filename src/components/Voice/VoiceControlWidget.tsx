'use client';

import React from 'react';
import { VoiceLanguage } from '@/lib/audio/voiceSpeech';
import { 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sparkles, 
  Languages, 
  Sliders, 
  Play, 
  X, 
  Check, 
  Info 
} from 'lucide-react';

interface VoiceControlWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  voiceEnabled: boolean;
  volume: number;
  voiceLanguage: VoiceLanguage;
  activeVoiceName: string;
  isAvailable: boolean;
  isPlaying: boolean;
  onToggleVoice: (enabled: boolean) => void;
  onChangeVolume: (volume: number) => void;
  onChangeLanguage: (lang: VoiceLanguage) => void;
  onTestVoice: () => void;
}

export const VoiceControlWidget: React.FC<VoiceControlWidgetProps> = ({
  isOpen,
  onClose,
  voiceEnabled,
  volume,
  voiceLanguage,
  activeVoiceName,
  isAvailable,
  isPlaying,
  onToggleVoice,
  onChangeVolume,
  onChangeLanguage,
  onTestVoice,
}) => {
  if (!isOpen) return null;

  const languages: { id: VoiceLanguage; label: string; flag: string; native: string }[] = [
    { id: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
    { id: 'hi', label: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
    { id: 'bn', label: 'Bengali', flag: '🇧🇩', native: 'বাংলা' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2rem',
          backgroundColor: '#111622',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              🎙️
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                AI Voice Settings
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Web Speech API • ₹0 Free Client Voice
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {!isAvailable ? (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              marginBottom: '1rem',
            }}
          >
            🔇 Web Speech API is not supported by your current browser. Comments will still be displayed in text!
          </div>
        ) : (
          <>
            {/* 1. Voice Enable Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                  Enable AI Speech
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Speak funny reactions aloud during the match
                </div>
              </div>

              <button
                onClick={() => onToggleVoice(!voiceEnabled)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: voiceEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${voiceEnabled ? '#10b981' : 'var(--border-subtle)'}`,
                  color: voiceEnabled ? '#34d399' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{voiceEnabled ? 'VOICE ON' : 'MUTED'}</span>
              </button>
            </div>

            {/* 2. Voice Language Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Spoken Language
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {languages.map((l) => {
                  const isSelected = voiceLanguage === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => onChangeLanguage(l.id)}
                      style={{
                        padding: '0.7rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', marginBottom: '0.15rem' }}>{l.flag}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{l.label}</div>
                      <div style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                        {l.native}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Volume Slider */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Speech Volume
                </label>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Volume1 size={18} color="var(--text-muted)" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: 'var(--accent-gold)',
                    cursor: 'pointer',
                  }}
                />
                <Volume2 size={18} color="var(--text-muted)" />
              </div>
            </div>

            {/* Active Voice Info & Test Button */}
            <div
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                marginBottom: voiceLanguage === 'bn' && activeVoiceName.includes('Phonetic') ? '0.75rem' : '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Active System Voice
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#ffffff',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                  title={activeVoiceName}
                >
                  {activeVoiceName || 'Detecting system voices...'}
                </div>
              </div>

              <button
                onClick={onTestVoice}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                  border: `1px solid ${isPlaying ? '#10b981' : 'var(--accent-gold)'}`,
                  color: isPlaying ? '#34d399' : 'var(--accent-gold)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Play size={13} fill="currentColor" />
                <span>{isPlaying ? 'Speaking...' : 'Test Voice'}</span>
              </button>
            </div>

            {/* Helpful Bengali Note when using phonetic Indian voice fallback */}
            {voiceLanguage === 'bn' && activeVoiceName.includes('Phonetic') && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '0.74rem',
                  color: '#fbbf24',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.45rem',
                }}
              >
                <Info size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Bengali Speech Active:</strong> Windows does not pre-install a native Bengali voice package by default. FunnyChess automatically speaks with phonetic Bengali pronunciation so you can hear every witty reaction aloud!
                </div>
              </div>
            )}
          </>
        )}

        {/* Done Button */}
        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
        >
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};

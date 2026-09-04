'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { gameService } from '@/lib/multiplayer/gameService';
import { getSiteUrl } from '@/lib/url';
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Share2, 
  Play, 
  Sparkles, 
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Dice5
} from 'lucide-react';

export default function PlayFriendPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  // Creation state
  const [playerName, setPlayerName] = useState(user?.name || 'Funny Grandmaster');
  const [preferredColor, setPreferredColor] = useState<'white' | 'black' | 'random'>('white');
  const [createdGameCode, setCreatedGameCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Join state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // Handle game creation
  const handleCreateGame = async () => {
    setIsCreating(true);
    try {
      const game = await gameService.createGame({
        creatorName: playerName.trim() || 'Player 1',
        creatorId: user?.id || 'player_1_' + Math.random().toString(36).substring(2, 8),
        preferredColor,
      });
      setCreatedGameCode(game.id);
    } catch {
      alert('Failed to create game room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const getInviteUrl = () => {
    if (!createdGameCode) return '';
    const origin = getSiteUrl();
    return `${origin}/game/${createdGameCode}`;
  };

  const copyLink = () => {
    const url = getInviteUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const url = getInviteUrl();
    const text = `♟️ Challenge me on FunnyChess! Click here to play real-time chess with me: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleJoinGame = () => {
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setJoinError('Please enter a valid game code or URL');
      return;
    }

    // Extract code if user pasted full URL
    let targetCode = cleanCode;
    if (cleanCode.includes('/game/')) {
      const parts = cleanCode.split('/game/');
      targetCode = parts[1].replace(/[^A-Za-z0-9_-]/g, '');
    }

    router.push(`/game/${targetCode}`);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '840px' }}>
      {/* Top Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>
          <Users size={14} />
          <span>Real-Time Multiplayer</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '0.85rem' }}>
          Play Chess with a Friend 👥♟️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
          No account needed! Generate an invite link, share it on WhatsApp, and enjoy real-time legal chess with funny banter!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Left Card: Create New Match */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                  fontSize: '1.2rem',
                }}
              >
                ⚔️
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Create Match Room
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Generates an instant invitation link
                </div>
              </div>
            </div>

            {!createdGameCode ? (
              <>
                {/* Your Name */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Your Player Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Color Preference */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Play As
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    <button
                      onClick={() => setPreferredColor('white')}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: preferredColor === 'white' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${preferredColor === 'white' ? '#ffffff' : 'var(--border-subtle)'}`,
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      ⚪ White
                    </button>
                    <button
                      onClick={() => setPreferredColor('black')}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: preferredColor === 'black' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${preferredColor === 'black' ? '#ffffff' : 'var(--border-subtle)'}`,
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      ⚫ Black
                    </button>
                    <button
                      onClick={() => setPreferredColor('random')}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: preferredColor === 'random' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${preferredColor === 'random' ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                        color: preferredColor === 'random' ? 'var(--accent-gold)' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      🎲 Random
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCreateGame}
                  disabled={isCreating}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                >
                  <Sparkles size={16} />
                  <span>{isCreating ? 'Creating Room...' : 'Create Invite Link'}</span>
                </button>
              </>
            ) : (
              /* Game Created View */
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    marginBottom: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  🎉 Room Created: <strong style={{ color: '#ffffff' }}>{createdGameCode}</strong>
                </div>

                {/* Shareable Link Box */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Share Link with Friend
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <LinkIcon size={16} color="var(--accent-gold)" />
                    <input
                      type="text"
                      readOnly
                      value={getInviteUrl()}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-gold)',
                        fontSize: '0.88rem',
                        fontFamily: 'monospace',
                        flex: 1,
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={copyLink}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: copied ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Share & Enter Room */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button
                    onClick={shareOnWhatsApp}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#25D366',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => router.push(`/game/${createdGameCode}`)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Enter Game Room</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            ⚡ Real-time WebSockets • Synchronized moves • Zero latency
          </div>
        </div>

        {/* Right Card: Join Room by Code */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)',
                  fontSize: '1.2rem',
                }}
              >
                🔗
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Join Existing Match
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Got an invite code or link from a friend?
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Game Code or URL
              </label>
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => {
                  setJoinCodeInput(e.target.value);
                  setJoinError('');
                }}
                placeholder="e.g. FC-K9M2P4 or paste link"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${joinError ? '#ef4444' : 'var(--border-subtle)'}`,
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
              {joinError && (
                <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                  {joinError}
                </div>
              )}
            </div>

            <button
              onClick={handleJoinGame}
              className="btn-secondary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.5rem' }}
            >
              <span>Join Friend’s Game</span>
              <ArrowRight size={16} />
            </button>

            {/* How it works instructions */}
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#ffffff' }}>How multiplayer works:</strong>
              <ol style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', margin: '0.4rem 0 0' }}>
                <li>Creator picks White or Black and shares the room link.</li>
                <li>Friend clicks the link on phone or PC to join.</li>
                <li>The board starts immediately with legal chess validation.</li>
                <li>Funny banter reactions trigger after checks & captures!</li>
              </ol>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            🔒 Free-First • Private Rooms • No tracking or ads
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { gameService, normalizeGameCode } from '@/lib/multiplayer/gameService';
import { getSiteUrl } from '@/lib/url';
import { UserAvatar } from '@/components/UserAvatar';
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function PlayFriendPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();

  // Creation state
  const [playerName, setPlayerName] = useState(user?.name || 'Chess Player');
  const [preferredColor, setPreferredColor] = useState<'white' | 'black' | 'random'>('white');
  const [createdGameCode, setCreatedGameCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Join state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  // Sync player name with authenticated profile once loaded
  useEffect(() => {
    if (user?.name && !user.isGuest) {
      setPlayerName(user.name);
    }
  }, [user]);

  // Handle game creation strictly authenticated
  const handleCreateGame = async () => {
    if (!isAuthenticated) {
      setCreateError(t('multiplayerAuth.authRequired', 'Authentication required. Please sign in to create a game room.'));
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    try {
      const game = await gameService.createGame({
        creatorName: playerName.trim() || user?.name || 'Player',
        preferredColor,
      });
      setCreatedGameCode(game.id);
    } catch (err: any) {
      console.error('Failed to create room in database:', err);
      setCreateError(err?.message || t('multiplayerAuth.unableToCreate', 'Unable to create the game room. Please try again.'));
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
    const cleanCode = normalizeGameCode(joinCodeInput);
    if (!cleanCode) {
      setJoinError('Please enter a valid 6-character game code or URL');
      return;
    }

    router.push(`/game/${cleanCode}`);
  };

  // 1. Loading State while checking Supabase Auth session
  if (authLoading) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center', maxWidth: '540px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'pulseSubtle 1.2s infinite' }}>
          ♟️
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Checking authentication...
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Connecting with Supabase Auth
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State: Require Login
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '640px' }}>
        {/* Top Banner */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>
            <Users size={14} />
            <span>{t('friendShowcase.badge', 'Real-Time Multiplayer')}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.85rem' }}>
            Play Chess with a Friend 👥♟️
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto' }}>
            {t('multiplayerAuth.signInSubtitle', 'Create private chess rooms, invite your friends, and keep your games synchronized across devices.')}
          </p>
        </div>

        {/* Polished Sign-In Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2.75rem 2rem',
            textAlign: 'center',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.1)',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(139, 92, 246, 0.25))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)',
            }}
          >
            ♟️
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.65rem' }}>
            {t('multiplayerAuth.signInToPlay', 'Sign in to play with a friend')}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {t('multiplayerAuth.signInSubtitle', 'Create private chess rooms, invite your friends, and keep your games synchronized across devices.')}
          </p>

          <button
            onClick={() => signInWithGoogle('/play/friend')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.95rem 1.5rem',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              border: 'none',
              marginBottom: '1.25rem',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('multiplayerAuth.signInWithGoogle', 'Sign in with Google')}</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
            }}
          >
            <ShieldCheck size={15} color="var(--accent-emerald)" />
            <span>{t('multiplayerAuth.authRequiredNotice', 'Your account is required for secure multiplayer.')}</span>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem',
              fontSize: '0.85rem',
            }}
          >
            <Link
              href="/play/ai"
              style={{
                color: 'var(--accent-gold)',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>{t('multiplayerAuth.soloAlt', 'Want to play without signing in? Play with Funny AI →')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated State: Full Multiplayer Room Creation & Join UI
  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '840px' }}>
      {/* Top Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>
          <Users size={14} />
          <span>{t('friendShowcase.badge', 'Real-Time Multiplayer')}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '0.85rem' }}>
          Play Chess with a Friend 👥♟️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
          Create a private room, send the link to your friend, and battle in real time with synchronized moves and witty banter!
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <UserAvatar
                src={user?.avatar_url}
                name={playerName || 'Player'}
                size={42}
                borderRadius="12px"
                border="1px solid rgba(139, 92, 246, 0.4)"
              />
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Create Match Room
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                  Playing as {playerName}
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

                {createError && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{createError}</span>
                  </div>
                )}
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
                <li>Friend signs in with Google and joins in 1 click.</li>
                <li>The board starts immediately with legal chess validation.</li>
                <li>Funny banter reactions trigger after checks & captures!</li>
              </ol>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            🔒 Authenticated & Secure • Private Rooms • No tracking or ads
          </div>
        </div>
      </div>
    </div>
  );
}

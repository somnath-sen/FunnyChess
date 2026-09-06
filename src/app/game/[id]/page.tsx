'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Chess } from 'chess.js';
import { Chessboard } from '@/components/Chessboard/Chessboard';
import { gameService, MultiplayerGame, PlayerRole } from '@/lib/multiplayer/gameService';
import { getFriendComment, FriendGameEvent } from '@/lib/chess/friendComments';
import { useSpeech } from '@/hooks/useSpeech';
import { VoiceControlWidget } from '@/components/Voice/VoiceControlWidget';
import { HackPanel } from '@/components/HackMode/HackPanel';
import { analyzePosition, HackAnalysis } from '@/lib/chess/hackEngine';
import { sounds } from '@/lib/audio/soundEffects';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { UserAvatar } from '@/components/UserAvatar';
import { getSiteUrl } from '@/lib/url';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  RotateCcw, 
  Flag, 
  Handshake, 
  BrainCircuit, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Share2, 
  MessageCircle, 
  Loader2 
} from 'lucide-react';

export default function MultiplayerGamePage() {
  const params = useParams();
  const gameId = (params?.id as string)?.toUpperCase();

  return (
    <ProtectedRoute feature="game" gameId={gameId}>
      <MultiplayerGameContent gameId={gameId} />
    </ProtectedRoute>
  );
}

function MultiplayerGameContent({ gameId }: { gameId: string }) {
  const router = useRouter();
  const { language, t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const speech = useSpeech(language as any);

  // Identity state
  // Identity state
  const playerId = user?.id || '';
  const [myRole, setMyRole] = useState<PlayerRole>('spectator');
  const myRoleRef = useRef<PlayerRole>('spectator');

  const updateMyRole = useCallback((role: PlayerRole) => {
    myRoleRef.current = role;
    setMyRole(role);
  }, []);

  // Game Room state
  const [game, setGame] = useState<MultiplayerGame | null>(null);
  const gameRef = useRef<MultiplayerGame | null>(null);
  gameRef.current = game;

  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isVoiceWidgetOpen, setIsVoiceWidgetOpen] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [opponentJustJoined, setOpponentJustJoined] = useState(false);
  // HACK Mode State
  const [hackEnabled, setHackEnabled] = useState(false);
  const [hackAnalysis, setHackAnalysis] = useState<HackAnalysis | null>(null);
  const [hackLoading, setHackLoading] = useState(false);

  // Analyze position when HACK is enabled and FEN changes
  useEffect(() => {
    if (!hackEnabled || !game || game.status !== 'active') {
      setHackAnalysis(null);
      return;
    }

    let active = true;
    setHackLoading(true);

    analyzePosition(game.current_fen, language as any).then((res) => {
      if (active) {
        setHackAnalysis(res);
        setHackLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [hackEnabled, game, language]);

  // Dialogue & Reaction state
  const [friendComment, setFriendComment] = useState<string>('Game ready! Make your move! ♟️');

  // Draw Offer State
  const [drawOfferPending, setDrawOfferPending] = useState(false);

  // Trigger funny comment and speech
  const triggerComment = useCallback((event: FriendGameEvent, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const comment = getFriendComment(event, speech.voiceLanguage);
    setFriendComment(comment);
    speech.speak(comment, { priority, lang: speech.voiceLanguage });
  }, [speech]);

  const triggerCommentRef = useRef(triggerComment);
  triggerCommentRef.current = triggerComment;

  // Load and subscribe to game
  useEffect(() => {
    if (!gameId) return;

    // While auth is still actively verifying, wait
    if (authLoading) return;

    // If auth verification finished and user is not signed in, cancel room loading
    if (!isAuthenticated || !playerId) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    async function loadGame() {
      // Only show full-screen connecting spinner if we don't already have game data
      setLoading((prev) => (gameRef.current ? false : prev));
      setErrorStatus(null);
      setErrorMessage('');

      try {
        const res = await gameService.getGameDetails(gameId);
        if (!isSubscribed) return;

        if (!res.success) {
          setErrorStatus(res.error);
          setErrorMessage(res.message || '');
          return;
        }

        const data = res.game;
        setGame(data);

        // Determine player's role
        if (data.player_white === playerId) {
          updateMyRole('white');
        } else if (data.player_black === playerId) {
          updateMyRole('black');
        } else {
          updateMyRole('spectator');
        }
      } catch (err: any) {
        console.error('[MultiplayerGamePage] loadGame exception:', err);
        if (isSubscribed) {
          setErrorStatus('network_error');
          setErrorMessage(err?.message || 'Failed to load game room');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    loadGame();

    // Safety fallback: Never allow "Connecting to Game Room" to hang indefinitely
    const safetyTimer = setTimeout(() => {
      if (isSubscribed) {
        setLoading(false);
      }
    }, 6000);

    // Auto-resync when returning to tab or coming back online
    const handleRecheck = () => {
      gameService.getGameDetails(gameId).then((res) => {
        if (isSubscribed && res.success) {
          setGame(res.game);
          if (res.game.player_white === playerId) {
            updateMyRole('white');
          } else if (res.game.player_black === playerId) {
            updateMyRole('black');
          }
        }
      }).catch(() => {});
    };
    window.addEventListener('focus', handleRecheck);
    window.addEventListener('online', handleRecheck);

    // Subscribe to real-time updates
    const unsubscribe = gameService.subscribeToGame(gameId, (updatedGame, event, meta) => {
      if (!isSubscribed) return;

      setGame((prevGame) => {
        // Automatically detect transition from waiting to active (opponent joined!)
        if (prevGame?.status === 'waiting' && updatedGame.status === 'active') {
          setOpponentJustJoined(true);
          sounds.playSuccess();
          confetti({ particleCount: 75, spread: 70 });
          triggerCommentRef.current('game_start', 'high');
          setTimeout(() => {
            setOpponentJustJoined(false);
          }, 4500);
        }
        return updatedGame;
      });

      // Update role if newly assigned or matched
      if (updatedGame.player_white === playerId) {
        updateMyRole('white');
      } else if (updatedGame.player_black === playerId) {
        updateMyRole('black');
      } else {
        updateMyRole('spectator');
      }

      // Handle real-time audio and speech triggers
      if (event === 'player_joined') {
        sounds.playSuccess();
        triggerCommentRef.current('game_start');
      } else if (event === 'chess_move' && meta?.move) {
        const move = meta.move;
        const currentTurn = updatedGame.current_turn;
        const currentRole = myRoleRef.current;
        const movedByOpponent = (currentRole === 'white' && currentTurn === 'w') ||
                                (currentRole === 'black' && currentTurn === 'b');

        // Movement sound will play synchronously when the piece physically lands in Chessboard

        // Trigger funny speech for checks and captures
        if (move.san && move.san.includes('+')) {
          if (movedByOpponent) {
            triggerCommentRef.current('friend_gives_check', 'high');
          } else {
            triggerCommentRef.current('you_give_check', 'high');
          }
        } else if (move.captured === 'q') {
          if (movedByOpponent) {
            triggerCommentRef.current('friend_captures_queen');
          } else {
            triggerCommentRef.current('you_capture_queen');
          }
        } else if (move.captured) {
          if (movedByOpponent) {
            triggerCommentRef.current('friend_captures_piece');
          } else {
            triggerCommentRef.current('you_capture_piece');
          }
        }

        if (updatedGame.status === 'completed') {
          if (updatedGame.winner === currentRole) {
            triggerCommentRef.current('checkmate_you_win', 'high');
            confetti({ particleCount: 80, spread: 70 });
          } else if (updatedGame.winner === 'draw') {
            triggerCommentRef.current('draw', 'high');
          } else {
            triggerCommentRef.current('checkmate_friend_wins', 'high');
          }
        }
      } else if (event === 'game_resigned') {
        if (meta?.resignedBy !== myRoleRef.current) {
          triggerCommentRef.current('checkmate_you_win', 'high');
          confetti({ particleCount: 80, spread: 70 });
        } else {
          triggerCommentRef.current('resigned', 'high');
        }
      } else if (event === 'draw_offered' && meta?.offeredBy !== myRoleRef.current) {
        setDrawOfferPending(true);
      } else if (event === 'draw_accepted') {
        triggerCommentRef.current('draw', 'high');
        setDrawOfferPending(false);
      }
    });

    return () => {
      isSubscribed = false;
      clearTimeout(safetyTimer);
      window.removeEventListener('focus', handleRecheck);
      window.removeEventListener('online', handleRecheck);
      unsubscribe();
    };
  }, [gameId, playerId, isAuthenticated, authLoading, updateMyRole]);

  // Join as player 2 strictly authenticated
  const handleJoinGame = async () => {
    if (!gameId || !isAuthenticated || joining) return;
    setJoining(true);
    setJoinError(null);

    const res = await gameService.joinGame(
      gameId,
      user?.name || 'Challenger'
    );

    if ('error' in res) {
      setJoining(false);
      if (res.error === 'game_full') {
        setErrorStatus('full');
      } else if (res.error === 'already_joined') {
        setJoinError(res.message || "You can't join your own game!");
      } else {
        setJoinError(res.message || 'Could not join game: ' + res.error);
      }
      return;
    }

    setGame(res.game);
    updateMyRole(res.role);
    setJoining(false);
    sounds.playSuccess();
    triggerComment('game_start');
  };

  // Execute Move
  const handleMove = async (from: string, to: string, promotion: string = 'q') => {
    if (!game || game.status !== 'active') return;

    // Turn check
    const isMyTurn = (myRole === 'white' && game.current_turn === 'w') ||
                     (myRole === 'black' && game.current_turn === 'b');
    if (!isMyTurn) return;

    const res = await gameService.makeMove(game.id, from, to, promotion, myRole);
    if ('error' in res) {
      return;
    }

    setGame(res.game);
  };

  // Resign match
  const handleResign = async () => {
    if (!game || game.status !== 'active') return;
    if (confirm('Are you sure you want to resign the match?')) {
      const updated = await gameService.resign(game.id, myRole);
      setGame(updated);
      triggerComment('resigned', 'high');
    }
  };

  // Offer draw
  const handleOfferDraw = async () => {
    if (!game || game.status !== 'active') return;
    await gameService.offerDraw(game.id, myRole);
    alert('🤝 Draw offer sent to your friend!');
  };

  // Accept draw
  const handleAcceptDraw = async () => {
    if (!game) return;
    const updated = await gameService.acceptDraw(game.id);
    setGame(updated);
    setDrawOfferPending(false);
    triggerComment('draw', 'high');
  };

  // Rematch
  const handleRematch = async () => {
    if (!game || !user) return;
    try {
      const newGame = await gameService.createGame({
        creatorName: user.name,
        preferredColor: myRole === 'white' ? 'black' : 'white', // Swap colors
      });
      router.push(`/game/${newGame.id}`);
    } catch (err: any) {
      alert(err?.message || 'Failed to create rematch');
    }
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `${getSiteUrl()}/game/${gameId}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const url = getShareUrl();
    const text = `♟️ Challenge me on FunnyChess! Click here to play real-time chess with me: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 1. Loading Game Room State
  if (loading && !game) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'pulseSubtle 1s infinite' }}>
          ♟️
        </div>
        <h2>Connecting to Game Room...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Synchronizing authoritative state with Supabase</p>
      </div>
    );
  }

  // 4. Classified Error States (game is missing or error occurred)
  if (!game) {
    let errorTitle = 'Game Not Found';
    let errorEmoji = '😅';
    let errorDescription = 'This room code doesn’t exist or has expired. Check your invite link or create a new room!';
    let showRetry = false;

    if (errorStatus === 'not_authenticated') {
      errorTitle = 'Sign In Required';
      errorEmoji = '🔒';
      errorDescription = 'Please sign in with your Google account to join this match.';
    } else if (errorStatus === 'db_error') {
      errorTitle = 'Database Connection Issue';
      errorEmoji = '🔌';
      errorDescription = errorMessage || 'Could not connect to the multiplayer database. Please make sure the database migration has been run in Supabase, or check your connection.';
      showRetry = true;
    } else if (errorStatus === 'network_error') {
      errorTitle = 'Connection Failed';
      errorEmoji = '📡';
      errorDescription = errorMessage || 'Check your internet connection and try reconnecting.';
      showRetry = true;
    } else if (errorStatus === 'expired') {
      errorTitle = 'Room Expired';
      errorEmoji = '⏳';
      errorDescription = 'This game room has expired due to 24 hours of inactivity. Please create a fresh game room!';
    } else if (errorStatus === 'invalid_id') {
      errorTitle = 'Invalid Room Code';
      errorEmoji = '🔍';
      errorDescription = 'The room code in your link doesn’t match the expected format (e.g. FC-XXXXXX).';
    } else if (errorStatus === 'full' || errorStatus === 'game_full') {
      errorTitle = 'Room is Full';
      errorEmoji = '👥';
      errorDescription = 'This match is already in progress between two players.';
    } else if (errorStatus === 'permission_error') {
      errorTitle = 'Access Restricted';
      errorEmoji = '🔒';
      errorDescription = errorMessage || 'You do not have permission to view or join this game room.';
    }

    return (
      <div className="container" style={{ padding: '6rem 1rem', maxWidth: '520px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{errorEmoji}</div>
          <h2 style={{ marginBottom: '0.5rem' }}>{errorTitle}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5, fontSize: '0.95rem' }}>
            {errorDescription}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {showRetry && (
              <button
                onClick={() => {
                  setErrorStatus(null);
                  setLoading(true);
                  gameService.getGameDetails(gameId).then((res) => {
                    if (res.success) {
                      setGame(res.game);
                      setErrorStatus(null);
                    } else {
                      setErrorStatus(res.error);
                      setErrorMessage(res.message || '');
                    }
                    setLoading(false);
                  });
                }}
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                <span>Retry Connection</span>
              </button>
            )}
            <button
              onClick={() => router.push('/play/friend')}
              className={showRetry ? 'btn-secondary' : 'btn-primary'}
              style={{ width: showRetry ? 'auto' : '100%', padding: '0.75rem 1.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>{errorStatus === 'full' || errorStatus === 'game_full' ? 'Create New Game' : 'Back to Play Friend'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dedicated Guard: A friend game is ONLY ready to play when active/completed with two DIFFERENT authenticated players
  const isFriendGameReady =
    Boolean(game) &&
    game!.game_type === 'friend' &&
    (game!.status === 'active' || game!.status === 'completed') &&
    Boolean(game!.player_white) &&
    Boolean(game!.player_black) &&
    game!.player_white !== game!.player_black;

  // 4. Waiting / Not Ready State Handling
  if (!isFriendGameReady) {
    if (game.status === 'waiting') {
      const isCreator = Boolean(
        playerId && (game.player_white === playerId || game.player_black === playerId)
      );

      // 4A. Creator Waiting for Opponent Screen
      if (isCreator || myRole === 'white' || myRole === 'black') {
        const creatorPlayingColor = game.player_white === playerId ? 'White (⚪)' : 'Black (⚫)';
        return (
          <div className="container" style={{ padding: '4.5rem 1rem 6rem', maxWidth: '580px', textAlign: 'center' }}>
            <div
              className="glass-panel"
              style={{
                padding: '3rem 2rem',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.1)',
                position: 'relative',
              }}
            >
              {/* Opponent Joined Transition Flash Banner */}
              {opponentJustJoined && (
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    marginBottom: '1.5rem',
                    animation: 'pulseSubtle 0.8s infinite',
                  }}
                >
                  🎉 Opponent Joined! Starting live match...
                </div>
              )}

              {/* Animated Chess Icon */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(139, 92, 246, 0.25))',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)',
                  animation: 'pulseSubtle 1.4s infinite',
                }}
              >
                ⏳
              </div>

              <div className="badge badge-purple" style={{ marginBottom: '0.85rem' }}>
                <Users size={13} />
                <span>Waiting for Opponent</span>
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                Your Chess Room is Ready!
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Share this invite link with your friend. You are playing as <strong style={{ color: 'var(--accent-gold)' }}>{creatorPlayingColor}</strong>. The match will start automatically the second your friend joins!
              </p>

              {/* Room Code Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold)',
                  marginBottom: '1.5rem',
                  letterSpacing: '1px',
                }}
              >
                <span>Room Code:</span>
                <span style={{ fontFamily: 'monospace', color: '#ffffff', fontSize: '1.05rem' }}>{game.id}</span>
              </div>

              {/* Shareable Link Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <LinkIcon size={16} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  readOnly
                  value={getShareUrl()}
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
                    backgroundColor: copied ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Action Buttons: WhatsApp & Back */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <button
                  onClick={shareOnWhatsApp}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#25D366',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  onClick={() => router.push('/play/friend')}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Play Friend</span>
                </button>
              </div>

              {/* Realtime Pulse Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  color: '#34d399',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block',
                    animation: 'pulseSubtle 0.9s infinite',
                    boxShadow: '0 0 10px #10b981',
                  }}
                />
                <span>Waiting for your friend to join... ⏳ Real-time listener active</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                You can keep this page open. The game will start automatically when your friend joins.
              </div>
            </div>
          </div>
        );
      }

      // 4B. Challenge Join Prompt (for Player B / Invited Friend)
      const hostName = game.player_white_name || game.player_black_name || 'Your friend';
      return (
        <div className="container" style={{ padding: '5rem 1rem 6rem', maxWidth: '540px', textAlign: 'center' }}>
          <div
            className="glass-panel"
            style={{
              padding: '2.75rem 2rem',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.1)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(245, 158, 11, 0.2))',
                border: '1px solid rgba(139, 92, 246, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                margin: '0 auto 1.25rem',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)',
              }}
            >
              ⚔️
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              You’ve Been Challenged!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              <strong style={{ color: '#ffffff' }}>{hostName}</strong> {t('multiplayerAuth.invitedDuel', 'invited you to a live chess duel on FunnyChess!')}
            </p>

            {/* Playing As Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <UserAvatar
                src={user?.avatar_url}
                name={user?.name || 'Player'}
                size={40}
                borderRadius="50%"
                border="1px solid var(--accent-gold)"
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Playing As
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {user?.name || 'Challenger'}
                </div>
              </div>
            </div>

            {joinError && (
              <div
                style={{
                  marginBottom: '1.25rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textAlign: 'left',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{joinError}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleJoinGame}
                disabled={joining}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {joining ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Connecting to Match...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>{t('multiplayerAuth.acceptChallenge', 'Accept Challenge & Play')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => router.push('/play/friend')}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
              >
                <ArrowLeft size={16} />
                <span>Back to Play Friend</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 4C. Incomplete or Inactive State (Fallback)
    return (
      <div className="container" style={{ padding: '6rem 1rem', maxWidth: '520px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♟️</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Waiting for Match Setup</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5, fontSize: '0.95rem' }}>
            This room requires two active players before the chess match begins.
          </p>
          <button
            onClick={() => router.push('/play/friend')}
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem 1.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Play Friend</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. Active & Completed Game Arena
  const opponentName =
    myRole === 'white'
      ? (game.player_black_name || 'Opponent (Black)')
      : (game.player_white_name || 'Opponent (White)');
  const myDisplayName =
    myRole === 'white'
      ? (game.player_white_name || user?.name || 'You')
      : (game.player_black_name || user?.name || 'You');
  const isMyTurn =
    (myRole === 'white' && game.current_turn === 'w') ||
    (myRole === 'black' && game.current_turn === 'b');
  const isGameOver = game.status === 'completed';

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => router.push('/play/friend')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              color: 'var(--text-secondary)',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Friend Match: {game.id}</h1>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                <Wifi size={12} style={{ marginRight: '3px' }} />
                <span>Live Multiplayer</span>
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              You are playing as <strong>{myRole === 'white' ? 'White (⚪)' : 'Black (⚫)'}</strong> vs{' '}
              <strong>{opponentName}</strong>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => speech.setVoiceEnabled(!speech.voiceEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: speech.voiceEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${speech.voiceEnabled ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
              color: speech.voiceEnabled ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {speech.voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Voice {speech.voiceEnabled ? 'ON' : 'Muted'}</span>
          </button>

          <button
            onClick={() => setIsVoiceWidgetOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-gold)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>🎙️</span>
            <span style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 700 }}>
              {speech.voiceLanguage}
            </span>
          </button>

          <button
            onClick={() => setHackEnabled(!hackEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.85rem',
              minWidth: '130px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: hackEnabled ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${hackEnabled ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
              color: hackEnabled ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <BrainCircuit size={16} />
            <span>🧠 HACK {hackEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Draw Offer Notification Alert */}
      {drawOfferPending && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Handshake size={20} color="var(--accent-gold)" />
            <span style={{ fontWeight: 700, color: '#ffffff' }}>
              Your friend offered a Draw! Do you accept peace?
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleAcceptDraw}
              className="btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              Accept Draw
            </button>
            <button
              onClick={() => setDrawOfferPending(false)}
              className="btn-secondary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Opponent Joined Celebratory Live Match Banner */}
      {opponentJustJoined && (
        <div
          className="glass-panel"
          style={{
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>🎉</span>
          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>
            Opponent Joined! The live match has started!
          </span>
        </div>
      )}

      {/* Main Playing Arena */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Left Arena: Chessboard & Player Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          {/* Opponent (Friend) Status Strip */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: '#c084fc',
                }}
              >
                👥
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  {opponentName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {myRole === 'white' ? 'Playing as Black (⚫)' : 'Playing as White (⚪)'}
                </div>
              </div>
            </div>

            {!isMyTurn && !isGameOver && (
              <div className="badge badge-gold animate-pulse-subtle" style={{ fontSize: '0.75rem' }}>
                Friend’s Turn ⏳
              </div>
            )}
          </div>

          {/* Interactive Chessboard (oriented to player's color) */}
          <Chessboard
            fen={game.current_fen}
            orientation={myRole === 'black' ? 'black' : 'white'}
            interactive={isMyTurn && !isGameOver}
            onMove={(from, to, promotion) => {
              handleMove(from, to, promotion);
            }}
            customArrows={
              hackEnabled && hackAnalysis?.bestMove
                ? [{ from: hackAnalysis.bestMove.from, to: hackAnalysis.bestMove.to, color: '#10b981' }]
                : []
            }
            highlightSquares={
              hackEnabled && hackAnalysis?.bestMove
                ? [hackAnalysis.bestMove.from, hackAnalysis.bestMove.to]
                : []
            }
          />

          {/* You (Player) Status Strip */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#0a0d14',
                }}
              >
                Y
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  {myDisplayName} (You)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {myRole === 'white' ? 'White (⚪)' : 'Black (⚫)'}
                </div>
              </div>
            </div>

            {isMyTurn && !isGameOver && (
              <div className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                Your Turn ♟️
              </div>
            )}
          </div>

          {/* Action Game Controls - Anchored under player strip */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: isGameOver ? '1fr 1fr' : '1fr 1fr', gap: '0.75rem' }}>
            {isGameOver ? (
              <>
                <button
                  onClick={handleRematch}
                  className="btn-primary"
                  style={{ padding: '0.8rem', fontSize: '0.95rem' }}
                >
                  <RotateCcw size={16} />
                  <span>🔄 Rematch</span>
                </button>
                <button
                  onClick={() => router.push('/play/friend')}
                  className="btn-secondary"
                  style={{ padding: '0.8rem', fontSize: '0.95rem' }}
                >
                  <span>New Room</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleOfferDraw}
                  className="btn-secondary"
                  style={{ padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <Handshake size={16} />
                  <span>Offer Draw</span>
                </button>

                <button
                  onClick={handleResign}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#f87171',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Flag size={16} />
                  <span>Resign</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Arena: Commentary, HACK Panel & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Funny Friend Chat Dialogue Bubble */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              backgroundColor: '#111622',
              position: 'relative',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🎙️😂</span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                  Match Commentary
                </span>
              </div>
              {speech.isPlaying && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div style={{ width: '4px', height: '14px', backgroundColor: 'var(--accent-gold)', borderRadius: '2px', animation: 'pulseSubtle 0.5s infinite' }} />
                  <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--accent-gold)', borderRadius: '2px', animation: 'pulseSubtle 0.3s infinite' }} />
                  <div style={{ width: '4px', height: '10px', backgroundColor: 'var(--accent-gold)', borderRadius: '2px', animation: 'pulseSubtle 0.4s infinite' }} />
                </div>
              )}
            </div>

            <div
              style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: '#f8fafc',
                fontSize: '1rem',
                lineHeight: 1.5,
                fontStyle: 'italic',
                minHeight: '64px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              “{friendComment}”
            </div>
          </div>

          {/* HACK Mode Learning Assistant Panel */}
          {hackEnabled && (
            <HackPanel
              analysis={hackAnalysis}
              loading={hackLoading}
              onClose={() => setHackEnabled(false)}
              lang={language as any}
            />
          )}

          {/* Move History Table */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Move Notation History
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {Math.ceil(game.move_history.length / 2)} Turns
              </span>
            </div>

            {game.move_history.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem 0', textAlign: 'center' }}>
                Match has begun! Moves will appear here live.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.4rem',
                  fontSize: '0.88rem',
                }}
              >
                {Array.from({ length: Math.ceil(game.move_history.length / 2) }).map((_, i) => {
                  const whiteMove = game.move_history[i * 2];
                  const blackMove = game.move_history[i * 2 + 1];
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                        {i + 1}.
                      </span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{whiteMove}</span>
                      {blackMove && <span style={{ color: 'var(--text-secondary)' }}>{blackMove}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Voice Control Modal */}
      <VoiceControlWidget
        isOpen={isVoiceWidgetOpen}
        onClose={() => setIsVoiceWidgetOpen(false)}
        voiceEnabled={speech.voiceEnabled}
        volume={speech.volume}
        voiceLanguage={speech.voiceLanguage}
        activeVoiceName={speech.activeVoiceName}
        isAvailable={speech.isAvailable}
        isPlaying={speech.isPlaying}
        onToggleVoice={speech.setVoiceEnabled}
        onChangeVolume={speech.setVolume}
        onChangeLanguage={speech.setVoiceLanguage}
        onTestVoice={speech.testVoice}
      />
    </div>
  );
}

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
  Wifi,
  WifiOff,
  Share2
} from 'lucide-react';

export default function MultiplayerGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = (params?.id as string)?.toUpperCase();
  const { language, t } = useTranslation();
  const { user } = useAuth();
  const speech = useSpeech(language as any);

  // Identity state
  const [playerId, setPlayerId] = useState<string>('');
  const [myRole, setMyRole] = useState<PlayerRole>('spectator');
  const [joinNameInput, setJoinNameInput] = useState<string>('');

  // Game Room state
  const [game, setGame] = useState<MultiplayerGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVoiceWidgetOpen, setIsVoiceWidgetOpen] = useState(false);
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
  }, [hackEnabled, game?.current_fen, game?.status, language]);

  // Dialogue & Reaction state
  const [friendComment, setFriendComment] = useState<string>('Game ready! Make your move! ♟️');

  // Draw Offer State
  const [drawOfferPending, setDrawOfferPending] = useState(false);

  // Initialize or restore player session identity
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let storedId = localStorage.getItem('funnychess_player_id');
    if (!storedId) {
      storedId = user?.id || 'player_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('funnychess_player_id', storedId);
    }
    setPlayerId(storedId);
    setJoinNameInput(user?.name || 'Guest Challenger');
  }, [user]);

  // Load and subscribe to game
  useEffect(() => {
    if (!gameId || !playerId) return;

    let isSubscribed = true;

    async function loadGame() {
      setLoading(true);
      const data = await gameService.getGame(gameId);
      if (!isSubscribed) return;

      if (!data) {
        setErrorStatus('not_found');
        setLoading(false);
        return;
      }

      setGame(data);

      // Determine player's role
      if (data.player_white === playerId) {
        setMyRole('white');
      } else if (data.player_black === playerId) {
        setMyRole('black');
      } else if (data.player_white && data.player_black) {
        setMyRole('spectator');
      }

      setLoading(false);
    }

    loadGame();

    // Subscribe to real-time updates
    const unsubscribe = gameService.subscribeToGame(gameId, (updatedGame, event, meta) => {
      if (!isSubscribed) return;
      setGame(updatedGame);

      // Handle real-time audio and speech triggers
      if (event === 'player_joined') {
        sounds.playSuccess();
        triggerComment('game_start');
      } else if (event === 'chess_move' && meta?.move) {
        const move = meta.move;
        const chess = new Chess(updatedGame.current_fen);

        if (move.captured) {
          sounds.playCapture();
        } else if (chess.inCheck()) {
          sounds.playCheck();
        } else {
          sounds.playMove();
        }

        // Check contextual reaction based on who moved
        const movedByOpponent = (myRole === 'white' && updatedGame.current_turn === 'w') ||
                                (myRole === 'black' && updatedGame.current_turn === 'b');

        if (updatedGame.status === 'completed') {
          if (updatedGame.winner === myRole) {
            triggerComment('checkmate_you_win', 'high');
            confetti({ particleCount: 80, spread: 70 });
          } else if (updatedGame.winner === 'draw') {
            triggerComment('draw', 'high');
          } else {
            triggerComment('checkmate_friend_wins', 'high');
          }
        } else if (chess.inCheck()) {
          if (movedByOpponent) {
            triggerComment('friend_gives_check');
          } else {
            triggerComment('you_give_check');
          }
        } else if (move.captured === 'q') {
          if (movedByOpponent) {
            triggerComment('friend_captures_queen');
          } else {
            triggerComment('you_capture_queen');
          }
        } else if (move.captured) {
          if (movedByOpponent) {
            triggerComment('friend_captures_piece');
          } else {
            triggerComment('you_capture_piece');
          }
        }
      } else if (event === 'game_resigned') {
        if (meta?.resignedBy !== myRole) {
          triggerComment('checkmate_you_win', 'high');
          confetti({ particleCount: 80, spread: 70 });
        } else {
          triggerComment('resigned', 'high');
        }
      } else if (event === 'draw_offered' && meta?.offeredBy !== myRole) {
        setDrawOfferPending(true);
      } else if (event === 'draw_accepted') {
        triggerComment('draw', 'high');
        setDrawOfferPending(false);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [gameId, playerId, myRole]);

  // Trigger funny comment and speech
  const triggerComment = useCallback((event: FriendGameEvent, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const comment = getFriendComment(event, speech.voiceLanguage);
    setFriendComment(comment);
    speech.speak(comment, { priority, lang: speech.voiceLanguage });
  }, [speech]);

  // Join as player 2
  const handleJoinGame = async () => {
    if (!gameId || !playerId) return;
    const res = await gameService.joinGame(
      gameId,
      joinNameInput.trim() || 'Challenger',
      playerId
    );

    if ('error' in res) {
      if (res.error === 'game_full') {
        setErrorStatus('full');
      } else {
        alert('Could not join game: ' + res.error);
      }
      return;
    }

    setGame(res.game);
    setMyRole(res.role);
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
    if (!game) return;
    const newGame = await gameService.createGame({
      creatorName: myRole === 'white' ? game.player_white_name : game.player_black_name || 'Player',
      creatorId: playerId,
      preferredColor: myRole === 'white' ? 'black' : 'white', // Swap colors
    });
    router.push(`/game/${newGame.id}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'pulseSubtle 1s infinite' }}>
          ♟️
        </div>
        <h2>Connecting to Game Room...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Synchronizing with Supabase Realtime</p>
      </div>
    );
  }

  // 2. Error States
  if (errorStatus === 'not_found' || !game) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', maxWidth: '500px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😅</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Game Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            This room code doesn’t exist or has expired. Check your invite link or create a new room!
          </p>
          <button onClick={() => router.push('/play/friend')} className="btn-primary" style={{ width: '100%' }}>
            <ArrowLeft size={16} />
            <span>Create New Game</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Challenge Join Prompt (if visitor is not yet in the game)
  if (myRole === 'spectator' && game.status === 'waiting') {
    return (
      <div className="container" style={{ padding: '5rem 1rem', maxWidth: '520px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '2.5rem 2rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚔️</div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>You’ve Been Challenged!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            <strong style={{ color: '#ffffff' }}>{game.player_white_name}</strong> invited you to a live chess duel on FunnyChess!
          </p>

          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Your Display Name
            </label>
            <input
              type="text"
              value={joinNameInput}
              onChange={(e) => setJoinNameInput(e.target.value)}
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

          <button onClick={handleJoinGame} className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
            <Sparkles size={16} />
            <span>Accept Challenge & Play</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Waiting Room (Creator waiting for friend)
  if (game.status === 'waiting') {
    return (
      <div className="container" style={{ padding: '5rem 1rem', maxWidth: '560px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulseSubtle 1.2s infinite' }}>
            ⏳
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Waiting for Your Friend...</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Share this invite link. The game will launch immediately in real time as soon as your friend clicks to join!
          </p>

          {/* Shareable Link Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
            }}
          >
            <LinkIcon size={16} color="var(--accent-gold)" />
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.88rem', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulseSubtle 0.8s infinite' }} />
            <span>Room Code: {game.id} • Real-time listener active</span>
          </div>
        </div>
      </div>
    );
  }

  // 5. Active & Completed Game Arena
  const opponentName = myRole === 'white' ? (game.player_black_name || 'Friend') : game.player_white_name;
  const isMyTurn = (myRole === 'white' && game.current_turn === 'w') ||
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
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: hackEnabled ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${hackEnabled ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
              color: hackEnabled ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
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
                  {myRole === 'white' ? game.player_white_name : game.player_black_name || 'You'} (You)
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
        </div>

        {/* Right Arena: Commentary, History & Game Controls */}
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

          {/* Action Game Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: isGameOver ? '1fr 1fr' : '1fr 1fr', gap: '0.75rem' }}>
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

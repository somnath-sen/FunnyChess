import { Chess } from 'chess.js';
import { getSupabase } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface MultiplayerGame {
  id: string;
  game_type: 'friend';
  status: 'waiting' | 'active' | 'completed' | 'abandoned';
  player_white: string | null;
  player_white_name: string | null;
  player_black: string | null;
  player_black_name: string | null;
  current_fen: string;
  move_history: string[];
  current_turn: 'w' | 'b';
  last_move: { from: string; to: string } | null;
  winner: 'white' | 'black' | 'draw' | null;
  draw_offer: 'white' | 'black' | null;
  created_at: string;
  updated_at: string;
}

export type PlayerRole = 'white' | 'black' | 'spectator';

export type GameFetchError =
  | 'not_authenticated'
  | 'not_found'
  | 'expired'
  | 'game_full'
  | 'db_error'
  | 'permission_error'
  | 'network_error'
  | 'invalid_id';

export type GameFetchResult =
  | { success: true; game: MultiplayerGame }
  | { success: false; error: GameFetchError; message?: string };

// Helper to retrieve the verified Supabase Auth user
export async function getAuthenticatedUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    // 1. Fast path: check cached active session in localStorage immediately
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) return session.user;

    // 2. Fallback to server check
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

// Generate difficult-to-guess, non-sequential room code (e.g. "FC-K9M2P4")
export function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Normalize room code from user input or URL
export function normalizeGameCode(rawCode: string): string {
  if (!rawCode) return '';
  let cleaned = rawCode.trim().toUpperCase();

  // Strip URL prefix if user pasted a full URL
  if (cleaned.includes('/GAME/')) {
    cleaned = cleaned.split('/GAME/')[1];
  }

  // Strip query parameters and hashes
  cleaned = cleaned.split('?')[0].split('#')[0];

  // Remove any remaining invalid characters
  cleaned = cleaned.replace(/[^A-Z0-9-]/g, '');

  // If user entered 6 characters without FC- prefix, prepend FC-
  if (!cleaned.startsWith('FC-') && cleaned.length === 6) {
    cleaned = `FC-${cleaned}`;
  }

  return cleaned;
}

// Convert database row into typed MultiplayerGame
export function formatGameRow(data: any): MultiplayerGame {
  let currentTurn: 'w' | 'b' = 'w';
  try {
    currentTurn = new Chess(data.current_fen).turn();
  } catch {
    currentTurn = 'w';
  }

  return {
    id: data.id,
    game_type: 'friend',
    status: data.status || 'waiting',
    player_white: data.player_white || null,
    player_white_name: data.player_white_name || (data.player_white ? 'Player White' : null),
    player_black: data.player_black || null,
    player_black_name: data.player_black_name || (data.player_black ? 'Player Black' : null),
    current_fen: data.current_fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    move_history: Array.isArray(data.move_history) ? data.move_history : [],
    current_turn: currentTurn,
    last_move: data.last_move || null,
    winner: data.winner || null,
    draw_offer: data.draw_offer || null,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
}

// Check if a waiting room has expired (> 24 hours of inactivity)
export function isGameExpired(game: MultiplayerGame): boolean {
  if (game.status === 'waiting' && game.created_at) {
    const createdTime = new Date(game.created_at).getTime();
    if (!isNaN(createdTime)) {
      const hoursDiff = (Date.now() - createdTime) / (1000 * 60 * 60);
      if (hoursDiff > 24) return true;
    }
  }
  return false;
}

class GameService {
  // Store active realtime channel references to avoid dropped messages
  private activeChannels = new Map<string, RealtimeChannel>();

  // Broadcast event via Supabase Realtime channel and local BroadcastChannel
  private broadcastEvent(gameId: string, event: string, payload: any) {
    // 1. Local BroadcastChannel for instant local testing between tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('funnychess_realtime_' + gameId);
        bc.postMessage({ event, payload });
        bc.close();
      } catch {}
    }

    // 2. Supabase Realtime Channel
    const activeChannel = this.activeChannels.get(gameId);
    if (activeChannel) {
      try {
        activeChannel.send({
          type: 'broadcast',
          event,
          payload,
        });
      } catch (err) {
        console.warn('[GameService] Realtime broadcast error:', err);
      }
    }
  }

  // Create a new multiplayer game strictly authenticated with Supabase
  public async createGame(params: {
    creatorName?: string;
    preferredColor?: 'white' | 'black' | 'random';
  }): Promise<MultiplayerGame> {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment configuration.');
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      throw new Error('Authentication required. You must be signed in with Google to create a game room.');
    }

    const id = generateGameCode();
    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let isCreatorWhite = true;
    if (params.preferredColor === 'black') {
      isCreatorWhite = false;
    } else if (params.preferredColor === 'random') {
      isCreatorWhite = Math.random() > 0.5;
    }

    const resolvedName =
      params.creatorName?.trim() ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      'Player';

    const now = new Date().toISOString();
    const rowToInsert = {
      id,
      game_type: 'friend',
      status: 'waiting',
      player_white: isCreatorWhite ? user.id : null,
      player_white_name: isCreatorWhite ? resolvedName : null,
      player_black: !isCreatorWhite ? user.id : null,
      player_black_name: !isCreatorWhite ? resolvedName : null,
      current_fen: initialFen,
      move_history: [],
      last_move: null,
      winner: null,
      draw_offer: null,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('games')
      .insert(rowToInsert)
      .select()
      .single();

    if (error) {
      console.error('[GameService] Error creating game in Supabase:', error);
      throw new Error(`Unable to create the game room: ${error.message}`);
    }

    if (!data) {
      throw new Error('Unable to create the game room. Please try again.');
    }

    return formatGameRow(data);
  }

  // Detailed fetch with specific error classification
  public async getGameDetails(rawId: string): Promise<GameFetchResult> {
    const id = normalizeGameCode(rawId);
    if (!id) {
      return { success: false, error: 'invalid_id', message: 'Room code is empty or invalid' };
    }

    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'db_error', message: 'Supabase client is not available' };
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, error: 'not_authenticated', message: 'Sign in to join this game' };
    }

    try {
      // First try the normalized ID
      let { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      // If not found and ID was entered without FC-, try with FC-
      if (!data && !error && !id.startsWith('FC-') && id.length === 6) {
        const res = await supabase
          .from('games')
          .select('*')
          .eq('id', `FC-${id}`)
          .maybeSingle();
        data = res.data;
        error = res.error;
      }

      if (error) {
        console.error('[GameService] Supabase error fetching game:', error);
        if (error.code === 'PGRST205') {
          return {
            success: false,
            error: 'db_error',
            message: 'Multiplayer database table not found. Please run the Supabase migration script.',
          };
        }
        if (error.code === '42501') {
          return {
            success: false,
            error: 'permission_error',
            message: 'You do not have permission to view this game room.',
          };
        }
        return { success: false, error: 'db_error', message: error.message };
      }

      if (data) {
        const game = formatGameRow(data);
        if (isGameExpired(game)) {
          return {
            success: false,
            error: 'expired',
            message: 'This room code has expired after 24 hours of inactivity.',
          };
        }
        // If room is full and current user is not a participant
        if (
          game.player_white &&
          game.player_black &&
          game.player_white !== user.id &&
          game.player_black !== user.id
        ) {
          return {
            success: false,
            error: 'game_full',
            message: 'This match is already in progress between two players.',
          };
        }
        return { success: true, game };
      }

      // Genuinely not found in Supabase
      return { success: false, error: 'not_found', message: 'Room does not exist' };
    } catch (err: any) {
      console.error('[GameService] Network/system exception fetching game:', err);
      return { success: false, error: 'network_error', message: err?.message || 'Connection failed' };
    }
  }

  // Simplified fetch returning game or null
  public async getGame(id: string): Promise<MultiplayerGame | null> {
    const res = await this.getGameDetails(id);
    return res.success ? res.game : null;
  }

  // Join existing game as second player
  public async joinGame(
    id: string,
    playerName?: string
  ): Promise<{ game: MultiplayerGame; role: PlayerRole } | { error: string; message?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: 'db_error', message: 'Database connection unavailable' };
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return { error: 'not_authenticated', message: 'You must be signed in to join this game.' };
    }

    const details = await this.getGameDetails(id);
    if (!details.success) {
      return { error: details.error, message: details.message };
    }
    const game = details.game;

    // Strictly prevent a user from joining their own game room as the opponent
    if (game.player_white === user.id || game.player_black === user.id) {
      return {
        error: 'already_joined',
        message: "You can't join your own game! Share the invite link with a friend to play.",
      };
    }

    // Check if room is already full
    if (game.player_white && game.player_black) {
      return { error: 'game_full', message: 'This match already has two players.' };
    }

    // Check that room is still waiting
    if (game.status !== 'waiting') {
      return { error: 'not_waiting', message: 'This game is no longer waiting for an opponent.' };
    }

    const resolvedName =
      playerName?.trim() ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      'Challenger';

    // 1. Try atomic PostgreSQL RPC function if available (FOR UPDATE locking)
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('join_game_room', {
        p_game_id: game.id,
        p_player_name: resolvedName,
      });

      if (!rpcError && rpcData) {
        const persisted = formatGameRow(rpcData);
        const assignedRole: PlayerRole = persisted.player_white === user.id ? 'white' : 'black';
        this.broadcastEvent(game.id, 'player_joined', { game: persisted });
        return { game: persisted, role: assignedRole };
      }
    } catch {
      // Fall through to atomic conditional update query
    }

    // 2. Safe atomic conditional update query
    const now = new Date().toISOString();
    let assignedRole: PlayerRole = 'black';
    let updateQuery;

    if (!game.player_white) {
      assignedRole = 'white';
      updateQuery = supabase
        .from('games')
        .update({
          player_white: user.id,
          player_white_name: resolvedName,
          status: 'active',
          updated_at: now,
        })
        .eq('id', game.id)
        .eq('status', 'waiting')
        .is('player_white', null)
        .neq('player_black', user.id);
    } else {
      assignedRole = 'black';
      updateQuery = supabase
        .from('games')
        .update({
          player_black: user.id,
          player_black_name: resolvedName,
          status: 'active',
          updated_at: now,
        })
        .eq('id', game.id)
        .eq('status', 'waiting')
        .is('player_black', null)
        .neq('player_white', user.id);
    }

    const { data, error } = await updateQuery.select().single();

    if (error || !data) {
      console.error('[GameService] Failed to persist join in Supabase:', error);
      return {
        error: 'game_full',
        message: 'Could not join room. It may already be full or no longer waiting for an opponent.',
      };
    }

    const persisted = formatGameRow(data);
    this.broadcastEvent(game.id, 'player_joined', { game: persisted });
    return { game: persisted, role: assignedRole };
  }

  // Make legal move
  public async makeMove(
    id: string,
    from: string,
    to: string,
    promotion: string = 'q',
    playerRole: PlayerRole
  ): Promise<{ game: MultiplayerGame; move: any } | { error: string }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Database connection unavailable' };

    const user = await getAuthenticatedUser();
    if (!user) return { error: 'Authentication required' };

    const game = await this.getGame(id);
    if (!game) return { error: 'Game not found' };

    if (game.status !== 'active') {
      return { error: 'Game is not active' };
    }

    // Verify authorized role matches authenticated user ID
    if (playerRole === 'white' && game.player_white !== user.id) {
      return { error: 'Unauthorized: You are not Player White' };
    }
    if (playerRole === 'black' && game.player_black !== user.id) {
      return { error: 'Unauthorized: You are not Player Black' };
    }

    // Validate turn
    const isPlayerTurn =
      (playerRole === 'white' && game.current_turn === 'w') ||
      (playerRole === 'black' && game.current_turn === 'b');
    if (!isPlayerTurn) {
      return { error: 'Not your turn' };
    }

    // Validate move using chess.js
    const chess = new Chess(game.current_fen);
    const move = chess.move({ from, to, promotion });
    if (!move) {
      return { error: 'Illegal move' };
    }

    let nextStatus: MultiplayerGame['status'] = 'active';
    let winner: MultiplayerGame['winner'] = null;

    if (chess.isCheckmate()) {
      nextStatus = 'completed';
      winner = game.current_turn === 'w' ? 'white' : 'black';
    } else if (chess.isDraw()) {
      nextStatus = 'completed';
      winner = 'draw';
    }

    const updatedGame: MultiplayerGame = {
      ...game,
      current_fen: chess.fen(),
      move_history: chess.history(),
      current_turn: chess.turn(),
      last_move: { from, to },
      status: nextStatus,
      winner,
      draw_offer: null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('games')
      .update({
        current_fen: updatedGame.current_fen,
        move_history: updatedGame.move_history,
        last_move: updatedGame.last_move,
        status: updatedGame.status,
        winner: updatedGame.winner,
        draw_offer: null,
        updated_at: updatedGame.updated_at,
      })
      .eq('id', game.id)
      .select()
      .single();

    if (error) {
      console.error('[GameService] Failed to persist move to Supabase:', error);
      return { error: error.message };
    }

    if (data) {
      const persisted = formatGameRow(data);
      this.broadcastEvent(game.id, 'chess_move', { game: persisted, move });
      return { game: persisted, move };
    }

    return { error: 'Failed to persist move' };
  }

  // Resign match
  public async resign(id: string, playerRole: PlayerRole): Promise<MultiplayerGame> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Database connection unavailable');

    const user = await getAuthenticatedUser();
    if (!user) throw new Error('Authentication required');

    const game = await this.getGame(id);
    if (!game) throw new Error('Game not found');

    if (playerRole === 'white' && game.player_white !== user.id) {
      throw new Error('Unauthorized');
    }
    if (playerRole === 'black' && game.player_black !== user.id) {
      throw new Error('Unauthorized');
    }

    const winner = playerRole === 'white' ? 'black' : 'white';
    const updated: MultiplayerGame = {
      ...game,
      status: 'completed',
      winner,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('games')
      .update({
        status: updated.status,
        winner: updated.winner,
        updated_at: updated.updated_at,
      })
      .eq('id', game.id)
      .select()
      .single();

    if (error) {
      console.error('[GameService] Failed to persist resign to Supabase:', error);
    }

    const result = data ? formatGameRow(data) : updated;
    this.broadcastEvent(game.id, 'game_resigned', { game: result, resignedBy: playerRole });
    return result;
  }

  // Offer draw
  public async offerDraw(id: string, playerRole: PlayerRole): Promise<MultiplayerGame> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Database connection unavailable');

    const user = await getAuthenticatedUser();
    if (!user) throw new Error('Authentication required');

    const game = await this.getGame(id);
    if (!game) throw new Error('Game not found');

    if (playerRole === 'white' && game.player_white !== user.id) {
      throw new Error('Unauthorized');
    }
    if (playerRole === 'black' && game.player_black !== user.id) {
      throw new Error('Unauthorized');
    }

    const drawOffer = playerRole === 'white' ? 'white' : 'black';
    const updated: MultiplayerGame = {
      ...game,
      draw_offer: drawOffer,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('games')
      .update({
        draw_offer: drawOffer,
        updated_at: updated.updated_at,
      })
      .eq('id', game.id)
      .select()
      .single();

    if (error) {
      console.error('[GameService] Failed to persist draw offer to Supabase:', error);
    }

    const result = data ? formatGameRow(data) : updated;
    this.broadcastEvent(game.id, 'draw_offered', { game: result, offeredBy: playerRole });
    return result;
  }

  // Accept draw
  public async acceptDraw(id: string): Promise<MultiplayerGame> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Database connection unavailable');

    const user = await getAuthenticatedUser();
    if (!user) throw new Error('Authentication required');

    const game = await this.getGame(id);
    if (!game) throw new Error('Game not found');

    if (game.player_white !== user.id && game.player_black !== user.id) {
      throw new Error('Unauthorized');
    }

    const updated: MultiplayerGame = {
      ...game,
      status: 'completed',
      winner: 'draw',
      draw_offer: null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('games')
      .update({
        status: updated.status,
        winner: updated.winner,
        draw_offer: null,
        updated_at: updated.updated_at,
      })
      .eq('id', game.id)
      .select()
      .single();

    if (error) {
      console.error('[GameService] Failed to persist accept draw to Supabase:', error);
    }

    const result = data ? formatGameRow(data) : updated;
    this.broadcastEvent(game.id, 'draw_accepted', { game: result });
    return result;
  }

  // Subscribe to real-time events on Supabase postgres_changes + broadcast + BroadcastChannel
  public subscribeToGame(
    gameId: string,
    onGameUpdate: (game: MultiplayerGame, event?: string, meta?: any) => void
  ): () => void {
    const normalizedId = normalizeGameCode(gameId);
    let cleanups: (() => void)[] = [];

    // 1. Local BroadcastChannel Listener (same device tabs)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('funnychess_realtime_' + normalizedId);
        bc.onmessage = (e) => {
          if (e.data && e.data.payload && e.data.payload.game) {
            onGameUpdate(e.data.payload.game, e.data.event, e.data.payload);
          }
        };
        cleanups.push(() => bc.close());
      } catch {}
    }

    // 2. Supabase Realtime Channel (Postgres Changes + Broadcast)
    const supabase = getSupabase();
    if (supabase) {
      try {
        const channelName = `game_room_${normalizedId}`;
        const channel = supabase.channel(channelName);

        // A. Listen for authoritative Postgres database updates
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'games',
            filter: `id=eq.${normalizedId}`,
          },
          (payload) => {
            if (payload.new) {
              const updatedGame = formatGameRow(payload.new);
              onGameUpdate(updatedGame, 'postgres_changes', payload);
            }
          }
        );

        // B. Listen for instant broadcast messages (moves, sounds, comments)
        channel.on('broadcast', { event: '*' }, (payload: any) => {
          if (payload && payload.payload && payload.payload.game) {
            onGameUpdate(payload.payload.game, payload.event, payload.payload);
          }
        });

        // C. Track status and auto-resync upon reconnection
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Re-fetch authoritative state when connection is established
            this.getGame(normalizedId).then((freshGame) => {
              if (freshGame) {
                onGameUpdate(freshGame, 'reconnect_sync');
              }
            });
          }
        });

        this.activeChannels.set(normalizedId, channel);

        cleanups.push(() => {
          this.activeChannels.delete(normalizedId);
          supabase.removeChannel(channel);
        });
      } catch (err) {
        console.error('[GameService] Realtime channel setup error:', err);
      }
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }
}

export const gameService = new GameService();

import { Chess } from 'chess.js';
import { getSupabase } from '@/lib/supabase/client';

export interface MultiplayerGame {
  id: string;
  game_type: 'friend';
  status: 'waiting' | 'active' | 'completed' | 'abandoned';
  player_white: string;
  player_white_name: string;
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

// Generate difficult-to-guess, non-sequential room code (e.g. "FC-K9M2P4")
export function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const LOCAL_STORAGE_PREFIX = 'funnychess_game_';

class GameService {
  // Store local games in localStorage for resilient zero-config multi-tab testing
  private saveLocalGame(game: MultiplayerGame) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + game.id, JSON.stringify(game));
    } catch {}
  }

  private getLocalGame(id: string): MultiplayerGame | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_PREFIX + id);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Broadcast event via BroadcastChannel (local tabs) and Supabase Realtime
  private broadcastEvent(gameId: string, event: string, payload: any) {
    // 1. Local BroadcastChannel for instant local testing between tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('funnychess_realtime_' + gameId);
        bc.postMessage({ event, payload });
        bc.close();
      } catch {}
    }

    // 2. Supabase Realtime Channel for global internet multiplayer
    const supabase = getSupabase();
    if (supabase) {
      const channel = supabase.channel('game:' + gameId);
      channel.send({
        type: 'broadcast',
        event,
        payload,
      });
    }
  }

  // Create a new multiplayer game
  public async createGame(params: {
    creatorName: string;
    creatorId: string;
    preferredColor?: 'white' | 'black' | 'random';
  }): Promise<MultiplayerGame> {
    const id = generateGameCode();
    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let isCreatorWhite = true;
    if (params.preferredColor === 'black') {
      isCreatorWhite = false;
    } else if (params.preferredColor === 'random') {
      isCreatorWhite = Math.random() > 0.5;
    }

    const now = new Date().toISOString();
    const newGame: MultiplayerGame = {
      id,
      game_type: 'friend',
      status: 'waiting',
      player_white: isCreatorWhite ? params.creatorId : '',
      player_white_name: isCreatorWhite ? params.creatorName : 'Waiting for player...',
      player_black: !isCreatorWhite ? params.creatorId : null,
      player_black_name: !isCreatorWhite ? params.creatorName : null,
      current_fen: initialFen,
      move_history: [],
      current_turn: 'w',
      last_move: null,
      winner: null,
      draw_offer: null,
      created_at: now,
      updated_at: now,
    };

    // Save locally
    this.saveLocalGame(newGame);

    // Save to Supabase if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('games').insert({
          id: newGame.id,
          game_type: 'friend',
          player_white_name: newGame.player_white_name,
          player_black_name: newGame.player_black_name,
          status: newGame.status,
          current_fen: newGame.current_fen,
          move_history: newGame.move_history,
          created_at: newGame.created_at,
          updated_at: newGame.updated_at,
        });
      } catch {}
    }

    return newGame;
  }

  // Fetch game by ID
  public async getGame(id: string): Promise<MultiplayerGame | null> {
    // Check Supabase first
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('games').select('*').eq('id', id).single();
        if (data && !error) {
          const game: MultiplayerGame = {
            id: data.id,
            game_type: 'friend',
            status: data.status || 'waiting',
            player_white: data.player_white || 'player_white',
            player_white_name: data.player_white_name || 'Player White',
            player_black: data.player_black || null,
            player_black_name: data.player_black_name || null,
            current_fen: data.current_fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            move_history: data.move_history || [],
            current_turn: new Chess(data.current_fen).turn(),
            last_move: null,
            winner: data.winner || null,
            draw_offer: null,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
          this.saveLocalGame(game);
          return game;
        }
      } catch {}
    }

    // Check Local Storage
    return this.getLocalGame(id);
  }

  // Join existing game as second player
  public async joinGame(
    id: string,
    playerName: string,
    playerId: string
  ): Promise<{ game: MultiplayerGame; role: PlayerRole } | { error: string }> {
    const game = await this.getGame(id);
    if (!game) {
      return { error: 'game_not_found' };
    }

    // Check if user is already one of the players
    if (game.player_white === playerId) {
      return { game, role: 'white' };
    }
    if (game.player_black === playerId) {
      return { game, role: 'black' };
    }

    // Check if room is already full
    if (game.player_white && game.player_black) {
      return { error: 'game_full' };
    }

    const updatedGame: MultiplayerGame = { ...game };
    let assignedRole: PlayerRole = 'black';

    if (!game.player_white) {
      updatedGame.player_white = playerId;
      updatedGame.player_white_name = playerName;
      assignedRole = 'white';
    } else {
      updatedGame.player_black = playerId;
      updatedGame.player_black_name = playerName;
      assignedRole = 'black';
    }

    // Both seats filled -> Game is now active!
    if (updatedGame.player_white && updatedGame.player_black) {
      updatedGame.status = 'active';
    }

    updatedGame.updated_at = new Date().toISOString();

    // Persist changes
    this.saveLocalGame(updatedGame);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('games')
          .update({
            player_white_name: updatedGame.player_white_name,
            player_black_name: updatedGame.player_black_name,
            status: updatedGame.status,
            updated_at: updatedGame.updated_at,
          })
          .eq('id', id);
      } catch {}
    }

    // Broadcast join event to creator
    this.broadcastEvent(id, 'player_joined', { game: updatedGame });

    return { game: updatedGame, role: assignedRole };
  }

  // Make legal move
  public async makeMove(
    id: string,
    from: string,
    to: string,
    promotion: string = 'q',
    playerRole: PlayerRole
  ): Promise<{ game: MultiplayerGame; move: any } | { error: string }> {
    const game = await this.getGame(id);
    if (!game) return { error: 'Game not found' };

    if (game.status !== 'active') {
      return { error: 'Game is not active' };
    }

    // Validate turn
    const isPlayerTurn = (playerRole === 'white' && game.current_turn === 'w') ||
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

    this.saveLocalGame(updatedGame);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('games')
          .update({
            current_fen: updatedGame.current_fen,
            move_history: updatedGame.move_history,
            status: updatedGame.status,
            winner: updatedGame.winner,
            updated_at: updatedGame.updated_at,
          })
          .eq('id', id);
      } catch {}
    }

    // Broadcast move to opponent
    this.broadcastEvent(id, 'chess_move', { game: updatedGame, move });

    return { game: updatedGame, move };
  }

  // Resign match
  public async resign(id: string, playerRole: PlayerRole): Promise<MultiplayerGame> {
    const game = (await this.getGame(id)) || this.getLocalGame(id)!;
    const winner = playerRole === 'white' ? 'black' : 'white';

    const updated: MultiplayerGame = {
      ...game,
      status: 'completed',
      winner,
      updated_at: new Date().toISOString(),
    };

    this.saveLocalGame(updated);
    this.broadcastEvent(id, 'game_resigned', { game: updated, resignedBy: playerRole });
    return updated;
  }

  // Offer draw
  public async offerDraw(id: string, playerRole: PlayerRole): Promise<MultiplayerGame> {
    const game = (await this.getGame(id)) || this.getLocalGame(id)!;
    const updated: MultiplayerGame = {
      ...game,
      draw_offer: playerRole === 'white' ? 'white' : 'black',
    };
    this.saveLocalGame(updated);
    this.broadcastEvent(id, 'draw_offered', { game: updated, offeredBy: playerRole });
    return updated;
  }

  // Accept draw
  public async acceptDraw(id: string): Promise<MultiplayerGame> {
    const game = (await this.getGame(id)) || this.getLocalGame(id)!;
    const updated: MultiplayerGame = {
      ...game,
      status: 'completed',
      winner: 'draw',
      draw_offer: null,
      updated_at: new Date().toISOString(),
    };
    this.saveLocalGame(updated);
    this.broadcastEvent(id, 'draw_accepted', { game: updated });
    return updated;
  }

  // Subscribe to real-time events on both Supabase and Local BroadcastChannel
  public subscribeToGame(
    gameId: string,
    onGameUpdate: (game: MultiplayerGame, event?: string, meta?: any) => void
  ): () => void {
    let cleanups: (() => void)[] = [];

    // 1. Local BroadcastChannel Listener
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('funnychess_realtime_' + gameId);
        bc.onmessage = (e) => {
          if (e.data && e.data.payload && e.data.payload.game) {
            onGameUpdate(e.data.payload.game, e.data.event, e.data.payload);
          }
        };
        cleanups.push(() => bc.close());
      } catch {}
    }

    // 2. Storage event listener (in case BroadcastChannel isn't cross-window in some configs)
    if (typeof window !== 'undefined') {
      const storageHandler = (e: StorageEvent) => {
        if (e.key === LOCAL_STORAGE_PREFIX + gameId && e.newValue) {
          try {
            const updatedGame = JSON.parse(e.newValue);
            onGameUpdate(updatedGame, 'storage_sync');
          } catch {}
        }
      };
      window.addEventListener('storage', storageHandler);
      cleanups.push(() => window.removeEventListener('storage', storageHandler));
    }

    // 3. Supabase Realtime Channel Listener
    const supabase = getSupabase();
    if (supabase) {
      try {
        const channel = supabase
          .channel('game:' + gameId)
          .on('broadcast', { event: '*' }, (payload: any) => {
            if (payload && payload.payload && payload.payload.game) {
              onGameUpdate(payload.payload.game, payload.event, payload.payload);
            }
          })
          .subscribe();

        cleanups.push(() => {
          supabase.removeChannel(channel);
        });
      } catch {}
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }
}

export const gameService = new GameService();

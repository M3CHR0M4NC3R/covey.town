import Player from '../../lib/Player';
import { GameMove, MusicGameState, MusicMove } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A TicTacToeGame is a Game that implements the rules of Tic Tac Toe.
 * @see https://en.wikipedia.org/wiki/Tic-tac-toe
 */
export default class MusicGame extends Game<MusicGameState, MusicMove> {
  public constructor() {
    super({
      id: Player.name,
      songName: '',
      songID: '',
      status: 'WAITING_TO_START',
    });
  }

  protected _join(player: Player): void {}

  protected _leave(player: Player): void {}

  public applyMove(move: GameMove<MusicMove>): void {}
}

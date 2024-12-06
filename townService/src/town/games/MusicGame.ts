import Player from '../../lib/Player';
import { GameMove, MusicGameState, MusicMove, PlayerID } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A TicTacToeGame is a Game that implements the rules of Tic Tac Toe.
 * @see https://en.wikipedia.org/wiki/Tic-tac-toe
 */
export default class MusicGame extends Game<MusicGameState, MusicMove> {
  private _preferredPlayer?: PlayerID;

  public constructor(priorGame?: MusicGame) {
    super({
      id: Player.name,
      songName: '',
      songID: '',
      status: 'WAITING_TO_START',
    });
    this._preferredPlayer = priorGame?.state.id;
  }

  protected _join(player: Player): void {
    this.state = {
      ...this.state,
      id: player.id,
    };
  }

  protected _leave(player: Player): void {
    if (this.state.status === 'OVER') {
      return;
    }
    this.state = {
      ...this.state,
      id: undefined,
    };
  }

  public applyMove(move: GameMove<MusicMove>): void {}
}

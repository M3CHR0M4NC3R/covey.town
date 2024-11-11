/* Stripped version of ../TicTacToeAreaController.ts */
import _ from 'lodash';
import { GameArea, GameStatus, MusicGameState } from '../../types/CoveyTownSocket';
import GameAreaController, { GameEventTypes } from './GameAreaController';
export type MusicEvents = GameEventTypes & {
  turnChanged: (isOurTurn: boolean) => void;
};

/**
 * This class is responsible for managing the state of the Tic Tac Toe game, and for sending commands to the server
 */
export default class MusicAreaController extends GameAreaController<MusicGameState, MusicEvents> {
  get isPlayer(): boolean {
    return this._model.game?.players.includes(this._townController.ourPlayer.id) || false;
  }

  /**
   * Returns the status of the game.
   * Defaults to 'WAITING_TO_START' if the game is not in progress
   */
  get status(): GameStatus {
    const status = this._model.game?.state.status;
    if (!status) {
      return 'WAITING_TO_START';
    }
    return status;
  }

  /**
   * Returns true if the game is not over
   */
  public isActive(): boolean {
    return !this.isEmpty() && this.status && this.status !== 'OVER';
  }

  /**
   * Updates the internal state of this TicTacToeAreaController to match the new model.
   *
   * Calls super._updateFrom, which updates the occupants of this game area and
   * other common properties (including this._model).
   *
   * If the board has changed, emits a 'boardChanged' event with the new board. If the board has not changed,
   *  does not emit the event.
   *
   * If the turn has changed, emits a 'turnChanged' event with true if it is our turn, and false otherwise.
   * If the turn has not changed, does not emit the event.
   */
  protected _updateFrom(newModel: GameArea<MusicGameState>): void {
    super._updateFrom(newModel);
  }
}

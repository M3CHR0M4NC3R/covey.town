/* Stripped version of ../TicTacToeAreaController.ts */
import _ from 'lodash';
import { GameArea, GameStatus, MusicGameState } from '../../types/CoveyTownSocket';
import GameAreaController, { GameEventTypes, NO_GAME_STARTABLE } from './GameAreaController';
import PlayerController from '../PlayerController';
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
   * Returns the player with the 'X' game piece, if there is one, or undefined otherwise
   */
  get x(): PlayerController | undefined {
    const currentGame = this._model.game;

    // check if game is active and x exists, if so ereturn the value from the controller
    if (currentGame && currentGame.state.id) {
      return this._townController.getPlayer(currentGame.state.id);
    }

    return undefined; //TODO
  }

  get thisPlayer(): PlayerController | undefined {
    const thisPlayer = this._model.game?.state.id;
    console.log('THISPLAYER');
    console.log(thisPlayer);
    if (thisPlayer) {
      return this.occupants.find(eachOccupant => eachOccupant.id === thisPlayer);
    }
    return undefined;
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

  /**
   * Sends a request to the server to start the game.
   *
   * If the game is not in the WAITING_TO_START state, throws an error.
   *
   * @throws an error with message NO_GAME_STARTABLE if there is no game waiting to start
   */
  public async startGame(): Promise<void> {
    const instanceID = this._instanceID;
    if (!instanceID || this._model.game?.state.status !== 'WAITING_TO_START') {
      throw new Error(NO_GAME_STARTABLE);
    }
    await this._townController.sendInteractableCommand(this.id, {
      gameID: instanceID,
      type: 'StartGame',
    });
  }
}

import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { InteractableCommand, TownEmitter } from '../../types/CoveyTownSocket';
import { createPlayerForTesting } from '../../TestUtils';
import {
  GAME_NOT_IN_PROGRESS_MESSAGE,
  INVALID_COMMAND_MESSAGE,
} from '../../lib/InvalidParametersError';
import MusicGameArea from './MusicGameArea';
import MusicGame from './MusicGame';
import * as MusicGameModule from './MusicGame';
import Player from '../../lib/Player';

class TestingGame extends MusicGame {
  public constructor() {
    super();
  }

  public applyMove(): void {}

  public endGame(winner?: string) {
    this.state = {
      ...this.state,
      status: 'OVER',
      winner,
    };
  }

  protected _join(player: Player): void {
    this.state.id = player.id;
    this._players.push(player);
  }

  protected _leave(): void {}
}
describe('MusicGameArea', () => {
  let gameArea: MusicGameArea;
  let player1: Player;
  let player2: Player;
  let interactableUpdateSpy: jest.SpyInstance;
  let game: MusicGame;

  beforeEach(() => {
    const gameConstructorSpy = jest.spyOn(MusicGameModule, 'default');
    game = new TestingGame();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Testing without using the real game class)
    gameConstructorSpy.mockReturnValue(game);

    player1 = createPlayerForTesting();
    player2 = createPlayerForTesting();
    gameArea = new MusicGameArea(
      nanoid(),
      { x: 0, y: 0, width: 100, height: 100 },
      mock<TownEmitter>(),
    );
    gameArea.add(player1);
    gameArea.add(player2);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Test requires access to protected method)
    interactableUpdateSpy = jest.spyOn(gameArea, '_emitAreaChanged');
  });

  describe('handleCommand', () => {
    describe('when given a JoinGame command', () => {
      describe('when there is no game in progress', () => {
        it('should create a new game and call _emitAreaChanged', () => {
          const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, player1);
          expect(gameID).toBeDefined();
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          expect(gameID).toEqual(game.id);
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe('when there is a game in progress', () => {
        it('should dispatch the join command to the game and call _emitAreaChanged', () => {
          const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, player1);
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
          const joinSpy = jest.spyOn(game, 'join');
          const gameID2 = gameArea.handleCommand({ type: 'JoinGame' }, player2).gameID;
          expect(joinSpy).toHaveBeenCalledWith(player2);
          expect(gameID).toEqual(gameID2);
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(2);
        });
        it('should not call _emitAreaChanged if the game throws an error', () => {
          gameArea.handleCommand({ type: 'JoinGame' }, player1);
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          interactableUpdateSpy.mockClear();

          const joinSpy = jest.spyOn(game, 'join').mockImplementationOnce(() => {
            throw new Error('Test Error');
          });
          expect(() => gameArea.handleCommand({ type: 'JoinGame' }, player2)).toThrowError(
            'Test Error',
          );
          expect(joinSpy).toHaveBeenCalledWith(player2);
          expect(interactableUpdateSpy).not.toHaveBeenCalled();
        });
      });
    });
    describe('when given a GameMove command', () => {
      it('should throw an error when there is no game in progress', () => {
        expect(() =>
          gameArea.handleCommand(
            { type: 'GameMove', move: { col: 0, row: 0, gamePiece: 'X' }, gameID: nanoid() },
            player1,
          ),
        ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      });
    });
    describe('when given an invalid command', () => {
      it('should throw an error', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const command: InteractableCommand = { type: 'InvalidCommand' as any };
        expect(() => gameArea.handleCommand(command, player1)).toThrow(INVALID_COMMAND_MESSAGE);
      });
    });
  });
});

import assert from 'assert';
import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { GameArea, GameStatus, MusicGameState } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import GameAreaController, { NO_GAME_IN_PROGRESS_ERROR } from './GameAreaController';
import MusicAreaController from './MusicAreaController';

//test for isActive()
/* expect false when the game is empty, the status doesn't exist, or when status
 * is OVER
 */

//test for get thisPlayer()

//test startGame()
/* expect NO_GAME_STARTABLE when
instanceID is missing the status is not WAITING_TO_START then check the status
as STARTED to verify the command made it
 */
describe('[T1] TicTacToeAreaController', () => {
  const ourPlayer = new PlayerController(nanoid(), nanoid(), {
    x: 0,
    y: 0,
    moving: false,
    rotation: 'front',
  });
  const otherPlayers = [
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
    new PlayerController(nanoid(), nanoid(), { x: 0, y: 0, moving: false, rotation: 'front' }),
  ];

  const mockTownController = mock<TownController>();
  Object.defineProperty(mockTownController, 'ourPlayer', {
    get: () => ourPlayer,
  });
  Object.defineProperty(mockTownController, 'players', {
    get: () => [ourPlayer, ...otherPlayers],
  });
  mockTownController.getPlayer.mockImplementation(playerID => {
    const p = mockTownController.players.find(player => player.id === playerID);
    assert(p);
    return p;
  });

  function MusicAreaControllerWithProp({
    _id,
    x,
    undefinedGame,
    status,
  }: {
    _id?: string;
    x?: string;
    undefinedGame?: boolean;
    status?: GameStatus;
  }) {
    const id = _id || nanoid();
    const players = [];
    if (x) players.push(x);
    const ret = new MusicAreaController(
      id,
      {
        id,
        occupants: players,
        type: 'MusicArea',
        game: undefinedGame
          ? undefined
          : {
              id,
              players: players,
              state: {
                id: x,
                songName: undefined,
                songID: undefined,
                status: 'WAITING_TO_START',
              },
            },
        history: [],
      },
      mockTownController,
    );
    if (players) {
      ret.occupants = players
        .map(eachID => mockTownController.players.find(eachPlayer => eachPlayer.id === eachID))
        .filter(eachPlayer => eachPlayer) as PlayerController[];
    }
    return ret;
  }
  //test for get isPlayer()
  //run the test on all three players, only one should be true
  describe('[T1.1]', () => {
    describe('isPlayer', () => {
      it('should return true when the correct player is present', () => {
        const controller = MusicAreaControllerWithProp({
          status: 'IN_PROGRESS',
          x: ourPlayer.id,
        });
        expect(controller.isPlayer).toBe(true);
      });
      it('should return false when there is no player', () => {
        const controller = MusicAreaControllerWithProp({
          status: 'IN_PROGRESS',
          x: undefined,
        });
        expect(controller.isPlayer).toBe(false);
      });
      //test for get status()
      it('should return false when there is a different player connected', () => {
        const controller1 = MusicAreaControllerWithProp({
          status: 'IN_PROGRESS',
          x: otherPlayers[0].id,
        });
        const controller2 = MusicAreaControllerWithProp({
          status: 'IN_PROGRESS',
          x: otherPlayers[1].id,
        });
        expect(controller1.isPlayer).toBe(false);
        expect(controller2.isPlayer).toBe(false);
      });
    });
    describe('status', () => {
      it("should return 'WAITING_TO_START' when status is as such, or unknown", () => {
        const controller1 = MusicAreaControllerWithProp({
          status: 'WAITING_TO_START',
          x: ourPlayer.id,
        });
        expect(controller1.status).toBe('WAITING_TO_START');
        const controller2 = MusicAreaControllerWithProp({
          status: undefined,
          x: ourPlayer.id,
        });
        expect(controller2.status).toBe('WAITING_TO_START');
      });
    });
  });
});

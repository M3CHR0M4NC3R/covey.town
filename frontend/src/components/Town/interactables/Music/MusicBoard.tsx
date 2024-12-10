import { chakra, Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MusicAreaController from '../../../../classes/interactable/MusicAreaController';

export type MusicGameProps = {
  gameAreaController: MusicAreaController;
};

/**
 * A component that will render the TicTacToe board, styled
 */
const StyledMusicBoard = chakra(Container, {
  baseStyle: {
    display: 'flex',
    width: '400px',
    height: '400px',
    padding: '5px',
    flexWrap: 'wrap',
  },
});

/**
 * A component that renders the TicTacToe board
 *
 * Renders the TicTacToe board as a "StyledTicTacToeBoard", which consists of 9 "StyledTicTacToeSquare"s
 * (one for each cell in the board, starting from the top left and going left to right, top to bottom).
 * Each StyledTicTacToeSquare has an aria-label property that describes the cell's position in the board,
 * formatted as `Cell ${rowIndex},${colIndex}`.
 *
 * The board is re-rendered whenever the board changes, and each cell is re-rendered whenever the value
 * of that cell changes.
 *
 * If the current player is in the game, then each StyledTicTacToeSquare is clickable, and clicking
 * on it will make a move in that cell. If there is an error making the move, then a toast will be
 * displayed with the error message as the description of the toast. If it is not the current player's
 * turn, then the StyledTicTacToeSquare will be disabled.
 *
 * @param gameAreaController the controller for the TicTacToe game
 */
export default function MusicBoard({ gameAreaController }: MusicGameProps): JSX.Element {
  const [board, setBoard] = useState<string>(gameAreaController.id);
  useEffect(() => {
    gameAreaController.addListener('boardChanged', setBoard);
    return () => {
      gameAreaController.removeListener('boardChanged', setBoard);
    };
  }, [gameAreaController]);
  return (
    <StyledMusicBoard aria-label='Music Board'>
      <>{board}</>
    </StyledMusicBoard>
  );
}

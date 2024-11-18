import { Button, Container, List, ListItem, useToast } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import TicTacToeAreaController from '../../../../classes/interactable/TicTacToeAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameStatus, InteractableID } from '../../../../types/CoveyTownSocket';
import * as Tone from 'tone'; // Import Tone.js
import { GameObjects } from 'phaser';
import Sequencer from './StepSequencer';

export default function MusicArea({
  interactableID,
}: {
  interactableID: InteractableID;
}): JSX.Element {
  // UI Elements
  return (
    <Container>
      <Sequencer interactableID={interactableID} />
    </Container>
  );
}

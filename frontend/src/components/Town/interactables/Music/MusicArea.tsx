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
import BrowseSongs from './BrowseSongs';

export interface Song {
  title: string;
  creator: string;
  description: string;
  likes: number;
  notes: { note: string; playNote: boolean }[][];
}

export default function MusicArea({
  interactableID,
}: {
  interactableID: InteractableID;
}): JSX.Element {
  const [route, setRoute] = useState('lookup');
  const [currSong, setCurrSong] = useState<Song | null>(null); // Song info that will be passed to StepSequencer if selected by user

  

  // UI Elements
  return (
    <Container id='musicSwitch' style={{width: '100%', padding: 'unset', margin: 'unset'}}>
      {(route == 'lookup') && <BrowseSongs interactableID={interactableID} route={route} setRoute={setRoute} setCurrSong={setCurrSong} currSong={currSong}/>}
      {(route == 'creation') && <Sequencer interactableID={interactableID} route={route} setRoute={setRoute} setCurrSong={setCurrSong} currSong={currSong}/>}
      {/* <button id="toCreation" onClick={() => {setRoute('creation')}}>Click to go to Creation</button>
      <button id="toLookup" onClick={() => {setRoute('lookup')}}>Click to go to Lookup</button> */}
    </Container>
  );
}

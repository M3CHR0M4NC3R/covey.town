import { Button, Container, List, ListItem, useToast } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import TicTacToeAreaController from '../../../../classes/interactable/TicTacToeAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameStatus, InteractableID } from '../../../../types/CoveyTownSocket';
import * as Tone from 'tone'; // Import Tone.js
import { GameObjects } from 'phaser';

export default function MusicArea({
  interactableID,
}: {
  interactableID: InteractableID;
}): JSX.Element {
  // UI Elements
  const mixerRef = useRef<HTMLDivElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);

  const [key, setKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  let beat = 0;

  //Creates all the Synth Players 4 normal; 1 Drum; 1 Cymbol
  console.log('CREATING NEW SYNiTHS?');
  const synthPlayerArray: any[] = [];
  for (let i = 0; i < 4; i++) {
    const synth = new Tone.Synth({
      oscillator: {
        type: 'square8',
      },
    }).toDestination();
    synthPlayerArray.push(synth);
  }
  const cymbol = new Tone.MetalSynth({}).toDestination();
  synthPlayerArray.push(cymbol);
  const drum = new Tone.NoiseSynth().toDestination();
  synthPlayerArray.push(drum);

  //Creating the Board (2D array) each row has the same instrument and a playNote property
  const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Cymbol', 'Drum'];
  const board: { note: string; playNote: boolean }[][] = [];
  for (const note of notes) {
    const row = [];
    console.log('NOTE TEST: ' + note);
    for (let i = 0; i < 16; i++) {
      row.push({
        note: note,
        playNote: false,
      });
    }
    board.push(row);
  }

  // configLoop continually looks through the board going checking the beat index in each row
  // If playnote is true the note should play
  // The beats per minute is 120, using 16n as the timescale
  const configLoop = () => {
    const repeat = (time: number) => {
      board.forEach((row, index) => {
        /* console.log(
          ' Beat: ' +
            beat +
            ' index: ' +
            index +
            ' SYNTH: ' +
            synthObjArray[index] +
            ' SoundNOTE: ' +
            row[beat].note +
            ' SoundStatus: ' +
            row[beat].playNote,
        ); */
        const synth = synthPlayerArray[index];
        const sound = row[beat];
        if (sound.playNote) {
          //console.log('Playing Sound: ' + sound.note);
          if (sound.note == 'Cymbol' || sound.note == 'Drum') {
            synth.triggerAttackRelease('16n');
          } else {
            synth.triggerAttackRelease(sound.note, '16n', time);
          }
        }
      });
      beat = (beat + 1) % 16;
    };
    Tone.Transport.bpm.value = 120;
    Tone.Transport.scheduleRepeat(repeat, '16n');
  };

  //On note click it should flip the playNote status to either disable the sound or enable it
  //The button should visually change indicating the status via the active class
  const handleNoteClick = (clickedRowIndex: number, clickedNoteIndex: number, e: any) => {
    board[clickedRowIndex][clickedNoteIndex].playNote =
      !board[clickedRowIndex][clickedNoteIndex].playNote;
    e.target.classList.toggle('active');
  };

  //This creates the actaully array of 6 x 16 notes along with what sound they play
  const makeInteractableMixer = () => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    board.forEach((row, rowIndex) => {
      const mixerRow = document.createElement('div');
      mixerRow.className = 'mixer-row';
      mixerRow.style.display = 'flex';

      row.forEach((note, noteIndex) => {
        const button = document.createElement('button');
        button.className = 'note';
        button.textContent = `${note.note}\n${noteIndex + 1}`;
        button.addEventListener('click', e => handleNoteClick(rowIndex, noteIndex, e));
        mixerRow.appendChild(button);
      });
      mixer.appendChild(mixerRow);
    });
  };

  //Initializes the play button
  //if the element cannot be found return
  //If the element is found attach a listner to check for a click
  //On click start the audio transport, set started to true, and flip the current playing status
  const configPlayButton = () => {
    if (!playButton.current) return;

    playButton.current.addEventListener('click', async () => {
      if (!started) {
        //console.log('Before await');
        await Tone.start();
        //console.log('Await Successful');
        Tone.getDestination().volume.rampTo(-10, 0.001);
        configLoop();
        setStarted(true);
        //console.log('STARTED !LEAVING! LISTENER: ' + started);
      }

      setPlaying(prevPlaying => !prevPlaying);
    });
  };

  //Upon activation create the mixerboard and ready the Tone.js loop
  useEffect(() => {
    //console.log('REMOUNT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    makeInteractableMixer();
    configPlayButton();
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setKey(key + 1); // Update key to force remount
    };
  }, [key]);

  useEffect(() => {
    if (playing) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      beat = 0;
    }
  }, [playing]);

  /*_______________________________________________________________________*/

  return (
    <Container>
      <div
        ref={mixerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '10px',
        }}
      />
      <button ref={playButton}>{playing ? 'STOP' : 'PLAY'}</button>
      <style>
        {`
          .note {
            width: 80px;
            height: 40px;
            background-color: lightgray;
            border: 1px solid #ccc;
            cursor: pointer;
            font-size: 12px;
          }
          .note.active {
            background-color: lightgreen;
          }
        `}
      </style>
    </Container>
  );
}

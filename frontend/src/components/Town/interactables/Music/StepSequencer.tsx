import { Button, Container, List, ListItem, useToast } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import TicTacToeAreaController from '../../../../classes/interactable/TicTacToeAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameStatus, InteractableID } from '../../../../types/CoveyTownSocket';
import * as Tone from 'tone'; // Import Tone.js
import { GameObjects } from 'phaser';
import { Song } from './MusicArea';

export default function MusicArea({
  interactableID,
  route,
  setRoute,
  currSong,
  setCurrSong,
}: {
  interactableID: InteractableID;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  currSong: Song | null;
  setCurrSong: React.Dispatch<React.SetStateAction<Song | null>>;
}): JSX.Element {
  // UI Elements
  const mixerRef = useRef<HTMLDivElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const synthPlayerArray = useRef<(Tone.Synth | Tone.MetalSynth | Tone.NoiseSynth)[]>([]);

  const [key, setKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');
  let beat = 0;

  //Creates all the Synth Players 4 normal; 1 Drum; 1 Cymbol
  //Only want to create the players once to prevent the audio break after multiple starts and stops
  useEffect(() => {
    if (synthPlayerArray.current.length === 0) {
      for (let i = 0; i < 4; i++) {
        const synth = new Tone.Synth({
          oscillator: {
            type: 'square8',
          },
        }).toDestination();
        synthPlayerArray.current.push(synth);
      }
      const cymbol = new Tone.MetalSynth({}).toDestination();
      synthPlayerArray.current.push(cymbol);
      const drum = new Tone.NoiseSynth().toDestination();
      synthPlayerArray.current.push(drum);
    }
  }, []);

  //Creating the Board (2D array) each row has the same instrument and a playNote property
  const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Cymbol', 'Drum'];
  const board: { note: string; playNote: boolean }[][] = [];
  for (const note of notes) {
    const row = [];
    console.log('NOTE TEST: ' + note);
    if (currSong !== null) {
      console.log(currSong);
    }
    for (let i = 0; i < 16; i++) {
      row.push({
        note: note,
        playNote: false,
      });
    }
    board.push(row);
    console.log(board);
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
        const synth = synthPlayerArray.current[index];
        const sound = row[beat];
        if (sound.playNote) {
          console.log('Playing Sound: ' + sound.note);
          if (sound.note == 'Cymbol' || sound.note == 'Drum') {
            synth.triggerAttackRelease('16n', time);
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
    console.log('MAKE INTERACTABLE MIUXER');
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

  /* Whenever the user presses a button, pause the game and clear the error log (error) if it exists */
  const coveyTownController = useTownController();
  const handleKeyDown = (event: { key: string; }) => {
    if (error !== '') {
      setError('');
    }
    if (event.key === 'Enter') {
      console.log('TODO: Search the database for the title!')
    } else {
        coveyTownController.pause();
    }
  }

  /* Whenever the user releases a button, unpause the game*/
  const handleKeyUp = (event: { key: string; }) => {
    // TODO: This is broken, there's some logic here that's wrong (compare it to the basement dining table below and the code at /components/Town/interactables/NewConversationModal.tsx)
    // Over there the game pauses when they're typing (that's done with the handleKeyDown event above, but the unpause doesn't feel natural)
    coveyTownController.unPause();
  }

  /* TODO: Before changing scenes this method will be called to see if the user forgot to save their work. If they forgot then prompt them to save */
  /* Maybe they can press again to just continue without saving? */
  const checkIfEditsWereMade = () => {
    if (false) { // Compare the arrays currSong (from lookup) and board. If they are not the same then prompt the user to save so they dont lose their work
      setError('You have unsaved changes. Would you like to save before leaving?');
      // Check if changes were made by comparing the arrays currSong and board. If they are not the same then prompt the user to save
      // so they dont lose their work
    } else {
      setRoute('lookup');
    }
  }

  // TODO: Save the song to the database (pass it the board object)
  const saveSong = () => {
    // Save the song to the database

    // Update the user
    setError('Song Saved!');
  }

  return (
    <Container>
      <div id="lookupContainer" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0.5em 0 0.5em 0', borderTop: 'solid', borderBottom: 'solid', marginBottom: '1.0em'}}>
            <div style={{display: 'flex', flexDirection: 'column', width: '40%'}}>
              <h3 id="song" style={{width: "70%"}}>Click on notes to make a song: </h3>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.25em'}}>
              <div>
                <label htmlFor="title"><b>Title: </b></label>
                <input type="text" name="title" id="title" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} style={{backgroundColor: '#bababa', minHeight: '100%'}}/>
              </div>
              <div>
                <label htmlFor="description"><b>Description: </b></label>
                <input type="text" name="description" id="description" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} style={{backgroundColor: '#bababa', minHeight: '100%'}}/>
              </div>
            </div>
        </div>
        {(error !== '') && <div id="error" style={{marginBottom: '1em', justifySelf: 'center'}}>{error}</div>}
      <div
        ref={mixerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '10px',
        }}
      />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '1fr', gridColumnGap: '0px', gridRowGap: '0px',  marginTop: '10px', height: '100%'}}>
        <button id="saveBtn" onClick={() => {saveSong();}} style={{padding: 'revert', backgroundColor: '#01c6d4'}}>Save!</button>
        <button ref={playButton} style={{padding: 'revert', backgroundColor: '#1ad401'}}>{playing ? 'STOP' : 'PLAY'}</button>
        <button id="toLookup" onClick={() => {checkIfEditsWereMade();}} style={{padding: 'revert', backgroundColor: '#d4a301'}}>Browse Other Songs</button>
      </div>
      <style>
        {`
          .note {
            width: 80px;
            height: 60px;
            background-color: lightgray;
            outline: 1px solid #ccc;
            cursor: pointer;
            font-size: 65%;
            word-break: break-word;
          }
          .note.active {
            background-color: lightgreen;
          }
        `}
      </style>
    </Container>
  );
}

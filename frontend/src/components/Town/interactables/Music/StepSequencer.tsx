import { Container } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import useTownController from '../../../../hooks/useTownController';
import { InteractableID } from '../../../../types/CoveyTownSocket';
import * as Tone from 'tone'; // Import Tone.js
import { Song } from './MusicArea';
import { useInteractableAreaController } from '../../../../classes/TownController';
import MusicAreaController from '../../../../classes/interactable/MusicAreaController';

export default function MusicArea({
  interactableID,
  // route,
  setCurrSong,
  setRoute,
  currSong,
  playerName,
}: {
  interactableID: InteractableID;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  currSong: Song | null;
  setCurrSong: React.Dispatch<React.SetStateAction<Song | null>>;
  playerName: string;
}): JSX.Element {
  // UI Elements
  const mixerRef = useRef<HTMLDivElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const synthPlayerArray = useRef<(Tone.Synth | Tone.MetalSynth | Tone.NoiseSynth)[]>([]);
  const gameAreaController = useInteractableAreaController<MusicAreaController>(interactableID);

  const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Cymbol', 'Drum'];
  const board: { note: string; playNote: boolean }[][] = [];

  const [key, setKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');
  const [boardDup, setBoardDup] = useState(board);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [originalBoard, setOriginalBoard] = useState<
    { note: string; playNote: boolean }[][] | null
  >(null);
  const coveyTownController = useTownController();
  let beat = 0;

  // Needed for post requests.
  const customHeaders = {
    'Content-Type': 'application/json',
  };

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
  for (const note of notes) {
    const row = [];
    console.log('NOTE TEST: ' + note);
    // If the old song is null, create a new board
    if (currSong === null) {
      for (let i = 0; i < 16; i++) {
        row.push({
          note: note,
          playNote: false,
        });
      }
      board.push(row);
    } else {
      // If the old song exists then load the data from the song into the board
      board.length = 0; // Clear board (only way to clear a const array)
      for (let i = 0; i < currSong.notes.length; i++) {
        let newRow = [];
        newRow = currSong.notes[i];
        board.push(newRow);
      }
    }
  }

  /* Load board into boardDup so React can update things easier */
  useEffect(() => {
    if (currSong == null) {
      setBoardDup(board);
    } else {
      setBoardDup(currSong.notes);
      // Go through every element in currSong.notes and if it is true then set the corresponding element in board to true
      for (let i = 0; i < currSong.notes.length; i++) {
        for (let j = 0; j < currSong.notes[i].length; j++) {
          if (currSong.notes[i][j].playNote === true) {
            // Get this note and set the class to be "active"
            const note = document.getElementById(`note-${i}-${j}`);
            note?.classList.toggle('active');
          }
        }
      }
    }
    // Auto fill in the title and description if available.
    (document.getElementById('title') as HTMLInputElement).value = currSong?.title || '';
    (document.getElementById('description') as HTMLInputElement).value =
      currSong?.description || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardDup]);

  /* Create a board object that can be referenced for changes incase the user forgets to save their work */
  useEffect(() => {
    setOriginalBoard(JSON.parse(JSON.stringify(board)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Setup gameAreaController on load */
  useEffect(() => {
    if (!gameAreaController) return;
    // setPlayers({
    //   X: gameAreaController.x?.userName || '(No player yet!)',
    //   O: gameAreaController.o?.userName || '(No player yet!)',
    // });
  }, [gameAreaController, coveyTownController.ourPlayer.id]);

  const cleanBoard = () => {
    for (const note of boardDup) {
      for (let i = 0; i < 16; i++) {
        if (note[i].playNote === true) {
          // Clean board
          note[i].playNote = false;
          board.length = 0; // Clear board (only way to clear a const array)
        }
      }
    }
    board.length = 0; // Clear board (only way to clear a const array)
  };

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
            // Was synth.triggerAttackRelease('16n', time); but ran into this error in console.log() when spamming
            /* "Events scheduled inside of scheduled callbacks should use the passed in scheduling time. See https://github.com/Tonejs/Tone.js/wiki/Accurate-Timing" */
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
      mixerRow.className = `mixer-row-${rowIndex}`;
      mixerRow.style.display = 'flex';

      row.forEach((note, noteIndex) => {
        const button = document.createElement('button');
        button.className = 'note';
        button.id = `note-${rowIndex}-${noteIndex}`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (playing) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      beat = 0;
    }
  }, [playing]);

  /*_______________________________________________________________________*/

  /* Whenever the user presses a button, pause the game and clear the error log (error) if it exists */
  const handleKeyDown = (event: { key: string }) => {
    if (error !== '') {
      setError('');
    }
    if (event.key !== 'Enter') {
      coveyTownController.pause();
    }
  };

  /* Whenever the user releases a button, unpause the game*/
  const handleKeyUp = () => {
    coveyTownController.unPause();
  };

  // Helper function to compare arrays
  // function arraysEqual(a: any, b: any) {
  //   if (a.length !== b.length) {
  //     return false;
  //   }

  //   for (let i = 0; i < a.length; ++i) {
  //     for (let j = 0; j < a[i].length; ++j) {
  //       if (a[i][j].note !== b[i][j].note || a[i][j].playNote !== b[i][j].playNote) {
  //         return false;
  //       }
  //     }
  //   }

  //   return true;
  // }

  /* Maybe they can press again to just continue without saving? */
  const checkIfEditsWereMade = () => {
    // if (arraysEqual(originalBoard, board) === false) {
    //   // Compare the arrays currSong (from lookup) and board. If they are not the same then prompt the user to save so they dont lose their work
    //   setError('You have unsaved changes. Would you like to save before leaving?');
    //   // Check if changes were made by comparing the arrays currSong and board. If they are not the same then prompt the user to save
    //   // so they dont lose their work
    // } else {
    //   // Cleanup and transition
    setCurrSong(null);
    cleanBoard();
    (document.getElementById('title') as HTMLInputElement).value = '';
    (document.getElementById('description') as HTMLInputElement).value = '';
    setRoute('lookup');
    // }
  };

  const saveSong = () => {
    // Check if the user has access to edit this song
    const username = playerName;

    // Check if the user has already saved the song
    const titleValue = (document.getElementById('title') as HTMLInputElement).value;
    const descriptionValue = (document.getElementById('description') as HTMLInputElement).value;
    if (titleValue === '') {
      setError('Please enter a title!');
      return;
    }

    // Update the database
    const thisSong = {
      title: titleValue,
      creator: playerName,
      description: descriptionValue,
      likes: 0,
      likedUsers: [],
      notes: boardDup,
    };
    // Save the song to the database
    fetch(`http://localhost:4000/add-song`, {
      method: 'POST',
      headers: customHeaders,
      body: JSON.stringify(thisSong),
    })
      .then(response => response.json())
      .then(data => {
        // Update the user
        setError(data.status);
      })
      .catch(() => {
        setError('Error saving song!');
      });

    // Update the user
    setError('Song Saved!');
  };

  const likeSong = () => {
    const titleValue = (document.getElementById('title') as HTMLInputElement).value;
    const descriptionValue = (document.getElementById('description') as HTMLInputElement).value;
    // Check if the user has already liked the song
    const username = playerName;

    // Update the database, checks for already likes done in backend.
    const thisSong = {
      title: titleValue,
      creator: playerName,
      description: descriptionValue,
      likes: 0,
      likedUsers: [],
      notes: boardDup,
      thisPlayer: username,
    };
    // Save the song to the database
    fetch(`http://localhost:4000/like-song`, {
      method: 'POST',
      headers: customHeaders,
      body: JSON.stringify(thisSong),
    })
      .then(response => response.json())
      .then(data => {
        // Update the user
        setError(data.status);
      })
      .catch(() => {
        setError('Error liking song!');
      });

    // Update the user
    setError('Song Liked!');
  };

  return (
    <Container>
      <div
        id='lookupContainer'
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '0.5em 0 0.5em 0',
          borderTop: 'solid',
          borderBottom: 'solid',
          marginBottom: '1.0em',
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
          <h3 id='song' style={{ width: '70%' }}>
            Click on notes to make a song:{' '}
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25em' }}>
          <div>
            <label htmlFor='title'>
              <b>Title: </b>
            </label>
            <input
              type='text'
              name='title'
              id='title'
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              style={{ backgroundColor: '#bababa', minHeight: '100%' }}
            />
          </div>
          <div>
            <label htmlFor='description'>
              <b>Description: </b>
            </label>
            <input
              type='text'
              name='description'
              id='description'
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              style={{ backgroundColor: '#bababa', minHeight: '100%' }}
            />
          </div>
        </div>
      </div>
      {error !== '' && (
        <div id='error' style={{ marginBottom: '1em', justifySelf: 'center' }}>
          {error}
        </div>
      )}
      <div
        ref={mixerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '10px',
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: '1fr',
          gridColumnGap: '0px',
          gridRowGap: '0px',
          marginTop: '10px',
          height: '100%',
        }}>
        <button
          id='saveBtn'
          onClick={() => {
            saveSong();
          }}
          style={{ padding: 'revert', backgroundColor: '#01c6d4' }}>
          Save!
        </button>
        <button ref={playButton} style={{ padding: 'revert', backgroundColor: '#1ad401' }}>
          {playing ? 'STOP' : 'PLAY'}
        </button>
        <button
          id='toLookup'
          onClick={() => {
            checkIfEditsWereMade();
          }}
          style={{ padding: 'revert', backgroundColor: '#d4a301' }}>
          Browse Other Songs
        </button>
        <button
          id='likeBtn'
          onClick={() => {
            likeSong();
          }}
          style={{ padding: 'revert', backgroundColor: '#e4e176' }}>
          LIKE
        </button>
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

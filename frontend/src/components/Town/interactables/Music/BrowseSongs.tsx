import { Container, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { InteractableID } from '../../../../types/CoveyTownSocket';
import useTownController from '../../../../hooks/useTownController';
import { Song } from './MusicArea';
import MusicAreaController from '../../../../classes/interactable/MusicAreaController';
import { useInteractableAreaController } from '../../../../classes/TownController';

export default function MusicArea({
  setRoute,
  setCurrSong,
  interactableID,
}: {
  interactableID: InteractableID;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  currSong: Song | null;
  setCurrSong: React.Dispatch<React.SetStateAction<Song | null>>;
  playerName: string;
}): JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const [tempSongs, setTempSongs] = useState<Song[]>([]); // A backup to store songs for data manipulation to prevent multiple database calls
  const toast = useToast();
  const coveyTownController = useTownController();
  const gameAreaController = useInteractableAreaController<MusicAreaController>(interactableID);

  // Load songs from mongoDB to the songs state
  useEffect(() => {
    console.log('Fetching Mongo DB!');
    fetch(`http://localhost:4000/all-songs`)
      .then(response => response.json())
      .then(data => {
        setSongs(data);
        setTempSongs(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Filter the main songs array based on the search input
  const filterSongs = (search: string) => {
    if (search === '') {
      setSongs(tempSongs);
    } else {
      const filteredSongs = songs.filter(song => {
        return (
          song.title.toLowerCase().includes(search.toLowerCase()) ||
          song.creator.toLowerCase().includes(search.toLowerCase())
        );
      });
      setSongs(filteredSongs);
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      filterSongs(document.getElementById('song').value);
    } else {
      coveyTownController.pause();
    }
  };

  const handleKeyUp = () => {
    // TODO: This is broken, there's some logic here that's wrong (compare it to the basement dining table below and the code at /components/Town/interactables/NewConversationModal.tsx)
    // Over there the game pauses when they're typing (that's done with the handleKeyDown event above, but the unpause doesn't feel natural)
    coveyTownController.unPause();
  };

  /* If we have more than 100 characters saved then only get the first 100 characters and add an elipses */
  const shortenInput = (input: string) => {
    let output = '';
    if (input.length > 100) {
      output = input.substring(0, 100) + ' ...';
    } else {
      output = input;
    }
    return output;
  };

  return (
    <Container
      id='containerBrowseSongs'
      style={{ width: '100%', margin: 'unset', padding: 'unset' }}>
      <div
        id='lookupContainer'
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '0.5em 0 0.5em 0',
          borderTop: 'solid',
          borderBottom: 'solid',
        }}>
        <div id='lookupSongContainer'>
          <label htmlFor='song'>Lookup Song: </label>
          <input
            type='text'
            name='song'
            id='song'
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{ backgroundColor: '#bababa', minHeight: '100%' }}
          />
        </div>
        <div className='topBtnContainer' style={{ display: 'flex', flexDirection: 'row' }}>
          <button
            id='searchBtn'
            type='submit'
            typeof='name'
            onClick={() => {
              filterSongs(document.getElementById('song').value);
            }}
            style={{ padding: 'revert', backgroundColor: '#bcebb6' }}>
            Search!
          </button>
          <button
            id='toCreation'
            onClick={() => {
              setRoute('creation');
            }}
            style={{ padding: 'revert', backgroundColor: '#d4a301' }}>
            Create Song!
          </button>
        </div>
      </div>
      <div id='songsContainer' style={{ display: 'flex', flexDirection: 'column' }}>
        {songs?.map((song, index) => (
          <div
            key={index}
            id={`songContainer-${index}`}
            style={{
              borderBottom: '1px solid grey',
              padding: '0.5em 0 0.5em 0',
              display: 'grid',
              gridTemplateColumns: '0.4fr 1.3fr 1.3fr',
              gridTemplateRows: '1fr 1fr',
              gap: '0.5em 0.5em',
              gridTemplateAreas: `'btnView title creator' 'btnView desc likes'`,
            }}>
            <button
              id={`btnView-${index}`}
              className='btnView'
              onClick={() => {
                setCurrSong(song);
                setRoute('creation');
              }}
              style={{
                backgroundColor: '#d4a301',
                padding: '0.5em',
                gridArea: `btnView`,
                height: 'fit-content',
                width: 'fit-content',
                justifySelf: 'center',
                alignSelf: 'center',
              }}>
              VIEW
            </button>
            <h3 id='title' className='title' style={{ height: '50%', gridArea: 'title' }}>
              <b>Title:</b> {shortenInput(song.title)}
            </h3>
            <p id='desc' className='desc' style={{ height: '50%', gridArea: 'desc' }}>
              <b>Description:</b> {shortenInput(song.description)}
            </p>
            <h3 id='creator' className='creator' style={{ height: '50%', gridArea: 'creator' }}>
              <b>Creator:</b> {shortenInput(song.creator)}
            </h3>
            <p id='likes' className='likes' style={{ height: '50%', gridArea: 'likes' }}>
              <b>Likes:</b> {song.likes}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}

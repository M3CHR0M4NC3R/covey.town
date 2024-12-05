import { Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { InteractableID } from '../../../../types/CoveyTownSocket';
import useTownController from '../../../../hooks/useTownController';
import { Song } from './MusicArea';
import * as fs from 'fs/promises';

export default function MusicArea({
  setRoute,
  setCurrSong,
}: {
  interactableID: InteractableID;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  currSong: Song | null;
  setCurrSong: React.Dispatch<React.SetStateAction<Song | null>>;
}): JSX.Element {
  const [songs, setSongs] = useState<Song[]>([]);
  const coveyTownController = useTownController();

  /* TODO: At load this should fetch info from the backend, and load setSongs for now it's just a temporary array of fake data */
  useEffect(() => {
    /* TODO: Make database call to fetch the songs and load it into setSongs instead of the fakeSongs useEffect below*/
  }, []);

  useEffect(() => {

    // Load setSongs
    loadInitialsongs();
  }, []);

  const loadInitialsongs = () => {
    const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Cymbol', 'Drum'];
    //TODO START OF FAKENOTES
    //LINES BETWEEN HERE AND END SHOULD BE DELETED AFTER TESTING
    const fakeNotes0 = [
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
      { note: notes[0], playNote: false },
    ];
    const fakeNotes1 = [
      { note: notes[1], playNote: true },
      { note: notes[1], playNote: true },
      { note: notes[1], playNote: true },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
      { note: notes[1], playNote: false },
    ];
    const fakeNotes2 = [
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
      { note: notes[2], playNote: false },
    ];
    const fakeNotes3 = [
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
      { note: notes[3], playNote: false },
    ];
    const fakeNotes4 = [
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
      { note: notes[4], playNote: false },
    ];
    const fakeNotes5 = [
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
      { note: notes[5], playNote: false },
    ];
    const fakeNotes6 = [
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
      { note: notes[5], playNote: true },
    ];
    // TODO END OF FAKENOTES

    let fakeSong0: Song = {
    //let fakeSong0: Song,fakeSong1,fakeSong2,fakeSong3,fakeSong4,fakeSong5 = {
      title: 'blank',
      creator: 'blank',
      description: 'blank',
      likes: 0,
      likedUsers: ['blank'],
      notes:[fakeNotes0,fakeNotes0,fakeNotes0,fakeNotes0,fakeNotes0,fakeNotes0],
    };
    //fakeSong0 = loadSongFile("fakeSong0")
    //songs shall be loaded/saved from the same string as their title
    //or have the loader function open each file and check the title field
    const fakeSongPath = './Music/fakeSong0';
    //load song from that path into fakeSong0
    fs.readFile(fakeSongPath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading the file:', err);
          return;
      }
      //parse here
      const lines = data.split('\n').map(line => line.trim());
      fakeSong0.title = lines[0];
      fakeSong0.creator = lines[1];
      fakeSong0.description = lines[2];
      fakeSong0.likes = parseInt(lines[3]);
      fakeSong0.likedUsers = lines[4].split(',');
      //this loads an array of splitting the lines, parsed as booleans
      fakeSong0.notes = [
        lines[5].split(',').map(item => ({
          note: notes[0],
          playNote: item.trim() === 'true',
        })),
        lines[6].split(',').map(item => ({
          note: notes[1],
          playNote: item.trim() === 'true',
        })),
        lines[7].split(',').map(item => ({
          note: notes[2],
          playNote: item.trim() === 'true',
        })),
        lines[8].split(',').map(item => ({
          note: notes[3],
          playNote: item.trim() === 'true',
        })),
        lines[9].split(',').map(item => ({
          note: notes[4],
          playNote: item.trim() === 'true',
        })),
        lines[10].split(',').map(item => ({
          note: notes[5],
          playNote: item.trim() === 'true',
        }))
      ]
    });
    //TODO START FAKE SONG CONSTS
    //LINES BETWEEN HERE AND END SHOULD BE DELETED AFTER TESTING
    let fakeSong1 = {
      title: 'Song title 1 (5words) - Lorem ipsum dolor sit amet.',
      creator: 'WWahr4TzizNmctFb-fW5F',
      description: 'Lorem ipsum dolor sit amet.',
      likes: 0,
      likedUsers: ['user1', 'user2'],
      notes: [fakeNotes0, fakeNotes1, fakeNotes2, fakeNotes3, fakeNotes4, fakeNotes5],
    };
    let fakeSong2 = {
      title:
        'Song title 2 (10words) - Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe, a.',
      creator: 'WWahr4TzizNmctFb-fW5F',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe, a.',
      likes: 0,
      likedUsers: ['user1', 'user2'],
      notes: [fakeNotes0, fakeNotes1, fakeNotes2, fakeNotes3, fakeNotes4, fakeNotes5],
    };
    let fakeSong3 = {
      title:
        'Song title 3 (25 words) - Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta nobis molestiae totam dolor, quod blanditiis deserunt suscipit et. Voluptate alias ratione possimus rerum facilis consequuntur.',
      creator: 'WWahr4TzizNmctFb-fW5F',
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta nobis molestiae totam dolor, quod blanditiis deserunt suscipit et. Voluptate alias ratione possimus rerum facilis consequuntur.',
      likes: 0,
      likedUsers: ['user1', 'user2'],
      notes: [fakeNotes0, fakeNotes1, fakeNotes2, fakeNotes3, fakeNotes4, fakeNotes5],
    };
    let fakeSong4 = {
      title:
        'Song title 4 (50 words) - Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex, sit. Fugit praesentium cum assumenda! Ea consequuntur delectus alias, sit nihil beatae quos eum minima culpa repellat est exercitationem cum a quae reiciendis itaque aliquam sequi porro animi dicta maiores impedit? Animi magnam adipisci fugit eaque. Nobis quidem ullam numquam harum.',
      creator: 'WWahr4TzizNmctFb-fW5F',
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex, sit. Fugit praesentium cum assumenda! Ea consequuntur delectus alias, sit nihil beatae quos eum minima culpa repellat est exercitationem cum a quae reiciendis itaque aliquam sequi porro animi dicta maiores impedit? Animi magnam adipisci fugit eaque. Nobis quidem ullam numquam harum.',
      likes: 0,
      likedUsers: ['user1', 'user2'],
      notes: [fakeNotes0, fakeNotes1, fakeNotes2, fakeNotes3, fakeNotes4, fakeNotes5],
    };
    let fakeSong5 = {
      title:
        'Song title 5 (100 words) - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam sed ullam dolorum aut totam qui natus modi alias quisquam praesentium, error dolores, ab, a eligendi. Veritatis, natus facere, dignissimos cupiditate facilis voluptas aliquam minus temporibus laudantium rem blanditiis ut itaque, sunt officia? Enim et eius expedita nemo nobis! Earum iusto voluptate autem nulla rerum laborum facere amet porro eaque, exercitationem quo totam officia accusamus! Saepe doloremque quae beatae ipsum voluptates similique velit aspernatur veniam eum corporis architecto, eligendi eius harum quas corrupti quos placeat quam voluptatum cumque perspiciatis rerum vitae. Molestiae nesciunt incidunt nihil voluptatibus nam cum, consequuntur rerum minima?',
      creator: 'WWahr4TzizNmctFb-fW5F',
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam sed ullam dolorum aut totam qui natus modi alias quisquam praesentium, error dolores, ab, a eligendi. Veritatis, natus facere, dignissimos cupiditate facilis voluptas aliquam minus temporibus laudantium rem blanditiis ut itaque, sunt officia? Enim et eius expedita nemo nobis! Earum iusto voluptate autem nulla rerum laborum facere amet porro eaque, exercitationem quo totam officia accusamus! Saepe doloremque quae beatae ipsum voluptates similique velit aspernatur veniam eum corporis architecto, eligendi eius harum quas corrupti quos placeat quam voluptatum cumque perspiciatis rerum vitae. Molestiae nesciunt incidunt nihil voluptatibus nam cum, consequuntur rerum minima?',
      likes: 0,
      likedUsers: ['user1', 'user2'],
      notes: [fakeNotes0, fakeNotes1, fakeNotes2, fakeNotes3, fakeNotes4, fakeNotes5],
    };
    //TODO END FAKE SONG CONSTS
    setSongs([fakeSong0, fakeSong1, fakeSong2, fakeSong3, fakeSong4, fakeSong5]);
  }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      console.log('TODO: Search the database for the title!');
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
              console.log('TODO: Search the database for the title!');
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
                console.log(song);
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

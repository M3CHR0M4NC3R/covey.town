/**
 * This function exists solely to help satisfy the linter + typechecker when it looks over the
 * stubbed (not yet implemented by you) functions. Remove calls to it as you go.
 *
 * @param _args
 */
// eslint-disable-next-line
export function removeThisFunctionCallWhenYouImplementThis(_args1?: any, _args2?: any): Error {
  return new Error('Unimplemented');
}

// eslint-disable-next-line
export function logError(err: any): void {
  // eslint-disable-next-line no-console
  console.trace(err);
}

// Check if song is valid
export function isSongValid(song: any): boolean {
  const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Cymbol', 'Drum'];

  // If any paramter is missing, return false
  if (!song.title || !song.creator || !song.description || !song.notes) {
    return false;
  }

  // If any notes array is missing, return false
  if (song.notes.length !== 6) {
    return false;
  }
  // If any of the notes have incorrect data then return false
  for (let i = 0; i < song.length; i++) {
    // Check if there's 16 notes in each array
    if (song.notes[i].length !== 16) {
      return false;
    }
    // Check if every note matches {"note":"Cymbol","playNote":false} format
    for (let j = 0; j < song.notes[i].length; j++) {
      if (song.notes[i][j].note !== notes[i] || typeof song.notes[i][j].playNote !== 'boolean') {
        return false;
      }
    }
  }

  return true;
}

// Iterate through every note and see if there's at least one note that's playing.
export function isSongNotesEmpty(song: any): boolean {
  for (let i = 0; i < song.notes.length; i++) {
    for (let j = 0; j < song.notes[i].length; j++) {
      if (song.notes[i][j].playNote === true) {
        return false;
      }
    }
  }
  return true;
}

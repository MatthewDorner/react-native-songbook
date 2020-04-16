import Sound from 'react-native-sound';
import Constants from './constants';

function loadSound(note) {
  // test to make sure this isn't loading sounds other than during program init
  // console.log('loading sounds...');
  return new Sound(`${note}.wav`, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      throw new Error(`failed to load the sample for note: ${note}. ${error.message}`);
    }
  });
}

Sound.setCategory('Playback');

/*
  since these sounds aren't loaded via import, it's dynamically through the file system whenever I
  call new Sound(), they can be released (explicitly?) and new sounds loaded dynamically so only
  one set should need to be loaded at a time, so this should allow different sets of samples to be
  used even if using react-native-sound.

  ALSO.... THERE IS TECHNOLOGY TO USE SOMETHING LIKE WEB WORKERS OR THREADS IN REACT NATIVE. SHOULD USE THIS
  SO WORKING IN THE UI DOESN'T AFFECT THE MUSIC PLAYBACK
*/

export default {
  track1sounds: Constants.SampleNotes.map(note => loadSound(note)),
  track2sounds: Constants.SampleNotes.map(note => loadSound(note))
};

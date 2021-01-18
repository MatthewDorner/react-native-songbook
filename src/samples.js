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

export default {
  track1sounds: Constants.SampleNotes.map(note => loadSound(note)),
  track2sounds: Constants.SampleNotes.map(note => loadSound(note))
};

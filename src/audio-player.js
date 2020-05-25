import { ABCJS } from 'abcjs-vexflow-renderer';
import AbcMidiCreate from 'abcjs/src/midi/abc_midi_create';
import Samples from './samples';
import Constants from './constants';

// this causes a dependency cycle
import store from './redux/store';
import { togglePlayback } from './redux/audio-slice';


/*
  the AudioPlayer maintains its own state that is updated by Redux actions and mirrors the Redux
  audio slice state, but doesn't act on or read Redux, is only acted on by Redux

  some other ways to create a variable timed loop here, to avoid the possible recursion limit:
  https://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running
*/
class AudioPlayer {
  constructor() {
    this.playing = false;
  }

  setPlaying(playing) {
    this.playing = playing;
  }

  // c3 is 48, c6 is 84
  iterateMidi(i, events, playMode) {
    if (!this.playing) {
      return;
    }

    let j = 0;
    for (j; j === 0 || (events[i + j] && events[i + j][1] === 0); j += 1) {
      const { track, event } = events[i + j][0];
      const soundIndex = event.noteNumber - 48;

      if (event.subtype === 'noteOn' && soundIndex > 0 && soundIndex < Samples.track1sounds.length) {
        if (track === 1 && playMode !== Constants.PlayModes.CHORDS_ONLY) {
          // MELODY
          const sound = Samples.track1sounds[soundIndex];
          sound.stop(() => {
            sound.play();
          });
        } else if (track === 2 && playMode !== Constants.PlayModes.MELODY_ONLY) {
          // CHORD ACCOMPANIMENT
          const sound = Samples.track2sounds[soundIndex];
          sound.stop(() => {
            sound.play();
          });
        }
      }
    }

    if (events[i + j]) {
      setTimeout(() => {
        this.iterateMidi(i + j, events, playMode);
      }, events[i + j][1] * 1.3);
    } else {
      store.dispatch(togglePlayback());
    }
  }

  startPlayback(tune, playMode) {
    const parsedObject = ABCJS.parseOnly(tune)[0];
    const parsedMidi = AbcMidiCreate(parsedObject, {});

    this.iterateMidi(0, parsedMidi, playMode);
  }
}

export default new AudioPlayer();

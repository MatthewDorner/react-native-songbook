import { ABCJS } from 'abcjs-vexflow-renderer';
import AbcMidiCreate from 'abcjs/src/midi/abc_midi_create';
import Samples from './samples';
import Constants from './constants';

// this causes a dependency cycle
import store from './redux/store';
import { stopPlayback } from './redux/audio-slice';

class AudioPlayer {
  constructor() {
    this.playing = false;
    this.currentTimeout = null;
  }

  setPlaying(playing) {
    this.playing = playing;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  // c3 is 48, c6 is 84
  iterateMidi(i, events, playMode, playbackSpeed) {
    if (!this.playing) {
      return;
    }

    let j = 0;

    for (j; j === 0 || (events[i + j] && events[i + j][1] < 1); j += 1) {
      const { track, event } = events[i + j][0];
      const soundIndex = event.noteNumber - 48; // should be minus 48 when I the first sample is C3

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
      this.currentTimeout = setTimeout(() => {
        this.iterateMidi(i + j, events, playMode, playbackSpeed);
      }, events[i + j][1] * 1.3 * (50 / playbackSpeed));
    } else {
      store.dispatch(stopPlayback());
    }
  }

  startPlayback(tune, playMode, playbackSpeed) {
    const parsedObject = ABCJS.parseOnly(tune)[0];
    const parsedMidi = AbcMidiCreate(parsedObject, {});
    this.iterateMidi(0, parsedMidi, playMode, playbackSpeed);
  }
}

export default new AudioPlayer();

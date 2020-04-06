import React from 'react';
import { View, Button } from 'react-native';
import { ABCJS } from 'abcjs-vexflow-renderer';
import AbcMidiCreate from 'abcjs/src/midi/abc_midi_create';
import Samples from '../samples';
import Constants from '../constants';

const transportState = {
  playing: true
};

// c3 is 48, c6 is 84
function iterateMidi(i, events, playMode) {
  if (!transportState.playing) {
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
      iterateMidi(i + j, events, true);
    }, events[i + j][1] * 1.3);
  }
}

function handleTransport(playMode, tune) {
  if (transportState.playing) {
    transportState.playing = false;
  } else {
    transportState.playing = true;

    const parsedObject = ABCJS.parseOnly(tune)[0];
    const parsedMidi = AbcMidiCreate(parsedObject, {});

    iterateMidi(0, parsedMidi, playMode);
  }
}

export default function AudioPlayer({ playMode, tune }) {
  return (
    <View>
      <Button
        onPress={() => { handleTransport(playMode, tune); }}
        containerStyle={{ width: 130 }}
        title="play"
        buttonStyle={{ backgroundColor: 'gray', marginBottom: 40 }}
      />
    </View>
  );
}

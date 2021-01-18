/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// TODO: fix dependency cycle
import AudioPlayer from '../audio-player';

import TuneRepository from '../data-access/tune-repository';
import OptionsRepository from '../data-access/options-repository';

const initialState = {
  playing: false,
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    startPlayback(state, { payload }) {
      AudioPlayer.setPlaying(true);
      AudioPlayer.startPlayback(payload.tune, payload.playMode, payload.playbackSpeed);
      state.playing = true;
    },
    stopPlayback(state) {
      AudioPlayer.setPlaying(false);
      state.playing = false;
    },
  },
});

export const {
  startPlayback,
  stopPlayback,
} = audioSlice.actions;

export const toggleCurrentTunePlayback = () => (dispatch, getState) => {
  const { tune, playMode, playbackSpeed } = getState().currentTune;
  const { playing } = getState().audio;
  if (playing) {
    dispatch(stopPlayback());
  } else {
    dispatch(startPlayback({ playMode, tune, playbackSpeed }));
  }
};

export const startBrowserPlayback = rowid => async (dispatch) => {
  const options = await OptionsRepository.get();
  const { PlayMode: playMode, PlaybackSpeed: playbackSpeed } = options;
  const tune = await TuneRepository.get(rowid);

  dispatch(startPlayback({ playMode, tune: tune.Tune, playbackSpeed }));
};

export default audioSlice.reducer;

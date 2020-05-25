/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import AudioPlayer from '../audio-player';

const initialState = {
  playing: false,
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    startPlayback(state, { payload }) {
      AudioPlayer.setPlaying(true);
      AudioPlayer.startPlayback(payload.tune, payload.playMode);
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

export const togglePlayback = () => (dispatch, getState) => {
  const { playMode, tune } = getState().currentTune;
  const { playing } = getState().audio;
  if (playing) {
    dispatch(stopPlayback());
  } else {
    dispatch(startPlayback({ playMode, tune }));
  }
};

export default audioSlice.reducer;

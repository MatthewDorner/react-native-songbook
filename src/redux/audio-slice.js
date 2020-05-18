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
    togglePlayback(state, { payload }) {
      if (state.playing) {
        AudioPlayer.setPlaying(false);
        state.playing = false;
      } else if (payload.tune) {
        AudioPlayer.setPlaying(true);
        AudioPlayer.startPlayback(payload.tune);
        state.playing = true;
      }
    },
  },
});

export const {
  togglePlayback
} = audioSlice.actions;

export default audioSlice.reducer;

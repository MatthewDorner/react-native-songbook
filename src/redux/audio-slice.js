/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import OptionsRepository from '../data-access/options-repository';

const initialState = {
  playing: false,
  shouldPlay: false,
  shouldStop: false,
  abcText: null,
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    startPlayback(state, { payload }) {
      state.abcText = payload.abcText;
      state.shouldPlay = true;
    },
    stopPlayback(state) {
      state.shouldStop = true;
    },
    confirmPlaybackStarted(state) {
      state.shouldPlay = false;
      state.playing = true;
    },
    confirmPlaybackStopped(state) {
      state.shouldStop = false;
      state.playing = false;
    },
    updateAudioOptionsSuccess(state, { payload }) {
      state.playMode = payload.playMode;
      state.playbackSpeed = payload.playbackSpeed;
    },
  }
});

export const {
  startPlayback,
  stopPlayback,
  confirmPlaybackStarted,
  confirmPlaybackStopped,
  updateAudioOptionsSuccess,
} = audioSlice.actions;

export function updateAudioOptions(playMode, playbackSpeed) {
  return async (dispatch) => {
    await OptionsRepository.update({
      PlayMode: playMode,
      PlaybackSpeed: playbackSpeed,
    });
    dispatch(updateAudioOptionsSuccess({ playMode, playbackSpeed }));
  };
}

export function refreshAudioOptions() {
  return async (dispatch) => {
    const { PlayMode, PlaybackSpeed } = await OptionsRepository.get();
    dispatch(updateAudioOptionsSuccess({ playMode: PlayMode, playbackSpeed: PlaybackSpeed }));
  };
}

export default audioSlice.reducer;

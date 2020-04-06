/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { Navigation } from 'react-native-navigation';
import Database from '../data-access/database';

const initialState = {};

const currentTuneSlice = createSlice({
  name: 'currentTune',
  initialState,
  reducers: {
    setDimensions(state, { payload }) {
      state.width = payload.width;
      state.height = payload.height;
    },
    fetchTuneStart(state) {
      state.loading = true;
    },
    fetchTuneSuccess(state, { payload }) {
      Navigation.mergeOptions('CurrentTune', {
        bottomTabs: {
          currentTabIndex: 0
        }
      });
      state.loading = false;
      state.tune = payload.tune;
      state.title = payload.title;
      state.rowid = payload.rowid;
    },
    updateOptionsSuccess(state, { payload }) {
      state.tabsVisibility = payload.tabsVisibility;
      state.zoom = payload.zoom;
      state.tuning = payload.tuning;
      state.playMode = payload.playMode;
    }
  },
});

export const {
  fetchTuneStart,
  fetchTuneSuccess,
  setDimensions,
  updateOptionsSuccess,
} = currentTuneSlice.actions;

export function fetchTune(rowid) {
  return async (dispatch) => {
    dispatch(fetchTuneStart());
    const { TabsVisibility, Zoom, Tuning, PlayMode } = await Database.getOptions();
    dispatch(updateOptionsSuccess({
      tabsVisibility: TabsVisibility,
      zoom: Zoom,
      tuning: Tuning,
      playMode: PlayMode,
    }));
    const { Tune, Title } = await Database.getWholeTune(rowid);
    dispatch(fetchTuneSuccess({
      tune: Tune,
      title: Title,
      rowid,
    }));
  };
}

export function updateOptions(tabsVisibility, zoom, tuning, playMode) {
  return async (dispatch) => {
    await Database.updateOptions({
      TabsVisibility: tabsVisibility,
      Zoom: zoom,
      Tuning: tuning,
      PlayMode: playMode,
    });
    dispatch(updateOptionsSuccess({ tabsVisibility, zoom, tuning, playMode }));
  };
}

export default currentTuneSlice.reducer;

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { Navigation } from 'react-native-navigation';
import TuneRepository from '../data-access/tune-repository';
import OptionsRepository from '../data-access/options-repository';

const initialState = {
  loading: false,
};

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
    updateTuneOptionsSuccess(state, { payload }) {
      state.zoom = payload.zoom;
      state.tabsVisibility = payload.tabsVisibility;
      state.tuning = payload.tuning;
    }
  },
});

export const {
  fetchTuneStart,
  fetchTuneSuccess,
  setDimensions,
  updateTuneOptionsSuccess,
} = currentTuneSlice.actions;

export function fetchTune(rowid) {
  return async (dispatch) => {
    dispatch(fetchTuneStart());

    const { TabsVisibility, Zoom, Tuning } = await OptionsRepository.get();

    dispatch(updateTuneOptionsSuccess({
      tabsVisibility: TabsVisibility,
      zoom: Zoom,
      tuning: Tuning,
    }));
    const { Tune, Title } = await TuneRepository.get(rowid);
    dispatch(fetchTuneSuccess({
      tune: Tune,
      title: Title,
      rowid,
    }));
  };
}

export function updateTuneOptions(tabsVisibility, zoom, tuning) {
  return async (dispatch) => {
    await OptionsRepository.update({
      TabsVisibility: tabsVisibility,
      Zoom: zoom,
      Tuning: tuning,
    });
    dispatch(updateTuneOptionsSuccess({ tabsVisibility, zoom, tuning }));
  };
}

export default currentTuneSlice.reducer;

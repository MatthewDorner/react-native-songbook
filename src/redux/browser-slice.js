/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import Database from '../data-access/database';
import Constants from '../constants';

const initialState = {
  collections: [],
  setlists: [],
  selectedCollection: [],
  searchResults: [],
};

const browserSlice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    fetchCollectionsStart(state) {
      state.loading = true;
    },
    fetchCollectionsSuccess(state, { payload }) {
      state.collections = payload.collections;
      state.setlists = payload.setlists;
      state.loading = false;
    },
    fetchSelectedCollectionStart(state) {
      state.loading = true;
    },
    fetchSelectedCollectionSuccess(state, { payload }) {
      state.selectedCollection = payload;
      state.searchResults = payload;
      state.loading = false;
    },
    applySearch(state, { payload }) {
      const {
        searchText, rhythmFilter, keyFilter
      } = payload;
      const { selectedCollection } = state;

      const searchResults = selectedCollection.filter(tune => tune.Title.toLowerCase().includes(searchText.toLowerCase()));
      const rhythmFilterResults = searchResults.filter(tune => tune.Rhythm.toLowerCase().includes(rhythmFilter.toLowerCase()));
      const keyFilterResults = rhythmFilterResults.filter(tune => tune.Key.toLowerCase().includes(keyFilter.toLowerCase()));
      state.searchResults = keyFilterResults;
    },
  },
});

export const {
  fetchCollectionsStart,
  fetchCollectionsSuccess,
  fetchSelectedCollectionStart,
  fetchSelectedCollectionSuccess,
  applySearch,
} = browserSlice.actions;

export function fetchCollections() {
  return async (dispatch) => {
    dispatch(fetchCollectionsStart());
    const collections = await Database.getCollections(Constants.CollectionTypes.COLLECTION);
    const setlists = await Database.getCollections(Constants.CollectionTypes.SETLIST);
    dispatch(fetchCollectionsSuccess({ collections, setlists }));
  };
}

export function fetchSelectedCollection(rowid, queriedBy) {
  return async (dispatch) => {
    dispatch(fetchSelectedCollectionStart());
    const collection = await Database.getPartialTunesForCollection(rowid, queriedBy);
    dispatch(fetchSelectedCollectionSuccess(collection));
  };
}

export default browserSlice.reducer;

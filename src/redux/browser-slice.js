/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import TuneRepository from '../data-access/tune-repository';
import CollectionRepository from '../data-access/collection-repository';
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

      // should G include results for Gm? maybe not, but I'd like the rhythm filter to not work that way... also with leaving
      // it how it is, people can search for 'm' to get all minor keys, 'mix' for all mixolydian
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
    const collections = await CollectionRepository.getCollectionsByType(Constants.CollectionTypes.COLLECTION);
    const setlists = await CollectionRepository.getCollectionsByType(Constants.CollectionTypes.SETLIST);
    dispatch(fetchCollectionsSuccess({ collections, setlists }));
  };
}

export function fetchSelectedCollection(rowid, queriedBy) {
  return async (dispatch) => {
    dispatch(fetchSelectedCollectionStart());
    const collection = await TuneRepository.getPartialTunesForCollection(rowid, queriedBy);
    dispatch(fetchSelectedCollectionSuccess(collection));
  };
}

export default browserSlice.reducer;

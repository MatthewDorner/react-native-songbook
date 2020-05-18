import thunk from 'redux-thunk';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import currentTuneReducer from './current-tune-slice';
import browserReducer from './browser-slice';
import audioReducer from './audio-slice';

const reducer = combineReducers({
  currentTune: currentTuneReducer,
  browser: browserReducer,
  audio: audioReducer,
});

export default configureStore({
  reducer,
  middleware: [thunk],
});

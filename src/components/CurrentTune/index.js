import { connect } from 'react-redux';
import CurrentTune from './CurrentTune';
import { setDimensions, updateTuneOptions } from '../../redux/current-tune-slice';
import { stopPlayback, updateAudioOptions, refreshAudioOptions } from '../../redux/audio-slice';

function mapStateToProps(state) {
  const { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading } = state.currentTune;
  const { playMode, playbackSpeed } = state.audio;
  return { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading, playMode, playbackSpeed };
}

export default connect(mapStateToProps, { setDimensions, updateTuneOptions, stopPlayback, updateAudioOptions, refreshAudioOptions })(CurrentTune);

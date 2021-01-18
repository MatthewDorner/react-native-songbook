import { connect } from 'react-redux';
import CurrentTune from './CurrentTune';
import { setDimensions, updateOptions } from '../../redux/current-tune-slice';
import { toggleCurrentTunePlayback } from '../../redux/audio-slice';

function mapStateToProps(state) {
  const { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading, playMode, playbackSpeed } = state.currentTune;
  const { playing } = state.audio;
  return { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading, playMode, playbackSpeed, playing };
}

export default connect(mapStateToProps, { setDimensions, updateOptions, toggleCurrentTunePlayback })(CurrentTune);

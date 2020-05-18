import { connect } from 'react-redux';
import CurrentTune from './CurrentTune';
import { setDimensions, updateOptions } from '../../redux/current-tune-slice';
import { togglePlayback } from '../../redux/audio-slice';

function mapStateToProps(state) {
  const { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading, playMode } = state.currentTune;
  const { playing } = state.audio;
  return { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading, playMode, playing };
}

export default connect(mapStateToProps, { setDimensions, updateOptions, togglePlayback })(CurrentTune);

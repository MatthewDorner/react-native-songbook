import { connect } from 'react-redux';
import CurrentTune from './CurrentTune';
import { setDimensions, updateOptions } from '../../redux/current-tune-slice';

function mapStateToProps(state) {
  const { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading, playMode } = state.currentTune;
  return { width, height, tuneRowid, tabsVisibility, zoom, tuning, title, tune, rowid, loading, playMode };
}

export default connect(mapStateToProps, { setDimensions, updateOptions })(CurrentTune);

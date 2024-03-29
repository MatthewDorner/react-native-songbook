import { connect } from 'react-redux';
import CollectionBrowser from './CollectionBrowser';
import { fetchCurrentTune } from '../../redux/current-tune-slice';
import { applySearch, fetchSelectedCollection } from '../../redux/browser-slice';
import { startPlayback } from '../../redux/audio-slice';

function mapStateToProps(state) {
  const { selectedCollection, searchResults } = state.browser;
  return { selectedCollection, searchResults };
}

export default connect(mapStateToProps, { applySearch, fetchSelectedCollection, fetchCurrentTune, startPlayback })(CollectionBrowser);

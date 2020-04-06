import { connect } from 'react-redux';
import TopBrowser from './TopBrowser';
import { fetchCollections } from '../../redux/browser-slice';

function mapStateToProps(state) {
  const { collections, setlists } = state.browser;
  return { collections, setlists };
}

export default connect(mapStateToProps, { fetchCollections })(TopBrowser);

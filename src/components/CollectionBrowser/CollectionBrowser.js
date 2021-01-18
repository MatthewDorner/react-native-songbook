import React, { PureComponent } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Modal
} from 'react-native';
import SearchContainer from '../SearchContainer';
import AddToSetlistModal from '../modals/AddToSetlistModal';
import RemoveFromSetlistModal from '../modals/RemoveFromSetlistModal';
import MoveToCollectionModal from '../modals/MoveToCollectionModal';
import DeleteTuneModal from '../modals/DeleteTuneModal';
import DetailsModal from '../modals/DetailsModal';
import CollectionListItem from '../CollectionListItem';

export default class CollectionBrowser extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      modalContents: <View />
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.queryDatabaseState();
  }

  queryDatabaseState() {
    const { collectionRowid, queriedBy, fetchSelectedCollection } = this.props;
    fetchSelectedCollection(collectionRowid, queriedBy);
  }

  closeModal() {
    this.setState({
      modalVisible: false
    });
    this.queryDatabaseState();
  }

  showModal(action, partialTune) {
    const { collectionRowid } = this.props;
    let modalToShow;

    switch (action) {
      case 'addToSetlist':
        modalToShow = <AddToSetlistModal closeModal={() => this.closeModal()} tuneRowid={partialTune.rowid} />;
        break;
      case 'removeFromSetlist':
        modalToShow = <RemoveFromSetlistModal closeModal={() => this.closeModal()} tuneRowid={partialTune.rowid} collectionRowid={collectionRowid} />;
        break;
      case 'moveToCollection':
        modalToShow = <MoveToCollectionModal closeModal={() => this.closeModal()} tuneRowid={partialTune.rowid} />;
        break;
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tuneRowid={partialTune.rowid} />;
        break;
      case 'delete':
        modalToShow = <DeleteTuneModal closeModal={() => this.closeModal()} tuneRowid={partialTune.rowid} />;
        break;
      default:
        return;
    }

    this.setState({
      modalContents: modalToShow,
      modalVisible: true
    });
  }

  renderItem({ item }) {
    const { queriedBy, fetchTune, startBrowserPlayback } = this.props;
    return (
      <CollectionListItem
        queriedBy={queriedBy}
        fetchTune={fetchTune}
        item={item}
        showModal={this.showModal}
        startBrowserPlayback={startBrowserPlayback}
      />
    );
  }

  render() {
    const { modalVisible, modalContents } = this.state;
    const { searchResults, applySearch } = this.props;

    return (
      <View style={styles.browserContainer}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
        >
          {modalContents}
        </Modal>

        <View>
          <SearchContainer applySearch={applySearch} />
        </View>
        <FlatList
          style={styles.tunesList}
          removeClippedSubviews
          data={searchResults}
          renderItem={this.renderItem}
          // can use partialTune to make key unique
          keyExtractor={(partialTune, index) => index.toString()} // is this really right
        />
      </View>
    );
  }
}

/*
  try linear gradients on some of the horizontal lines (text underline) to see if
  it's a good effect. also collection item divider, try subtle gradients in other
  places
*/

const styles = StyleSheet.create({
  browserContainer: {
    marginBottom: 80, // height of navigation bar
  },
  tunesList: {
    marginLeft: 20,
  },
});

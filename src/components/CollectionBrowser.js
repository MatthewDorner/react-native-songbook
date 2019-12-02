import React, { PureComponent } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Modal
} from 'react-native';
import Database from '../data-access/database';
import SearchContainer from './SearchContainer';
import AddToSetlistModal from './modals/AddToSetlistModal';
import RemoveFromSetlistModal from './modals/RemoveFromSetlistModal';
import MoveToCollectionModal from './modals/MoveToCollectionModal';
import DeleteTuneModal from './modals/DeleteTuneModal';
import DetailsModal from './modals/DetailsModal';
import CollectionListItem from './CollectionListItem';

export default class CollectionBrowser extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tunes: [],
      filteredTunes: [],
      searchText: '',
      rhythmFilter: '',
      keyFilter: '',
      modalVisible: false,
      modalContents: <View />
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.setSearchText = this.setSearchText.bind(this);
    this.setKeyFilter = this.setKeyFilter.bind(this);
    this.setRhythmFilter = this.setRhythmFilter.bind(this);
  }

  componentDidMount() {
    this.queryDatabaseState();
  }

  setSearchText(text) {
    return new Promise((resolve, reject) => {
      this.setState({
        searchText: text
      }, () => {
        this.onSearch();
      });
      resolve();
    });
  }

  setKeyFilter(text) {
    this.setState({
      keyFilter: text
    }, () => {
      this.onSearch();
    });
  }

  onSearch = () => new Promise((resolve, reject) => {
    const {
      searchText, rhythmFilter, keyFilter, tunes
    } = this.state;

    const searchResults = tunes.filter(tune => tune.Title.toLowerCase().includes(searchText.toLowerCase()));
    this.setState({
      filteredTunes: searchResults
    }, () => {
      const rhythmFilterResults = this.state.filteredTunes.filter(tune => tune.Rhythm.toLowerCase().includes(rhythmFilter.toLowerCase()));
      this.setState({
        filteredTunes: rhythmFilterResults
      }, () => {
        const keyFilterResults = this.state.filteredTunes.filter(tune => tune.Key.toLowerCase().includes(keyFilter.toLowerCase()));
        this.setState({
          filteredTunes: keyFilterResults
        });
      });
    });

    resolve();
  })

  setRhythmFilter(text) {
    this.setState({
      rhythmFilter: text
    }, () => {
      this.onSearch();
    });
  }

  closeModal() {
    this.setState({
      modalVisible: false
    });
  }

  queryDatabaseState() {
    const { collectionRowid, queriedBy } = this.props;
    Database.getPartialTunesForCollection(collectionRowid, queriedBy).then((tunes) => {
      this.setState({ tunes }, () => { this.onSearch(); });
    });
  }

  showModal(action, partialTune) {
    let modalToShow;
    const { collectionRowid } = this.props;
    switch (action) {
      case 'addToSetlist':
        modalToShow = <AddToSetlistModal closeModal={() => this.closeModal()} queryDatabaseState={() => this.queryDatabaseState()} tuneRowid={partialTune.rowid} />;
        break;
      case 'removeFromSetlist':
        modalToShow = <RemoveFromSetlistModal closeModal={() => this.closeModal()} queryDatabaseState={() => this.queryDatabaseState()} tuneRowid={partialTune.rowid} collectionRowid={collectionRowid} />;
        break;
      case 'moveToCollection':
        modalToShow = <MoveToCollectionModal closeModal={() => this.closeModal()} queryDatabaseState={() => this.queryDatabaseState()} tuneRowid={partialTune.rowid} />;
        break;
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tuneRowid={partialTune.rowid} />;
        break;
      case 'delete':
        modalToShow = <DeleteTuneModal closeModal={() => this.closeModal()} queryDatabaseState={() => this.queryDatabaseState()} tuneRowid={partialTune.rowid} />;
        break;
      default:
        return;
    }

    this.setState({
      modalContents: modalToShow
    }, () => {
      this.setState({
        modalVisible: true
      });
    });
  }

  renderItem({ item }) {
    const { queriedBy, tuneChangeCallback } = this.props;
    return (
      <CollectionListItem
        queriedBy={queriedBy}
        tuneChangeCallback={tuneChangeCallback}
        item={item}
        showModal={this.showModal}
      />
    );
  }

  render() {
    const { modalVisible, filteredTunes, modalContents } = this.state;
    return (
      <View style={styles.browserContainer}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            // would I actually want to do anything here?
          }}
        >
          {modalContents}
        </Modal>

        <View>
          <SearchContainer onSearch={this.onSearch} setSearchText={this.setSearchText} setKeyFilter={this.setKeyFilter} setRhythmFilter={this.setRhythmFilter} />
        </View>
        <FlatList
          style={styles.tunesList}
          removeClippedSubviews
          contentContainerStyle={{ alignItems: 'flex-start' }}
          data={filteredTunes}
          renderItem={this.renderItem}
          keyExtractor={(partialTune, index) => index.toString()} // is this really right
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  browserContainer: {
    marginBottom: 80, // height of navigation bar
  },
  tunesList: {
    marginLeft: 20
  }
});

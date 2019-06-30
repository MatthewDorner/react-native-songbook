import React, { PureComponent } from 'react';
import {
  FlatList,
  Picker,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Modal
} from 'react-native';
import Database from '../data-access/database';
import SearchContainer from './SearchContainer';
import AddToSetlistModal from './modals/AddToSetlistModal';
import RemoveFromSetlistModal from './modals/RemoveFromSetlistModal';
import MoveToCollectionModal from './modals/MoveToCollectionModal';
import DeleteTuneModal from './modals/DeleteTuneModal';
import DetailsModal from './modals/DetailsModal';
import Constants from '../logic/constants';

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
      modalContents: <View></View>
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.setSearchText = this.setSearchText.bind(this);
    this.setKeyFilter = this.setKeyFilter.bind(this);
    this.setRhythmFilter = this.setRhythmFilter.bind(this);

  }

  showModal(action, item) {
    let modalToShow;
    // add other actions here
    switch (action) {
      case 'addToSetlist':
        modalToShow = <AddToSetlistModal closeModal={() => this.closeModal()} tune={item}/>;
        break;
      case 'removeFromSetlist':
        modalToShow = <RemoveFromSetlistModal closeModal={() => this.closeModal()} tune={item} collectionId={this.props.collectionId}/>;
        break;
      case 'moveToCollection':
        modalToShow = <MoveToCollectionModal closeModal={() => this.closeModal()} tune={item} />;
        break;
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tune={item}/>;
        break;
      case 'delete':
        modalToShow = <DeleteTuneModal closeModal={() => this.closeModal()} tune={item}/>;
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

  closeModal() {
    this.setState({
      modalVisible: false
    }, () => {
      this.queryDatabaseState();
    });
  }

  setRhythmFilter(text) {
    this.setState({
      rhythmFilter: text
    }, () => {
      this.onSearch();
    });
  }

  setKeyFilter(text) {
    this.setState({
      keyFilter: text
    }, () => {
      this.onSearch();
    });
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


  onSearch = () => new Promise((resolve, reject) => {
    let { searchText, rhythmFilter, keyFilter } = this.state;
    
    const searchResults = this.state.tunes.filter(tune => tune.Title.toLowerCase().includes(searchText.toLowerCase()));
    //console.log(`got searchResults: ${searchResults}`);
    this.setState({
      filteredTunes: searchResults
    }, () => {
      const rhythmFilterResults = this.state.filteredTunes.filter(tune => tune.Rhythm.toLowerCase().includes(rhythmFilter.toLowerCase()));
      //console.log(`got rhythmFilterResults: ${rhythmFilterResults}`);
      this.setState({
        filteredTunes: rhythmFilterResults
      }, () => {
        const keyFilterResults = this.state.filteredTunes.filter(tune => tune.Key.toLowerCase().includes(keyFilter.toLowerCase()));
        //console.log(`got keyFilterResults: ${keyFilterResults}`);
        this.setState({
          filteredTunes: keyFilterResults
        });
      });
    });

    resolve();
  })

  componentDidMount() {
    this.queryDatabaseState();
  }

  queryDatabaseState() {
    Database.getTunesForCollection(this.props.collectionId, this.props.queriedBy).then((tunes) => {
      this.setState({ tunes }, () => { this.onSearch(); });
    });
  }

  _renderItem = ({ item }) => {

    let pickerOptions = [];
    if (this.props.queriedBy == Constants.CollectionTypes.COLLECTION) {
      pickerOptions = [
        <Picker.Item label='Cancel' value='cancel' key='cancel' />, // implemented
        <Picker.Item label='Details' value='details' key='details' />,
        <Picker.Item label='Add to Setlist' value='addToSetlist' key='addToSetlist' />, // implemented
        <Picker.Item label='Move to Collection' value='moveToCollection' key='moveToCollection' />,
        <Picker.Item label='Delete' value='delete' key='delete' />
      ];
    } else if (this.props.queriedBy == Constants.CollectionTypes.SETLIST) {
      pickerOptions = [
        <Picker.Item label='Cancel' value='cancel' key='cancel' />, // implemented
        <Picker.Item label='Details' value='details' key='details' />,
        <Picker.Item label='Remove from Setlist' value='removeFromSetlist' key='removeFromSetlist' />
      ];
    }

    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          onPress={() => {
            if (this.props.tuneChangeCallback.callback) {
              this.props.tuneChangeCallback.callback(item);
            }
          }}
        >
          <View>
            <Text style={styles.listItemTitle}>
              {item.Title}
            </Text>
            <View>
              <Text style={styles.listItemDetail}>
                {`Rhythm: ${item.Rhythm}, Key: ${item.Key}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Picker
          style={{height: 30, width: 40}}
          onValueChange={(itemValue) => {
            this.showModal(itemValue, item);
        }}>
          {pickerOptions}
        </Picker>
      </View>
    );
  }

  render() {
    return (
      <View>
        <Modal
          style={styles.modal} // should these be in the AbstractModal instead?
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // would I actually want to do anything here?
          }}>
          {this.state.modalContents}
        </Modal>

        <View>
          <SearchContainer onSearch={this.onSearch} setSearchText={this.setSearchText} setKeyFilter={this.setKeyFilter} setRhythmFilter={this.setRhythmFilter} />
        </View>
        <ScrollView>
          <FlatList
            contentContainerStyle={{ alignItems: 'flex-start' }}
            data={this.state.filteredTunes}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()} // is this really right
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 10
  },
  listItemTitle: {
    fontSize: 20,
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 4
  },
  listItemDetail: {
    fontSize: 13,
    textAlign: 'left',
    marginTop: 2,
    marginBottom: 2
  },
  modal: {
    margin: 20,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1
  }
});

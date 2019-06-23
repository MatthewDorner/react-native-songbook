import React, { Component } from 'react';
import {
  FlatList,
  Button,
  Picker,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableHighlight,
  Modal
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Database from '../data-access/database';
import SearchContainer from './SearchContainer';
import AddToSetlistModal from './AddToSetlistModal';
import Constants from '../logic/constants';

export default class CollectionBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tunes: [], // all the tunes for this Collection (I'll call Setlist a type of collection)
      filteredTunes: [],
      modalVisible: false,
      modalContents: <View></View>
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  showModal(action, item) {
    let modalToShow;
    // add other actions here
    switch (action) {
      case 'addToSetlist':
        modalToShow = <AddToSetlistModal closeModal={() => this.closeModal()} tune={item}/>;
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

  onSearch = (searchText, filters) => new Promise((resolve, reject) => {
    if (!filters) {
      filters = {};
    }

    if (!filters.key) {
      filters.key = '';
    }

    if (!filters.rhythm) {
      filters.rhythm = '';
    }

    if (!searchText) {
      searchText = '';
    }

    const searchResults = this.state.tunes.filter(tune => tune.Title.toLowerCase().includes(searchText.toLowerCase()));
    //console.log(`got searchResults: ${searchResults}`);
    this.setState({
      filteredTunes: searchResults
    }, () => {
      const rhythmFilterResults = this.state.filteredTunes.filter(tune => tune.Rhythm.toLowerCase().includes(filters.rhythm.toLowerCase()));
      //console.log(`got rhythmFilterResults: ${rhythmFilterResults}`);
      this.setState({
        filteredTunes: rhythmFilterResults
      }, () => {
        const keyFilterResults = this.state.filteredTunes.filter(tune => tune.Key.toLowerCase().includes(filters.key.toLowerCase()));
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
      this.setState({ tunes, filteredTunes: tunes });
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
        <TouchableHighlight
          underlayColor="lightgray"
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
        </TouchableHighlight>
        <Picker
          // selectedValue={''}
          style={{height: 30, width: 40}}
          onValueChange={(itemValue) => {
            //console.log('in picker onValueChange');
            //console.log('itemValue: ' + itemValue);
            this.showModal(itemValue, item);
        }}>
          {pickerOptions}
        </Picker>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>

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
          <SearchContainer onSearch={this.onSearch} />
        </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'flex-start' }}
          data={this.state.filteredTunes}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  listItemTitle: {
    fontSize: 20,
    textAlign: 'left',
    margin: 4,
  },
  listItemDetail: {
    fontSize: 13,
    textAlign: 'left',
    margin: 2,
  },
  modal: {
    margin: 20,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1
  }
});

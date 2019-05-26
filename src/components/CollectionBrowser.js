import React, { Component } from 'react';
import {
  FlatList,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableHighlight
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Database from '../data-access/database';
import SearchContainer from './SearchContainer';


export default class CollectionBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tunes: [], // all the tunes for this Collection (I'll call Setlist a type of collection)
      filteredTunes: []
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  // Important: You must return a Promise
  onSearch = (searchText, filters) => new Promise((resolve, reject) => {
    console.log(`got search for: ${searchText}`);
    if (filters) {
      console.log(`filters were key: ${filters.rhythm} , rhythm: ${filters.key}`);
    }

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
    console.log(`got searchResults: ${searchResults}`);
    this.setState({
      filteredTunes: searchResults
    }, () => {
      const rhythmFilterResults = this.state.filteredTunes.filter(tune => tune.Rhythm.toLowerCase().includes(filters.rhythm.toLowerCase()));
      console.log(`got rhythmFilterResults: ${rhythmFilterResults}`);
      this.setState({
        filteredTunes: rhythmFilterResults
      }, () => {
        const keyFilterResults = this.state.filteredTunes.filter(tune => tune.Key.toLowerCase().includes(filters.key.toLowerCase()));
        console.log(`got keyFilterResults: ${keyFilterResults}`);
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

  _renderItem = ({ item }) => (
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
  );

  render() {
    return (
      <ScrollView>
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
});

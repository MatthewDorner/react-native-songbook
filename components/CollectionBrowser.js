import React, { Component } from 'react';
import Database from '../database';

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

export default class CollectionBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tunes: []
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
  }

  componentDidMount() {
    this.queryDatabaseState();
  }

  queryDatabaseState() {
    if (this.props.queriedBy == "Collection") {
      Database.getTunesForCollection(this.props.collectionId).then((tunes) => {
        this.setState({tunes: tunes});
      });
    } else if (this.props.queriedBy == "Setlist") {
      Database.getTunesForSetlist(this.props.setlistIds).then((tunes) => {
        this.setState({tunes: tunes});
      });
    }
  }

  _renderItem = ({ item }) => (
    <TouchableHighlight underlayColor = {'red'} onPress={() => {
      if (this.props.tuneChangeCallback.callback) {
        this.props.tuneChangeCallback.callback(item);
      }
    }}
    > 
      <Text style = {styles.listItemText} >
        {item.Title}
      </Text>
    </TouchableHighlight>
  );

  render() {
    return (
      <ScrollView>
        <View>
          {/* This will contain the search bar and parameters */}
        </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'center' }}
          data={this.state.tunes}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  listItemText: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
});

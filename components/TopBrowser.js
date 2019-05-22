import React, { Component } from 'react';
import Database from '../database';
import Constants from '../constants';

import {
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import { Navigation } from 'react-native-navigation';
// import { isTSEnumMember } from '@babel/types';

export default class TopBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      setlists: []
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
  }

  componentDidMount() {
    this.queryDatabaseState();
  }

  queryDatabaseState() {
    Database.getCollections(Constants.CollectionTypes.COLLECTION).then((collections) => {
      console.log('setting collections to: ');
      console.log(collections);
      this.setState({collections: collections});
    });
    Database.getCollections(Constants.CollectionTypes.SETLIST).then((setlists) => {
      console.log('setting setlists to: ');
      console.log(setlists);
      this.setState({setlists: setlists});
    });
  }

  _renderCollectionsItem = ({ item }) => (
    <TouchableHighlight underlayColor = {'lightgray'} onPress={() => {
        Navigation.push('BrowserStack', {
          component: {
            name: 'CollectionBrowser',            
            passProps: {
              collectionId: item.rowid,
              queriedBy: item.Type,
              tuneChangeCallback: this.props.tuneChangeCallback
            }
          }
        });
      }}    
    > 
      <Text style = {styles.listItemText} >
        {item.Name}
      </Text>
    </TouchableHighlight>
  );

  render() {
    return (
      <ScrollView>
        <Text style = {styles.sectionHeader}>
          Collections
        </Text>
        <FlatList
          contentContainerStyle={{ alignItems: 'center' }}
          extraData={this.state}
          data={this.state.collections}
          renderItem={this._renderCollectionsItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />
        <Text style = {styles.sectionHeader}>
          Setlists
        </Text>
        <FlatList 
          contentContainerStyle={{ alignItems: 'center' }}
          extraData={this.state}
          data={this.state.setlists}
          renderItem={this._renderCollectionsItem}       
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
  sectionHeader: {
    fontSize: 30,
    textAlign: 'left',
    margin: 10,
  },
});

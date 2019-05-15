import React, { Component } from 'react';
import Database from '../database';

import {
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import { Navigation } from 'react-native-navigation';

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
    Database.getCollections().then((collections) => {
      // console.log('setting collections to: ');
      // console.log(collections);
      this.setState({collections: collections});
    });
    Database.getSetlists().then((setlists) => {
      // console.log('setting setlists to: ');
      // console.log(setlists);
      this.setState({setlists: setlists});
    });
  }

  _renderCollectionsItem = ({ item }) => (
    <TouchableHighlight underlayColor = {'red'} onPress={() => {
        Navigation.push('BrowserStack', {
          component: {
            name: 'CollectionBrowser',            
            passProps: {
              collectionId: item.rowid,
              queriedBy: 'Collection',
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

  /*
    this code shouldn't be repeated like this but need to figure out how to do it. need to know in the
    CollectionBrowser component what is being displayed, rather than just a collection / setlist record
    however..

    could use a single table for both collection & setlists, that's probably a bad idea but then the 
    CollectionBrowser could query it. if it's two separate tables, the CollectionBrowser gets the record
    with a rowid and can't figure out which table it's fron. but it's also bad to confuse the two tables
    like this. but don't want to repeat code. lean toward using a single table since they function the same
    and the differentiation will be part of the data then
  */

  _renderSetlistsItem = ({ item }) => (
    <TouchableHighlight underlayColor = {'red'} onPress={() => {
        Navigation.push('BrowserStack', {
          component: {
            name: 'CollectionBrowser',            
            passProps: {
              setlistIds: item.rowid,
              queriedBy: 'Setlist',
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
          renderItem={this._renderSetlistsItem}       
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

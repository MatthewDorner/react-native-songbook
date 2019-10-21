import React, { Component } from 'react';
import Search from 'react-native-search-box';

import {
  StyleSheet,
  TextInput,
  View
} from 'react-native';

export default class SearchContainer extends Component {
  render() {
    const { setSearchText, setRhythmFilter, setKeyFilter } = this.props;

    return (
      <View>
        <Search ref="search_box" onSearch={searchText => setSearchText(searchText)} onCancel={() => setSearchText('')} backgroundColor="#fafafa" titleCancelColor="gray" />
        <View style={styles.searchFiltersContainer}>
          <TextInput
            style={[styles.searchFilter, { marginRight: 2.5 }]}
            placeholder="Rhythm"
            onChangeText={text => setRhythmFilter(text)}
          />
          <TextInput
            style={[styles.searchFilter, { marginLeft: 2.5 }]}
            placeholder="Key"
            onChangeText={text => setKeyFilter(text)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchFilter: {
    textAlign: 'center',
    flex: 1,
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
    fontSize: 13
  },
  searchFiltersContainer: {

    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderBottomColor: 'lightgray',
    borderTopColor: 'lightgray'
  }
});

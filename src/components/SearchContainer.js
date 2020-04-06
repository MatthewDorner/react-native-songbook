import React, { Component } from 'react';
import Search from 'react-native-search-box';

import {
  StyleSheet,
  TextInput,
  View
} from 'react-native';

export default class SearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      rhythmFilter: '',
      keyFilter: '',
    };

    this.onSearch = this.onSearch.bind(this);
    this.setSearchText = this.setSearchText.bind(this);
    this.setKeyFilter = this.setKeyFilter.bind(this);
    this.setRhythmFilter = this.setRhythmFilter.bind(this);
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

  setRhythmFilter(text) {
    this.setState({
      rhythmFilter: text
    }, () => {
      this.onSearch();
    });
  }

  onSearch = () => {
    const { applySearch } = this.props;
    const { searchText, rhythmFilter, keyFilter } = this.state;
    applySearch({ searchText, rhythmFilter, keyFilter });
  }

  render() {
    return (
      <View>
        {/* removed ref="search box" */}
        <Search onSearch={searchText => this.setSearchText(searchText)} onCancel={() => this.setSearchText('')} backgroundColor="#fafafa" titleCancelColor="gray" />
        <View style={styles.searchFiltersContainer}>
          <TextInput
            style={[styles.searchFilter, { marginRight: 2.5 }]}
            placeholder="Rhythm"
            onChangeText={text => this.setRhythmFilter(text)}
          />
          <TextInput
            style={[styles.searchFilter, { marginLeft: 2.5 }]}
            placeholder="Key"
            onChangeText={text => this.setKeyFilter(text)}
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

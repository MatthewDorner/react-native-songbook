import React, { Component } from 'react';
import Search from 'react-native-search-box';

import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default class SearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyFilter: '',
      rhythmFilter: ''
    };
  }

  render() {
    return (
      <View>
        <Search ref="search_box" onSearch={this.props.onSearch} />
        <View style={styles.searchContainer}>
          <TextInput
            onSubmitEditing={() => this.props.onSearch(this.refs.search_box.value, { rhythm: this.state.rhythmFilter, key: this.state.keyFilter })}
            style={[styles.searchFilter, { marginRight: 2.5 }]}
            placeholder="Rhythm"
            onChangeText={text => this.setState({ rhythmFilter: text })}
          />
          <TextInput
            onSubmitEditing={() => this.props.onSearch(this.refs.search_box.value, { rhythm: this.state.rhythmFilter, key: this.state.keyFilter })}
            style={[styles.searchFilter, { marginLeft: 2.5 }]}
            placeholder="Key"
            onChangeText={text => this.setState({ keyFilter: text })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  searchFilter: {
    textAlign: 'center',
    flex: 1,
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
    // width: '45%',
    borderColor: '#444',
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    fontSize: 13,
    borderWidth: 0,
    marginLeft: 5,
    marginRight: 5
  },
  searchContainer: {
    height: 35,
    flexDirection: 'row',
    backgroundColor: 'grey'
  }
});

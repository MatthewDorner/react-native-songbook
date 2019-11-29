import React, { Component } from 'react';
import {
  Modal,
  Picker,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Database from '../data-access/database';
import Constants from '../data-access/constants';
import ListStyles from '../styles/list-styles';

import AddCollectionModal from './modals/AddCollectionModal';
import AddSetlistModal from './modals/AddSetlistModal';
import DeleteCollectionModal from './modals/DeleteCollectionModal';
import DeleteSetlistModal from './modals/DeleteSetlistModal';


export default class TopBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      setlists: [],
      modalContents: <View />, // dont know what this shold be
      modalVisible: false,
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.queryDatabaseState();
  }

  renderCollectionsItem = ({ item }) => (
    <View style={ListStyles.listItem}>
      <TouchableOpacity
        onPress={() => {
          Navigation.push('BrowserStack', {
            component: {
              name: 'CollectionBrowser',
              passProps: {
                collectionRowid: item.rowid,
                queriedBy: item.Type,
                tuneChangeCallback: this.props.tuneChangeCallback
              }
            }
          });
        }}
      >
        <Text style={ListStyles.listItemTitle}>
          {item.Name}
        </Text>
      </TouchableOpacity>
      <Picker
        style={ListStyles.listItemPicker}
        onValueChange={(action) => {
          this.showModal(action, item);
        }}
      >
        <Picker.Item label="Cancel" value="cancel" />
        <Picker.Item label="Delete" value="delete" />
      </Picker>
    </View>
  );

  queryDatabaseState() {
    Database.getCollections(Constants.CollectionTypes.COLLECTION).then((collections) => {
      this.setState({ collections });
    });
    Database.getCollections(Constants.CollectionTypes.SETLIST).then((setlists) => {
      this.setState({ setlists });
    });
  }

  showModal(action, item) {
    let modalToShow;
    switch (action) {
      case 'addCollection':
        modalToShow = <AddCollectionModal closeModal={() => this.closeModal()} />;
        break;
      case 'addSetlist':
        modalToShow = <AddSetlistModal closeModal={() => this.closeModal()} />;
        break;
      case 'delete':
        if (item.Type == Constants.CollectionTypes.COLLECTION) {
          modalToShow = <DeleteCollectionModal closeModal={() => this.closeModal()} collection={item} />;
        } else if (item.Type == Constants.CollectionTypes.SETLIST) {
          modalToShow = <DeleteSetlistModal closeModal={() => this.closeModal()} setlist={item} />;
        }
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

  render() {
    const { modalVisible, modalContents } = this.state;

    return (
      <View style={styles.browserContainer}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
        >
          {modalContents}
        </Modal>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>
            Collections
          </Text>

          <TouchableHighlight
            style={styles.addCollectionButton}
            underlayColor="lightgray"
            onPress={() => this.showModal('addCollection')}
          >
            <Text style={{ fontSize: 18, paddingBottom: 2, color: 'white' }}>+</Text>
          </TouchableHighlight>

        </View>
        <FlatList
          style={styles.collectionList}
          contentContainerStyle={{ alignItems: 'flex-start' }}
          // extraData={this.state}
          data={this.state.collections}
          renderItem={this.renderCollectionsItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>
            Setlists
          </Text>

          <TouchableHighlight
            style={styles.addCollectionButton}
            underlayColor="lightgray"
            onPress={() => this.showModal('addSetlist')}
          >
            <Text style={{ fontSize: 18, paddingBottom: 2, color: 'white' }}>+</Text>
          </TouchableHighlight>

        </View>
        <FlatList
          style={styles.collectionList}
          contentContainerStyle={{ alignItems: 'flex-start' }}
          // extraData={this.state}
          data={this.state.setlists}
          renderItem={this.renderCollectionsItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  browserContainer: {
    marginBottom: 80, // height of navigation bar
    marginLeft: 20
  },
  sectionHeaderContainer: {
    flexDirection: 'row'
  },
  sectionHeaderTitle: {
    color: '#aaaaaa',
    fontSize: 25,
    textAlign: 'left',
    marginTop: 13,
    marginRight: 10,
    marginBottom: 3
  },
  addCollectionButton: {
    backgroundColor: '#dddddd',
    marginTop: 20,
    marginLeft: 3,
    height: 23,
    borderRadius: 5,
    padding: 0,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

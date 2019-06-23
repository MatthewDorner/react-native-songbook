import React, { Component } from 'react';
import {
  Modal,
  Alert,
  Picker,
  Button,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableHighlight
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Database from '../data-access/database';
import Constants from '../logic/constants';

import AddCollectionModal from './AddCollectionModal';
import AddSetlistModal from './AddSetlistModal';
import DeleteCollectionModal from './DeleteCollectionModal';
import DeleteSetlistModal from './DeleteSetlistModal';

export default class TopBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      setlists: [],
      modalContents: <View></View>, // dont know what this shold be
      modalVisible: false,
    };

    this.queryDatabaseState = this.queryDatabaseState.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.queryDatabaseState();
  }

  showModal(action, type) {
    let modalToShow;
    switch (action) {
      case 'add':
        if (type == Constants.CollectionTypes.COLLECTION) {
          modalToShow = <AddCollectionModal closeModal={() => this.closeModal()} />;
        } else if (type == Constants.CollectionTypes.SETLIST) {
          modalToShow = <AddSetlistModal closeModal={() => this.closeModal()} />;
        }
        break;
      case 'delete':
        if (type == Constants.CollectionTypes.COLLECTION) {
          modalToShow = <DeleteCollectionModal closeModal={() => this.closeModal()} />;
        } else if (type == Constants.CollectionTypes.SETLIST) {
          modalToShow = <DeleteSetlistModal closeModal={() => this.closeModal()} />;
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
    //console.log.log('in closeModal()');
    this.setState({
      modalVisible: false
    }, () => {
      this.queryDatabaseState();
    });
  }

  queryDatabaseState() {
    Database.getCollections(Constants.CollectionTypes.COLLECTION).then((collections) => {
      //console.log.log('setting collections to: ');
      //console.log.log(collections);
      this.setState({ collections });
    });
    Database.getCollections(Constants.CollectionTypes.SETLIST).then((setlists) => {
      //console.log.log('setting setlists to: ');
      //console.log.log(setlists);
      this.setState({ setlists });
    });
  }

  _renderCollectionsItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableHighlight
        underlayColor="lightgray"
        onPress={() => {
          //console.log.log('pressed collection, the info was: ');
          //console.log.log(item);
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
        <Text style={styles.listItemText}>
          {item.Name}
        </Text>
      </TouchableHighlight>
      <Picker
        // selectedValue={''}
        style={{height: 50, width: 30}}
        onValueChange={(itemValue) => {
          //console.log.log('in picker onValueChange');
          //console.log.log('itemValue: ' + itemValue);
          //console.log.log('item.type: ' + item.Type);
          this.showModal(itemValue, item.Type);
      }}>
        <Picker.Item label="Cancel" value="cancel" />
        <Picker.Item label="Delete" value="delete" />
        <Picker.Item label="Merge" value="merge" />
      </Picker>
    </View>
  );

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

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>
            Collections
          </Text>


          {/* <Button
            onPress={() => this.showModal('add', Constants.CollectionTypes.COLLECTION)}
            title="Add"
            color="#841584"
          /> */}


          <TouchableHighlight
            style={styles.addCollectionButton}
            underlayColor="lightgray"
            onPress={() => this.showModal('add', Constants.CollectionTypes.COLLECTION)}
          >
            <Text style={styles.addCollectionButtonTitle}>Add</Text>
          </TouchableHighlight>

        </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'center' }}
          extraData={this.state}
          data={this.state.collections}
          renderItem={this._renderCollectionsItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>
            Setlists
          </Text>


          {/* <Button
            onPress={() => this.showModal('add', Constants.CollectionTypes.SETLIST)}
            title="Add"
            color="#841584"
          /> */}
          <TouchableHighlight
            style={styles.addCollectionButton}
            underlayColor="lightgray"
            onPress={() => this.showModal('add', Constants.CollectionTypes.SETLIST)}
          >
            <Text style={styles.addCollectionButtonTitle}>Add</Text>
          </TouchableHighlight>


        </View>
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
  addCollectionButton: { // TouchableHighlight
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#696969',
    padding: 7
  },
  addCollectionButtonTitle: { // Text
    fontSize: 20,
    color: '#696969'
  },
  listItem: {
    flexDirection: 'row'
  },
  listItemText: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
  sectionHeaderTitle: {
    fontSize: 30,
    textAlign: 'left',
    margin: 10,
  },
  sectionHeaderContainer: {
    flexDirection: 'row'
  },
  modal: {
    margin: 20,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1
  }
});

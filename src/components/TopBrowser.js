import React, { Component } from 'react';
import {
  Modal,
  Picker,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Database from '../data-access/database';
import Constants from '../logic/constants';
import ButtonStyles from '../styles/button-styles';

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

  showModal(action, item) {
    console.log('showModal: ');
    console.log('action: ' + action);
    console.log('item: ' + item);
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
          modalToShow = <DeleteCollectionModal closeModal={() => this.closeModal()} item={item} />;
        } else if (item.Type == Constants.CollectionTypes.SETLIST) {
          modalToShow = <DeleteSetlistModal closeModal={() => this.closeModal()} item={item}/>;
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

  queryDatabaseState() {
    Database.getCollections(Constants.CollectionTypes.COLLECTION).then((collections) => {
      this.setState({ collections });
    });
    Database.getCollections(Constants.CollectionTypes.SETLIST).then((setlists) => {
      this.setState({ setlists });
    });
  }

  _renderCollectionsItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        onPress={() => {
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
      </TouchableOpacity>
      <Picker
        style={{height: 50, width: 30}}
        onValueChange={(itemValue) => {
          this.showModal(itemValue, item);
      }}>
        <Picker.Item label="Cancel" value="cancel" />
        <Picker.Item label="Delete" value="delete" />
      </Picker>
    </View>
  );

  render() {
    return (
      <ScrollView>

        <Modal
          style={styles.modal}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          {this.state.modalContents}
        </Modal>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>
            Collections
          </Text>

          <TouchableHighlight
            style={ButtonStyles.addCollectionButton}
            underlayColor="lightgray"
            onPress={() => this.showModal('addCollection')}
          >
            <Text style={ButtonStyles.buttonTitle}>+</Text>
          </TouchableHighlight>

        </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'flex-start' }}
          extraData={this.state}
          data={this.state.collections}
          renderItem={this._renderCollectionsItem}
          keyExtractor={(item, index) => index.toString()} // is this really right
        />

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>
            Setlists
          </Text>

          <TouchableHighlight
            style={ButtonStyles.addCollectionButton}
            underlayColor="lightgray"
            onPress={() => this.showModal('addSetlist')}
          >
            <Text style={ButtonStyles.buttonTitle}>+</Text>
          </TouchableHighlight>


        </View>
        <FlatList
          contentContainerStyle={{ alignItems: 'flex-start' }}
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
  listItem: {
    flexDirection: 'row'
  },
  listItemText: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10
  },
  sectionHeaderTitle: {
    fontSize: 30,
    textAlign: 'left',
    margin: 10
  },
  sectionHeaderContainer: {
    flexDirection: 'row'
  },
  modal: {
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1
  }
});

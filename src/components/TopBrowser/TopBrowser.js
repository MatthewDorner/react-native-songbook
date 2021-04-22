import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Picker
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Constants from '../../constants';
import ListStyles from '../../styles/list-styles';
import Colors from '../../styles/colors';
import Fonts from '../../styles/fonts';

import AddCollectionModal from '../modals/AddCollectionModal';
import AddSetlistModal from '../modals/AddSetlistModal';
import DeleteCollectionModal from '../modals/DeleteCollectionModal';
import DeleteSetlistModal from '../modals/DeleteSetlistModal';
import ImportIntoCollectionModal from '../modals/ImportIntoCollectionModal';
import RenameCollectionSetlistModal from '../modals/RenameCollectionSetlistModal';

const addCollectionIcon = require('../../../icons/addfolderv2.png');

export default class TopBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContents: null,
      modalVisible: false,
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const { fetchCollections } = this.props;
    fetchCollections();
  }

  renderCollectionsItem = (item) => {
    let pickerOptions = [];
    if (item.Type === Constants.CollectionTypes.COLLECTION) {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Import Into Collection" value="importIntoCollection" key="importIntoCollection" />,
        <Picker.Item label="Rename" value="renameCollectionSetlist" key="renameCollectionSetlist" />,
        <Picker.Item label="Delete" value="delete" key="delete" />
      ];
    } else {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Rename" value="renameCollectionSetlist" key="renameCollectionSetlist" />,
        <Picker.Item label="Delete" value="delete" key="delete" />
      ];
    }

    return (
      <View style={ListStyles.listItem} key={item.rowid.toString()}>
        <Text style={ListStyles.listItemTitle}>▸</Text>
        <TouchableOpacity
          onPress={() => {
            Navigation.push('BrowserStack', {
              component: {
                name: 'CollectionBrowser',
                passProps: {
                  collectionRowid: item.rowid,
                  queriedBy: item.Type,
                }
              }
            });
          }}
        >
          <Text style={ListStyles.listItemTitle}>
            {item.Name}
          </Text>
        </TouchableOpacity>
        { item.Type !== Constants.CollectionTypes.ALL && (
          <Picker
            style={ListStyles.listItemPicker}
            onValueChange={(action) => {
              this.showModal(action, item);
            }}
          >
            {pickerOptions}
          </Picker>
        )}
      </View>
    );
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
        if (item.Type === Constants.CollectionTypes.COLLECTION) {
          modalToShow = <DeleteCollectionModal closeModal={() => this.closeModal()} collection={item} />;
        } else if (item.Type === Constants.CollectionTypes.SETLIST) {
          modalToShow = <DeleteSetlistModal closeModal={() => this.closeModal()} setlist={item} />;
        }
        break;
      case 'renameCollectionSetlist':
        modalToShow = <RenameCollectionSetlistModal closeModal={() => this.closeModal()} item={item} />;
        break;
      case 'importIntoCollection':
        modalToShow = <ImportIntoCollectionModal closeModal={() => this.closeModal()} collection={item} />;
        break;
      default:
        return;
    }

    this.setState({
      modalContents: modalToShow,
      modalVisible: true
    });
  }

  closeModal() {
    const { fetchCollections } = this.props;
    this.setState({
      modalVisible: false
    });
    fetchCollections();
  }

  render() {
    const { modalVisible, modalContents } = this.state;
    const { collections, setlists } = this.props;

    const collectionItems = collections.map(collection => this.renderCollectionsItem(collection));
    const setlistItems = setlists.map(setlist => this.renderCollectionsItem(setlist));

    collectionItems.unshift(this.renderCollectionsItem({ rowid: -1, Name: 'All Collections', Type: Constants.CollectionTypes.ALL }));

    return (
      <View style={styles.browserContainer}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
        >
          {modalContents}
        </Modal>
        <ScrollView style={styles.collectionsList}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderTitle}>
              Collections
            </Text>
            <TouchableHighlight
              style={styles.addCollectionButton}
              underlayColor={Colors.topBrowserUnderlay}
              onPress={() => this.showModal('addCollection')}
            >
              <Image source={addCollectionIcon} style={styles.addCollectionIcon} />
            </TouchableHighlight>
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            {collectionItems}
          </View>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderTitle}>
              Setlists
            </Text>
            <TouchableHighlight
              style={styles.addCollectionButton}
              underlayColor={Colors.topBrowserUnderlay}
              onPress={() => this.showModal('addSetlist')}
            >
              <Image source={addCollectionIcon} style={styles.addCollectionIcon} />
            </TouchableHighlight>
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            {setlistItems}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  browserContainer: {
    marginLeft: 20,
    marginBottom: 58
  },
  sectionHeaderContainer: {
    flexDirection: 'row'
  },
  sectionHeaderTitle: {
    textDecorationLine: 'underline',
    fontSize: 24,
    textAlign: 'left',
    fontFamily: Fonts.default,
    marginTop: 15,
    marginRight: 10,
    marginBottom: 3
  },
  addCollectionIcon: {
    height: 30.5,
    width: 30.5
  },
  addCollectionButton: {
    marginTop: 18.5,
    marginLeft: 0,
    height: 24,
    paddingTop: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

import React, { Component } from 'react';
import {
  Modal,
  Picker,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity
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

/*
  BUG: topbrowser doesn't scroll?
  what about the info screen? does that scroll?


*/

export default class TopBrowser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContents: <View />, // dont know what this should be
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

    // kind of a hack
    collectionItems.unshift(this.renderCollectionsItem({ rowid: -1, Name: 'All Collections', Type: Constants.CollectionTypes.ALL }));

    return (
      <ScrollView style={styles.browserContainer}>
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
            underlayColor={Colors.topBrowserUnderlay}
            onPress={() => this.showModal('addCollection')}
          >
            <Text style={{ fontSize: 14, paddingBottom: 2, color: Colors.topBrowserButtonTitle, fontFamily: Fonts.default }}>ADD</Text>
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
            <Text style={{ fontSize: 14, paddingBottom: 2, color: Colors.topBrowserButtonTitle, fontFamily: Fonts.default }}>ADD</Text>
          </TouchableHighlight>

        </View>

        <View style={{ alignItems: 'flex-start' }}>
          {setlistItems}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  browserContainer: {
    marginLeft: 20
  },
  sectionHeaderContainer: {
    flexDirection: 'row'
  },
  sectionHeaderTitle: {
    color: Colors.topBrowserSectionTitle,
    textDecorationLine: 'underline',
    fontSize: 22,
    textAlign: 'left',
    fontFamily: Fonts.default,
    marginTop: 13,
    marginRight: 10,
    marginBottom: 3
  },

  // addCollectionButton doesn't appear right on tablets, why?
  addCollectionButton: {
    backgroundColor: Colors.topBrowserButtonBackground,
    marginTop: 15.25,
    marginLeft: 0,
    height: 24,
    borderRadius: 5,
    // padding: 0,
    paddingTop: 1.5,
    width: 58,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

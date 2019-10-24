import React, { Component } from 'react';
import {
  Text,
  Picker,
  Alert
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../data-access/constants';

export default class MoveToCollectionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      selectedCollection: {}
    };

    this.moveToCollectionModal = this.moveToCollectionModal.bind(this);

    Database.getCollections(Constants.CollectionTypes.COLLECTION).then((collections) => {
      this.setState({
        collections,
        selectedCollection: collections[0].rowid
      });
    });
  }

  moveToCollectionModal() {
    const { tune, closeModal } = this.props;
    const { selectedCollection } = this.state;
    const { rowid } = tune;

    const tuneDelta = {
      Collection: selectedCollection
    };

    try {
      Database.updateTune(rowid, tuneDelta).then((res) => {
        closeModal();
      }).catch((e) => {
        // console.log('failed to add to setlist, error was: ');
        // console.log(e);
      });
    } catch (e) {
      Alert.alert(`exception in createCollectionOperation${e}`);
    }
  }

  render() {
    const { closeModal } = this.props;
    const { collections, selectedCollection } = this.state;

    const collectionPickerOptions = collections.map(collection => <Picker.Item label={collection.Name} value={collection.rowid} key={collection.rowid} />);

    return (
      <AbstractModal submit={this.moveToCollectionModal} cancel={closeModal}>
        <Text style={ModalStyles.title}>Move To Collection</Text>

        <Picker
          style={{ height: 50, width: '80%' }}
          selectedValue={selectedCollection}
          onValueChange={(itemValue) => {
            this.setState({
              selectedCollection: itemValue
            });
          }}
        >
          {collectionPickerOptions}
        </Picker>

        <Text style={ModalStyles.message}>
          Select a Collection to add this Tune to.
        </Text>

      </AbstractModal>
    );
  }
}

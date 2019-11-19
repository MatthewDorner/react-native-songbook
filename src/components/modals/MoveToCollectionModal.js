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
      });
    } catch (e) {
      Alert.alert(`Failed to move to collection: ${e}`);
    }
  }

  render() {
    const { closeModal } = this.props;
    const { collections, selectedCollection } = this.state;

    const collectionPickerOptions = collections.map(collection => <Picker.Item label={collection.Name} value={collection.rowid} key={collection.rowid} />);

    return (
      <AbstractModal submit={this.moveToCollectionModal} cancel={closeModal} title="Move To Collection">
        <Text style={ModalStyles.message}>
          Select a Collection to add this Tune to:
        </Text>
        <Text style={ModalStyles.pickerContainer}>
          <Picker
            style={ModalStyles.modalPicker}
            selectedValue={selectedCollection}
            onValueChange={(itemValue) => {
              this.setState({
                selectedCollection: itemValue
              });
            }}
          >
            {collectionPickerOptions}
          </Picker>
        </Text>
      </AbstractModal>
    );
  }
}

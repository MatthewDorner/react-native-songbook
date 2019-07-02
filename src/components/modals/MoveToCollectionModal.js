import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../logic/constants';

import {
  Text,
  Picker
} from 'react-native';

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
        selectedCollections: collections[0].rowid
      });
    });
  }

  moveToCollectionModal() {
    try {
      let rowid = this.props.tune.rowid;

      let tuneDelta = {
        Collection: this.state.selectedCollection
      };

      Database.updateTune(rowid, tuneDelta).then((res) => {
        this.props.closeModal();
      }).catch((e) => {
        //console.log('failed to add to setlist, error was: ');
        //console.log(e);
      });
    } catch (e) {
      alert("exception in createCollectionOperation" + e);
    }
  }

  render() {
    const collectionPickerOptions = this.state.collections.map((collection) => {
      return <Picker.Item label={collection.Name} value={collection.rowid} key={collection.rowid} />
    });

    return (
      <AbstractModal submit={this.moveToCollectionModal} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Move To Collection</Text>

        <Picker
          style={{height: 50, width: '80%'}}
          selectedValue={this.state.selectedCollection}
          onValueChange={(itemValue) => {
            this.setState({
              selectedCollection: itemValue
            });
        }}>
          {collectionPickerOptions}
        </Picker>

        <Text style={ModalStyles.message}>
          Select a Collection to add this Tune to.
        </Text>

      </AbstractModal>
    );
  }
}

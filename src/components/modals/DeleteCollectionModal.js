import React, { Component } from 'react';
import {
  Text,
  View,
  Alert
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../data-access/constants';


export default class deleteCollectionModal extends Component {
  constructor(props) {
    super(props);

    this.deleteCollectionOperation = this.deleteCollectionOperation.bind(this);
  }

  async deleteCollectionOperation() {
    const { item, closeModal } = this.props;

    try {
      const tunesForCollection = await Database.getTunesForCollection(item.rowid, Constants.CollectionTypes.COLLECTION);
      const promises = [];
      tunesForCollection.forEach((tune) => {
        promises.push(Database.deleteTune(tune));
      });
      await Promise.all(promises);
      await Database.deleteCollection(item.rowid);
    } catch (e) {
      Alert(`Failed to delete collection: ${e}`);
    }
    closeModal();
  }

  render() {
    const { item, closeModal } = this.props;

    return (
      <AbstractModal submit={this.deleteCollectionOperation} cancel={closeModal} title="Delete Collection">
        <Text style={ModalStyles.message}>
          Tunes in the collection will be deleted.
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Collection Name: ${item.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

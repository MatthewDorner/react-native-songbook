import React, { Component } from 'react';
import {
  Text,
  Alert
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';

export default class DeleteCollectionModal extends Component {
  constructor(props) {
    super(props);

    this.deleteCollectionOperation = this.deleteCollectionOperation.bind(this);
  }

  async deleteCollectionOperation() {
    const { collection, closeModal, queryDatabaseState } = this.props;
    closeModal();

    try {
      const result = await Database.deleteTunesForCollection(collection.rowid);
      await Database.deleteCollection(collection.rowid);
      Alert.alert('Deleted Collection Successfully', `Deleted ${result.rowsAffected} tunes.`);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to delete collection', `${e}`);
    }
  }

  render() {
    const { collection, closeModal } = this.props;

    return (
      <AbstractModal submit={this.deleteCollectionOperation} cancel={closeModal} title="Delete Collection">
        <Text style={ModalStyles.message}>
          Tunes in the collection will be deleted.
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Collection Name: ${collection.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

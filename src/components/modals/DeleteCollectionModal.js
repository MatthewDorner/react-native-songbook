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

  deleteCollectionOperation() {
    const { item, closeModal } = this.props;

    Database.getTunesForCollection(item.rowid, Constants.CollectionTypes.SETLIST).then((tunesForSetlist) => {
      const promises = [];

      tunesForSetlist.forEach((tune) => {
        promises.push(Database.deleteTune(tune));
      });

      Promise.all(promises).then(() => {
        Database.deleteCollection(item.rowid);
      }).then(() => {
        closeModal();
      }).catch((e) => {
        Alert(`Failed to delete collection: ${e}`);
      });
    });
  }

  render() {
    const { item, closeModal } = this.props;

    return (
      <AbstractModal submit={this.deleteCollectionOperation} cancel={closeModal}>
        <Text style={ModalStyles.title}>Delete Collection</Text>
        <Text style={ModalStyles.message}>
          Tunes in the collection will be deleted.
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Collection Name:${item.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

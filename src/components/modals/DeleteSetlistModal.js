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


export default class DeleteSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.deleteSetlistOperation = this.deleteSetlistOperation.bind(this);
  }

  deleteSetlistOperation() {
    const { item, closeModal } = this.props;

    Database.getTunesForCollection(item.rowid, Constants.CollectionTypes.SETLIST).then((tunesForSetlist) => {
      const promises = [];

      tunesForSetlist.forEach((tune) => {
        promises.push(Database.removeTuneFromSetlist(tune, item.rowid));
      });

      Promise.all(promises).then(() => {
        Database.deleteCollection(item.rowid);
      }).then(() => {
        closeModal();
      }).catch((e) => {
        Alert(`Failed to delete setlist: ${e}`);
      });
    });
  }

  render() {
    const { closeModal, item } = this.props;

    return (
      <AbstractModal submit={this.deleteSetlistOperation} cancel={closeModal} title="Delete Setlist">
        <Text style={ModalStyles.message}>
          Tunes in the setlist will not be deleted as they reside in their collection.
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Setlist Name:${item.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

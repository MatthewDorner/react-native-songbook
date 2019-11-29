import React, { Component } from 'react';
import {
  Text,
  Alert
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../data-access/constants';


export default class DeleteSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.deleteSetlistOperation = this.deleteSetlistOperation.bind(this);
  }

  async deleteSetlistOperation() {
    const { setlist, closeModal } = this.props;

    try {
      const tunesForSetlist = await Database.getPartialTunesForCollection(setlist.rowid, Constants.CollectionTypes.SETLIST);
      const promises = [];
      tunesForSetlist.forEach((tune) => {
        promises.push(DBOperations.removeTuneFromSetlist(tune, setlist.rowid));
      });
      await Promise.all(promises);
      await Database.deleteCollection(setlist.rowid);
    } catch (e) {
      Alert.alert('Failed to delete setlist', `${e}`);
    }
    closeModal();
  }

  render() {
    const { closeModal, setlist } = this.props;

    return (
      <AbstractModal submit={this.deleteSetlistOperation} cancel={closeModal} title="Delete Setlist">
        <Text style={ModalStyles.message}>
          Tunes in the setlist will not be deleted as they reside in their collection.
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Setlist Name: ${setlist.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

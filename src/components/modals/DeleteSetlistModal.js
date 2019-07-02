import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../logic/constants';

import {
  Text,
  View
} from 'react-native';

export default class DeleteSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.deleteSetlistOperation = this.deleteSetlistOperation.bind(this);
  }

  deleteSetlistOperation() {
    Database.getTunesForCollection(this.props.item.rowid, Constants.CollectionTypes.SETLIST).then((tunesForSetlist) => {
      let promises = [];
      
      tunesForSetlist.forEach((tune) => {
        promises.push(Database.removeTuneFromSetlist(tune, this.props.item.rowid));
      });
  
      Promise.all(promises).then(() => {
        Database.deleteCollection(this.props.item.rowid);
      }).then((values) => {
        this.props.closeModal();
      }).catch((error) => {
        // handle error
      });
    });
  }

  render() {
    return (
      <AbstractModal submit={this.deleteSetlistOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Delete Setlist</Text>

        <View style={ModalStyles.infoContainer}>
          <Text style={ModalStyles.infoItem}>Setlist Name: {this.props.item.Name}</Text>
        </View>

        <Text style={ModalStyles.message}>
          Tunes in the setlist will not be deleted as they reside in their collection.
        </Text>
      </AbstractModal>
    );
  }
}

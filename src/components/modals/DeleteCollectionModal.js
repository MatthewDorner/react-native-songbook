import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../logic/constants';

import {
  Text,
  View
} from 'react-native';

export default class deleteCollectionModal extends Component {
  constructor(props) {
    super(props);

    this.deleteCollectionOperation = this.deleteCollectionOperation.bind(this);
  }

  deleteCollectionOperation() {
    Database.getTunesForCollection(this.props.item.rowid, Constants.CollectionTypes.SETLIST).then((tunesForSetlist) => {
      let promises = [];
      
      tunesForSetlist.forEach((tune) => {
        promises.push(Database.deleteTune(tune));
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
      <AbstractModal submit={this.deleteCollectionOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Delete Collection</Text>

        <View style={ModalStyles.infoContainer}>
          <Text style={ModalStyles.infoItem}>Collection Name: {this.props.item.Name}</Text>
        </View>

        <Text style={ModalStyles.message}>
          Tunes in the collection will be deleted.
        </Text>

      </AbstractModal>
    );
  }
}

import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';

import {
  Text,
  View
} from 'react-native';

export default class DeleteTuneModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    /*
      what do I have access to here?
      item.Name
      item.Type
      item.rowid
    */

    this.deleteTuneOperation = this.deleteTuneOperation.bind(this);
  }

  deleteTuneOperation() {
    Database.deleteTune(this.props.tune).then((result) => {
      this.props.closeModal();
    }).catch((error) => {
      // handle error
    });
  }

  render() {
    return (
      <AbstractModal submit={this.deleteTuneOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Delete Tune</Text>

        <View style={ModalStyles.infoContainer}>
          <Text style={ModalStyles.infoItem}>Tune Name: {this.props.tune.Title}</Text>
        </View>

        <Text style={ModalStyles.message}>
          Tune will be deleted from app completely and all setlists.
        </Text>

      </AbstractModal>
    );
  }
}

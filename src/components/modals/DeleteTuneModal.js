import React, { Component } from 'react';
import {
  Text,
  View,
  Alert
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';


export default class DeleteTuneModal extends Component {
  constructor(props) {
    super(props);
    this.deleteTuneOperation = this.deleteTuneOperation.bind(this);
  }

  async deleteTuneOperation() {
    const { tune, closeModal } = this.props;

    try {
      await Database.deleteTune(tune);
    } catch (e) {
      Alert(`Failed to delete tune: ${e}`);
    }
    closeModal();
  }

  render() {
    const { tune, closeModal } = this.props;

    return (
      <AbstractModal submit={this.deleteTuneOperation} cancel={closeModal} title="Delete Tune">
        <Text style={ModalStyles.message}>
          Tune will be deleted from database completely and all setlists.
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Tune Name: ${tune.Title}`}
        </Text>
      </AbstractModal>
    );
  }
}

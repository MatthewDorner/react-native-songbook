import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';


export default class DeleteTuneModal extends Component {
  constructor(props) {
    super(props);
    this.deleteTuneOperation = this.deleteTuneOperation.bind(this);
  }

  deleteTuneOperation() {
    const { tune, closeModal } = this.props;

    Database.deleteTune(tune).then((result) => {
      closeModal();
    }).catch((e) => {
      // handle error
    });
  }

  render() {
    const { tune, closeModal } = this.props;

    return (
      <AbstractModal submit={this.deleteTuneOperation} cancel={closeModal}>
        <Text style={ModalStyles.title}>Delete Tune</Text>

        <View style={ModalStyles.infoContainer}>
          <Text style={ModalStyles.infoItem}>
            {`Tune Name: ${tune.Title}`}
          </Text>
        </View>

        <Text style={ModalStyles.message}>
          Tune will be deleted from app completely and all setlists.
        </Text>

      </AbstractModal>
    );
  }
}

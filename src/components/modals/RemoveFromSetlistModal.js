import React, { Component } from 'react';
import { Text } from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import DBOperations from '../../data-access/db-operations';

export default class RemoveFromSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.removeFromSetlistOperation = this.removeFromSetlistOperation.bind(this);
  }

  async removeFromSetlistOperation() {
    const { tune, closeModal, collectionId } = this.props;
    try {
      await DBOperations.removeTuneFromSetlist(tune, collectionId);
    } catch (e) {
      alert(`exception in removeFromSetlistOperation${e}`);
    }
    closeModal();
  }

  render() {
    const { closeModal } = this.props;

    return (
      <AbstractModal submit={this.removeFromSetlistOperation} cancel={closeModal}>
        <Text style={ModalStyles.title}>Remove From Setlist</Text>
        <Text style={ModalStyles.message}>
          Remove from setlist? Tune will remain available via its collection.
        </Text>
      </AbstractModal>
    );
  }
}

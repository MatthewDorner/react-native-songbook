import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import DBOperations from '../../data-access/db-operations';

import {
  Text
} from 'react-native';

export default class RemoveFromSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.removeFromSetlistOperation = this.removeFromSetlistOperation.bind(this);
  }

  async removeFromSetlistOperation() {
    try {
      await DBOperations.removeTuneFromSetlist(this.props.tune, this.props.collectionId);
    } catch (e) {
      alert("exception in removeFromSetlistOperation" + e);
    }
    this.props.closeModal();
  }

  render() {
    return (
      <AbstractModal submit={this.removeFromSetlistOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Remove From Setlist</Text>
        <Text style={ModalStyles.message}>
          Remove from setlist? Tune will remain available via its collection.
        </Text>
      </AbstractModal>
    );
  }
}

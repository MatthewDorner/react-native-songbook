import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';

import {
  Text,
} from 'react-native';

export default class DetailsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AbstractModal close={this.props.closeModal}>
        <Text style={ModalStyles.title}>Tune Details</Text>
        <Text style={ModalStyles.tuneDetails}>
          {this.props.tune.Tune}
        </Text>
      </AbstractModal>
    );
  }
}

import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';

import {
  Text,
} from 'react-native';

export default class DetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    return (
      // don't need the submit/cancel, just OK?
      // don't pass in the submit and if
      // it's undefined, the abstract modal will just render a "close" ???
      <AbstractModal close={this.props.closeModal}>
        <Text style={ModalStyles.title}>Tune Details</Text>
        <Text style={ModalStyles.tuneDetails}>
          {this.props.tune.Tune}
        </Text>
      </AbstractModal>
    );
  }
}

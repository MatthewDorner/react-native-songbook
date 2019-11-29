import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';

export default class DetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tune: {}
    };
  }

  async componentDidMount() {
    const { closeModal, tuneRowid } = this.props;

    try {
      const tune = await Database.getWholeTune(tuneRowid);
      this.setState({ tune });
    } catch (e) {
      Alert.alert('DetailsModal error', `${e}`);
      closeModal();
    }
  }

  render() {
    const { tune } = this.state;
    const { closeModal } = this.props;

    return (
      <AbstractModal close={closeModal} title="Tune Details">
        <Text style={ModalStyles.infoItem}>
          {tune.Tune}
        </Text>
      </AbstractModal>
    );
  }
}

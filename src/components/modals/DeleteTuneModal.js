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
    this.state = {
      tune: {}
    };
    this.deleteTuneOperation = this.deleteTuneOperation.bind(this);
  }

  async componentDidMount() {
    const { closeModal, tuneRowid } = this.props;

    try {
      const tune = await Database.getWholeTune(tuneRowid);
      this.setState({ tune });
    } catch (e) {
      Alert.alert('DeleteTuneModal error', `${e}`);
      closeModal();
    }
  }

  async deleteTuneOperation() {
    const { closeModal, queryDatabaseState } = this.props;
    const { tune } = this.state;
    closeModal();

    try {
      await Database.deleteTune(tune);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to delete tune', `${e}`);
    }
  }

  render() {
    const { closeModal } = this.props;
    const { tune } = this.state;

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

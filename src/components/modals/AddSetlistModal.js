import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Alert
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../data-access/constants';


export default class AddSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    this.createSetlistOperation = this.createSetlistOperation.bind(this);
  }

  async createSetlistOperation() {
    const { name } = this.state;
    const { closeModal } = this.props;

    try {
      Database.addCollection(name, Constants.CollectionTypes.SETLIST).then((res) => {
        closeModal();
      }).catch((e) => {
        // console.log('failed to create setlist, error was: ');
        // console.log(e);
      });
    } catch (e) {
      Alert.alert(`exception in createSetlistOperation${e}`);
    }
  }

  render() {
    const { closeModal } = this.props;

    return (
      <AbstractModal submit={this.createSetlistOperation} cancel={closeModal}>
        <Text style={ModalStyles.title}>Add Setlist</Text>

        <TextInput
          style={ModalStyles.nameInput}
          placeholder="Name"
          onChangeText={text => this.setState({ name: text })}
        />

        <Text style={ModalStyles.message}>
          A Tune can belong to any number of Setlists.
        </Text>

      </AbstractModal>
    );
  }
}

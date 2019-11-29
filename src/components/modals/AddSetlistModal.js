import React, { Component } from 'react';
import { Input } from 'react-native-elements';
import {
  Text,
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
      if (name === '') {
        throw new Error('Name was blank');
      }
      await Database.addCollection(name, Constants.CollectionTypes.SETLIST);
    } catch (e) {
      Alert.alert('Failed to create setlist:', `${e}`);
    }
    closeModal();
  }

  render() {
    const { closeModal } = this.props;

    return (
      <AbstractModal submit={this.createSetlistOperation} cancel={closeModal} title="Add Setlist">
        <Text style={ModalStyles.message}>
          A Tune can belong to any number of Setlists.
        </Text>
        <Input
          placeholder="Name"
          onChangeText={text => this.setState({ name: text })}
        />
      </AbstractModal>
    );
  }
}

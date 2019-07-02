import React, { Component } from 'react';
import AbstractModal from '..//modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../logic/constants';

import {
  Text,
  TextInput
} from 'react-native';

export default class AddSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    this.createSetlistOperation = this.createSetlistOperation.bind(this);
  }

  async createSetlistOperation() {
    try {
      Database.addCollection(this.state.name, Constants.CollectionTypes.SETLIST).then((res) => {
        this.props.closeModal();
      }).catch((e) => {
        //console.log('failed to create setlist, error was: ');
        //console.log(e);
      });
    } catch (e) {
      alert("exception in createSetlistOperation" + e);
    }
  }

  render() {
    return (
      <AbstractModal submit={this.createSetlistOperation} cancel={this.props.closeModal}>
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

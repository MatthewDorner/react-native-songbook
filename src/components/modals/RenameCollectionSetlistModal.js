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

export default class RenameCollectionSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    this.renameCollectionSetlistOperation = this.renameCollectionSetlistOperation.bind(this);
  }

  async renameCollectionSetlistOperation() {
    const { item, closeModal, queryDatabaseState } = this.props;
    const { name } = this.state;
    closeModal();

    const delta = {
      Name: name
    };

    try {
      await Database.updateRecord(item.rowid, delta, 'Collections');
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to rename collection/setlist', `${e}`);
    }
  }

  render() {
    const { item, closeModal } = this.props;
    const type = item.type === Constants.CollectionTypes.COLLECTION ? 'Collection' : 'Setlist';

    return (
      <AbstractModal submit={this.renameCollectionSetlistOperation} cancel={closeModal} title={`Rename ${type}`}>
        <Text style={ModalStyles.message}>
          {`Enter a new Name for the ${type}.`}
        </Text>
        <Input
          placeholder="Name"
          onChangeText={text => this.setState({ name: text })}
        />
        <Text style={ModalStyles.infoItem}>
          {`${type} Name: ${item.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

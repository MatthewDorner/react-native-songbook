import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import DBOperations from '../../data-access/db-operations';
import Database from '../../data-access/database';
import Constants from '../../data-access/constants';

export default class RemoveFromSetlistModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tune: {},
      setlist: {}
    };

    this.removeFromSetlistOperation = this.removeFromSetlistOperation.bind(this);
  }

  async componentDidMount() {
    const { collectionRowid, tuneRowid, closeModal } = this.props;

    try {
      const tune = await Database.getWholeTune(tuneRowid);
      const selectedSetlist = (await Database.getCollections(Constants.CollectionTypes.SETLIST)).filter((setlist) => {
        if (setlist.rowid === collectionRowid) {
          return true;
        }
        return false;
      })[0];
      this.setState({
        tune,
        setlist: selectedSetlist
      });
    } catch (e) {
      Alert.alert('RemoveFromSetlistModal error', `${e}`);
      closeModal();
    }
  }

  async removeFromSetlistOperation() {
    const { closeModal, collectionRowid, queryDatabaseState } = this.props;
    const { tune } = this.state;
    closeModal();

    try {
      await DBOperations.removeTuneFromSetlist(tune, collectionRowid);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to remove from setlist', `${e}`);
    }
  }

  render() {
    const { closeModal } = this.props;
    const { tune, setlist } = this.state;

    return (
      <AbstractModal submit={this.removeFromSetlistOperation} cancel={closeModal} title="Remove From Setlist">
        <Text style={ModalStyles.message}>
          Remove from setlist? Tune will remain available via its collection.
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Tune Name: ${tune.Title}`}
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Setlist Name: ${setlist.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

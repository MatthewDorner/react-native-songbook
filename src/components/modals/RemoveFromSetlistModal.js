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
      const setlists = await Database.getCollections(Constants.CollectionTypes.SETLIST);
      const selectedSetlist = setlists.filter((setlist) => {
        if (setlist.rowid === collectionRowid) {
          return true;
        }
        return false;
      })[0];
      const tune = await Database.getWholeTune(tuneRowid);
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
    const { closeModal, collectionRowid } = this.props;
    const { tune } = this.state;
    try {
      await DBOperations.removeTuneFromSetlist(tune, collectionRowid);
    } catch (e) {
      Alert.alert('Failed to remove from setlist', `${e}`);
    }
    closeModal();
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

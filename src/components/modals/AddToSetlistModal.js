import React, { Component } from 'react';
import {
  Text,
  Picker,
  Alert
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../data-access/constants';


export default class AddToSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setlists: [],
      selectedSetlist: {}
    };

    this.addToSetlistOperation = this.addToSetlistOperation.bind(this);

    Database.getCollections(Constants.CollectionTypes.SETLIST).then((setlists) => {
      this.setState({
        setlists,
        selectedSetlist: setlists[0].rowid
      });
    });
  }

  async addToSetlistOperation() {
    const { tune, closeModal } = this.props;
    const { selectedSetlist } = this.state;

    try {
      await DBOperations.addTuneToSetlist(tune, selectedSetlist);
    } catch (e) {
      Alert.alert(`Failed to add to setlist: ${e}`);
    }
    closeModal();
  }

  render() {
    const { setlists, selectedSetlist } = this.state;
    const { closeModal } = this.props;

    const setlistPickerOptions = setlists.map(setlist => <Picker.Item label={setlist.Name} value={setlist.rowid} key={setlist.rowid} />);

    return (
      <AbstractModal submit={this.addToSetlistOperation} cancel={closeModal}>
        <Text style={ModalStyles.title}>Add To Setlist</Text>
        <Text style={ModalStyles.message}>
          Select a setlist to add this tune to.
        </Text>
        <Picker
          style={ModalStyles.picker}
          selectedValue={selectedSetlist}
          onValueChange={(itemValue) => {
            this.setState({
              selectedSetlist: itemValue
            });
          }}
        >
          {setlistPickerOptions}
        </Picker>
      </AbstractModal>
    );
  }
}

import React, { Component } from 'react';
import {
  Text,
  Picker
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../logic/constants';


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
      alert(`exception in addToSetlistOperation${e}`);
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

        <Picker
          style={{ height: 50, width: '80%' }}
          selectedValue={selectedSetlist}
          onValueChange={(itemValue) => {
            this.setState({
              selectedSetlist: itemValue
            });
          }}
        >
          {setlistPickerOptions}
        </Picker>

        <Text style={ModalStyles.message}>
          Select a setlist to add this tune to.
        </Text>

      </AbstractModal>
    );
  }
}

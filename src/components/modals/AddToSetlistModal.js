import React, { Component } from 'react';
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../logic/constants';

import {
  Text,
  Picker
} from 'react-native';

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
    try {
      await DBOperations.addTuneToSetlist(this.props.tune, this.state.selectedSetlist);
    } catch (e) {
      alert("exception in addToSetlistOperation" + e);
    }
    this.props.closeModal();
  }

  render() {
    const setlistPickerOptions = this.state.setlists.map((setlist) => {
      return <Picker.Item label={setlist.Name} value={setlist.rowid} key={setlist.rowid} />
    });

    return (
      <AbstractModal submit={this.addToSetlistOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Add To Setlist</Text>

        <Picker
          style={{height: 50, width: '80%'}}
          selectedValue={this.state.selectedSetlist}
          onValueChange={(itemValue) => {
            this.setState({
              selectedSetlist: itemValue
            });
        }}>
          {setlistPickerOptions}
        </Picker>

        <Text style={ModalStyles.message}>
          Select a setlist to add this tune to.
        </Text>

      </AbstractModal>
    );
  }
}

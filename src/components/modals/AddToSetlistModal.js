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
      selectedSetlist: {},
      tune: {}
    };

    this.addToSetlistOperation = this.addToSetlistOperation.bind(this);
  }

  async componentDidMount() {
    const { tuneRowid, closeModal } = this.props;

    try {
      const tune = await Database.getWholeTune(tuneRowid);
      const setlists = await Database.getCollections(Constants.CollectionTypes.SETLIST);
      this.setState({
        setlists,
        selectedSetlist: setlists[0].rowid,
        tune
      });
    } catch (e) {
      Alert.alert('AddToSetlistModal error', `${e}`);
      closeModal();
    }
  }

  async addToSetlistOperation() {
    const { closeModal, queryDatabaseState } = this.props;
    const { selectedSetlist, tune } = this.state;
    closeModal();

    try {
      await DBOperations.addTuneToSetlist(tune, selectedSetlist);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to add to setlist', `${e}`);
    }
  }

  render() {
    const { setlists, selectedSetlist, tune } = this.state;
    const { closeModal } = this.props;

    const setlistPickerOptions = setlists.map(setlist => <Picker.Item label={setlist.Name} value={setlist.rowid} key={setlist.rowid} />);

    return (
      <AbstractModal submit={this.addToSetlistOperation} cancel={closeModal} title="Add To Setlist">
        <Text style={ModalStyles.message}>
          Select a setlist to add this tune to:
        </Text>
        <Text style={ModalStyles.pickerContainer}>
          <Picker
            style={ModalStyles.modalPicker}
            selectedValue={selectedSetlist}
            onValueChange={(itemValue) => {
              this.setState({
                selectedSetlist: itemValue
              });
            }}
          >
            {setlistPickerOptions}
          </Picker>
        </Text>
        <Text style={ModalStyles.infoItem}>
          {`Tune Name: ${tune.Title}`}
        </Text>
      </AbstractModal>
    );
  }
}

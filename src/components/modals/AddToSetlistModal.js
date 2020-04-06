import React, { useState, useEffect } from 'react';
import {
  Text,
  Picker,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../constants';

export default function AddtoSetlistModal(props) {
  const [setlists, setSetlists] = useState([]);
  const [selectedSetlist, setSelectedSetlist] = useState({});
  const [tune, setTune] = useState({});
  const { tuneRowid, closeModal, queryDatabaseState } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const tune = await Database.getWholeTune(tuneRowid);
        const setlists = await Database.getCollections(Constants.CollectionTypes.SETLIST);
        setSetlists(setlists);
        setSelectedSetlist(setlists[0].rowid);
        setTune(tune);
      } catch (e) {
        Alert.alert('AddToSetlistModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  const addToSetlistOperation = async () => {
    closeModal();
    try {
      await DBOperations.addTuneToSetlist(tune, selectedSetlist);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to add to setlist', `${e}`);
    }
  };

  return (
    <ModalContainer submit={addToSetlistOperation} cancel={closeModal} title="Add To Setlist">
      <Text style={ModalStyles.message}>
        Select a setlist to add this tune to:
      </Text>
      <Text style={ModalStyles.pickerContainer}>
        <Picker
          style={ModalStyles.modalPicker}
          selectedValue={selectedSetlist}
          onValueChange={value => setSelectedSetlist(value)}
        >
          {setlists.map(setlist => <Picker.Item label={setlist.Name} value={setlist.rowid} key={setlist.rowid} />)}
        </Picker>
      </Text>
      <Text style={ModalStyles.infoItem}>
        {`Tune Name: ${tune.Title}`}
      </Text>
    </ModalContainer>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';

export default function DeleteTuneModal(props) {
  const [tune, setTune] = useState({});
  const { closeModal, tuneRowid, queryDatabaseState } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const wholeTune = await Database.getWholeTune(tuneRowid);
        setTune(wholeTune);
      } catch (e) {
        Alert.alert('DeleteTuneModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  const deleteTuneOperation = async () => {
    closeModal();
    try {
      await Database.deleteTune(tune);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to delete tune', `${e}`);
    }
  };

  return (
    <ModalContainer submit={deleteTuneOperation} cancel={closeModal} title="Delete Tune">
      <Text style={ModalStyles.message}>
        Tune will be deleted from database completely and all setlists.
      </Text>
      <Text style={ModalStyles.infoItem}>
        {`Tune Name: ${tune.Title}`}
      </Text>
    </ModalContainer>
  );
}

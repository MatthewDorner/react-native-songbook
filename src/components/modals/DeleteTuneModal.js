import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import TuneRepository from '../../data-access/tune-repository';

export default function DeleteTuneModal(props) {
  const [tune, setTune] = useState({});
  const { closeModal, tuneRowid } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const wholeTune = await TuneRepository.get(tuneRowid);
        setTune(wholeTune);
      } catch (e) {
        Alert.alert('DeleteTuneModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  const deleteTuneOperation = async () => {
    try {
      await TuneRepository.delete(tune);
      closeModal();
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

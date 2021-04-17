import React, { useState, useEffect } from 'react';
import { Text, Alert } from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import TuneRepository from '../../data-access/tune-repository';

export default function DetailsModal(props) {
  const [tune, setTune] = useState({});
  const { closeModal, tuneRowid } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const tune = await TuneRepository.get(tuneRowid);
        setTune(tune);
      } catch (e) {
        Alert.alert('DetailsModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  return (
    <ModalContainer close={closeModal} title="Tune Details">
      <Text style={ModalStyles.infoMonospace}>
        {tune.AbcText}
      </Text>
    </ModalContainer>
  );
}

import React, { useState, useEffect } from 'react';
import { Text, Alert } from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';

export default function DetailsModal(props) {
  const [tune, setTune] = useState({});
  const { closeModal, tuneRowid } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const wholeTune = await Database.getWholeTune(tuneRowid);
        setTune(wholeTune);
      } catch (e) {
        Alert.alert('DetailsModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  return (
    <ModalContainer close={closeModal} title="Tune Details">
      <Text style={ModalStyles.infoItem}>
        {tune.Tune}
      </Text>
    </ModalContainer>
  );
}

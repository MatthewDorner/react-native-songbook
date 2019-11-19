import React from 'react';
import { Text } from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';

export default function DetailsModal({ tune, closeModal }) {
  return (
    <AbstractModal close={closeModal} title="Tune Details">
      <Text style={ModalStyles.infoItem}>
        {tune.Tune}
      </Text>
    </AbstractModal>
  );
}

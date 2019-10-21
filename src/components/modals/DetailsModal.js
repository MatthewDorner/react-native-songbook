import React from 'react';
import { Text } from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';

export default function DetailsModal({ tune, closeModal }) {
  return (
    <AbstractModal close={closeModal}>
      <Text style={ModalStyles.title}>Tune Details</Text>
      <Text style={ModalStyles.tuneDetails}>
        {tune.Tune}
      </Text>
    </AbstractModal>
  );
}

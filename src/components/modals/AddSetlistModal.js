import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import CollectionRepository from '../../data-access/collection-repository';
import Constants from '../../constants';
import Fonts from '../../styles/fonts';

export default function AddSetlistmodal(props) {
  const [name, setName] = useState('');
  const { closeModal } = props;

  const createSetlistOperation = async () => {
    try {
      if (name === '') {
        throw new Error('Name was blank');
      }
      await CollectionRepository.insert({
        Name: name,
        Type: Constants.CollectionTypes.SETLIST
      });
      closeModal();
    } catch (e) {
      Alert.alert('Failed to create setlist:', `${e}`);
    }
  };

  return (
    <ModalContainer submit={createSetlistOperation} cancel={closeModal} title="Add Setlist">
      <Text style={ModalStyles.message}>
        A Tune can be added to one or more Setlists. Enter a name for the new Setlist:
      </Text>
      <Input
        placeholder="Name"
        onChangeText={value => setName(value)}
        inputStyle={ModalStyles.input}
      />
    </ModalContainer>
  );
}

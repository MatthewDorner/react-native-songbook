import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import Constants from '../../constants';

export default function AddSetlistmodal(props) {
  const [name, setName] = useState('');
  const { closeModal, queryDatabaseState } = props;

  const createSetlistOperation = async () => {
    closeModal();
    try {
      if (name === '') {
        throw new Error('Name was blank');
      }
      await Database.addCollection(name, Constants.CollectionTypes.SETLIST);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to create setlist:', `${e}`);
    }
  };

  return (
    <ModalContainer submit={createSetlistOperation} cancel={closeModal} title="Add Setlist">
      <Text style={ModalStyles.message}>
        A Tune can belong to any number of Setlists.
      </Text>
      <Input
        placeholder="Name"
        onChangeText={value => setName(value)}
      />
    </ModalContainer>
  );
}

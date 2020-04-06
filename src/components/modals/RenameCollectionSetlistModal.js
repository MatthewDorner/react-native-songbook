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

export default function RenameCollectionSetlistModal(props) {
  const [name, setName] = useState('');
  const { item, closeModal, queryDatabaseState } = props;
  const type = item.type === Constants.CollectionTypes.COLLECTION ? 'Collection' : 'Setlist';

  const renameCollectionSetlistOperation = async () => {
    closeModal();
    const delta = { Name: name };
    try {
      await Database.updateRecord(item.rowid, delta, 'Collections');
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to rename collection/setlist', `${e}`);
    }
  };

  return (
    <ModalContainer submit={renameCollectionSetlistOperation} cancel={closeModal} title={`Rename ${type}`}>
      <Text style={ModalStyles.message}>
        {`Enter a new Name for the ${type}.`}
      </Text>
      <Input
        placeholder="Name"
        onChangeText={value => setName(value)}
      />
      <Text style={ModalStyles.infoItem}>
        {`${type} Name: ${item.Name}`}
      </Text>
    </ModalContainer>
  );
}

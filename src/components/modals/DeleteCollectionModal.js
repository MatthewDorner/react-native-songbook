import React from 'react';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';

export default function DeleteCollectionModal(props) {
  const { collection, closeModal, queryDatabaseState } = props;

  const deleteCollectionOperation = async () => {
    closeModal();
    try {
      const result = await Database.deleteTunesForCollection(collection.rowid);
      await Database.deleteCollection(collection.rowid);
      Alert.alert('Deleted Collection Successfully', `Deleted ${result.rowsAffected} tunes.`);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to delete collection', `${e}`);
    }
  };

  return (
    <ModalContainer submit={deleteCollectionOperation} cancel={closeModal} title="Delete Collection">
      <Text style={ModalStyles.message}>
        Tunes in the collection will be deleted.
      </Text>
      <Text style={ModalStyles.infoItem}>
        {`Collection Name: ${collection.Name}`}
      </Text>
    </ModalContainer>
  );
}

import React from 'react';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import TuneRepository from '../../data-access/tune-repository';
import CollectionRepository from '../../data-access/collection-repository';

export default function DeleteCollectionModal(props) {
  const { collection, closeModal } = props;

  const deleteCollectionOperation = async () => {
    try {
      const result = await TuneRepository.deleteTunesForCollection(collection.rowid);
      await CollectionRepository.delete(collection);
      Alert.alert('Deleted Collection Successfully', `Deleted ${result.rowsAffected} tunes.`);
      closeModal();
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

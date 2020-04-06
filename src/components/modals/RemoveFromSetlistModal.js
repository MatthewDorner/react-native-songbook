import React, { useState, useEffect } from 'react';
import { Text, Alert } from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import DBOperations from '../../data-access/db-operations';
import Database from '../../data-access/database';
import Constants from '../../constants';

export default function RemoveFromSetlistModal(props) {
  const [tune, setTune] = useState({});
  const [setlist, setSetlist] = useState({});
  const { collectionRowid, tuneRowid, closeModal, queryDatabaseState } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const tune = await Database.getWholeTune(tuneRowid);
        const selectedSetlist = (await Database.getCollections(Constants.CollectionTypes.SETLIST)).filter((setlist) => {
          if (setlist.rowid === collectionRowid) {
            return true;
          }
          return false;
        })[0];
        setTune(tune);
        setSetlist(selectedSetlist);
      } catch (e) {
        Alert.alert('RemoveFromSetlistModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  const removeFromSetlistOperation = async () => {
    closeModal();
    try {
      await DBOperations.removeTuneFromSetlist(tune, collectionRowid);
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to remove from setlist', `${e}`);
    }
  };

  return (
    <ModalContainer submit={removeFromSetlistOperation} cancel={closeModal} title="Remove From Setlist">
      <Text style={ModalStyles.message}>
        Remove from setlist? Tune will remain available via its collection.
      </Text>
      <Text style={ModalStyles.infoItem}>
        {`Tune Name: ${tune.Title}`}
      </Text>
      <Text style={ModalStyles.infoItem}>
        {`Setlist Name: ${setlist.Name}`}
      </Text>
    </ModalContainer>
  );
}

import React, { useState, useEffect } from 'react';
import { Text, Alert } from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Constants from '../../constants';
import TuneRepository from '../../data-access/tune-repository';
import CollectionRepository from '../../data-access/collection-repository';

export default function RemoveFromSetlistModal(props) {
  const [tune, setTune] = useState({});
  const [setlist, setSetlist] = useState({});
  const { collectionRowid, tuneRowid, closeModal } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const tune = await TuneRepository.get(tuneRowid);
        const selectedSetlist = (await CollectionRepository.getCollectionsByType(Constants.CollectionTypes.SETLIST)).filter((setlist) => {
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
    try {
      await TuneRepository.removeTuneFromSetlist(tune, collectionRowid);
      closeModal();
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

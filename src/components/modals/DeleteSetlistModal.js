import React from 'react';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import TuneRepository from '../../data-access/tune-repository';
import CollectionRepository from '../../data-access/collection-repository';
import Constants from '../../constants';

export default function DeleteSetlistModal(props) {
  const { closeModal, setlist } = props;

  const deleteSetlistOperation = async () => {
    try {
      const tunesForSetlist = await TuneRepository.getPartialTunesForCollection(setlist.rowid, Constants.CollectionTypes.SETLIST);
      const promises = [];

      // this could be moved to a database operation? Delete Setlist?
      for (let i = 0; i < tunesForSetlist.length; i += 1) {
        const partialTune = tunesForSetlist[i];
        const tune = await TuneRepository.get(partialTune.rowid);
        promises.push(TuneRepository.removeTuneFromSetlist(tune, setlist.rowid));
      }

      await Promise.all(promises);
      await CollectionRepository.delete(setlist);

      closeModal();
    } catch (e) {
      Alert.alert('Failed to delete setlist', `${e}`);
    }
  };

  return (
    <ModalContainer submit={deleteSetlistOperation} cancel={closeModal} title="Delete Setlist">
      <Text style={ModalStyles.message}>
        Setlist:
      </Text>
      <Text style={ModalStyles.infoItem}>
        {setlist.Name}
      </Text>
    </ModalContainer>
  );
}

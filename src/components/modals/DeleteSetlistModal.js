import React from 'react';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../constants';

/*
  there has to be a way to get rid of passing queryDatabaseState to every specific modal
*/

export default function DeleteSetlistModal(props) {
  const { closeModal, setlist, queryDatabaseState } = props;

  const deleteSetlistOperation = async () => {
    closeModal();
    try {
      const tunesForSetlist = await Database.getPartialTunesForCollection(setlist.rowid, Constants.CollectionTypes.SETLIST);
      const promises = [];

      // this could be moved to a database operation? Delete Setlist?
      for (let i = 0; i < tunesForSetlist.length; i += 1) {
        const partialTune = tunesForSetlist[i];
        const wholeTune = await Database.getWholeTune(partialTune.rowid);
        promises.push(DBOperations.removeTuneFromSetlist(wholeTune, setlist.rowid));
      }

      await Promise.all(promises);
      await Database.deleteCollection(setlist.rowid);
      Alert.alert('Deleted Setlist Successfully');
      queryDatabaseState();
    } catch (e) {
      Alert.alert('Failed to delete setlist', `${e}`);
    }
  };

  return (
    <ModalContainer submit={deleteSetlistOperation} cancel={closeModal} title="Delete Setlist">
      <Text style={ModalStyles.message}>
        Tunes in the setlist will not be deleted as they reside in their collection.
      </Text>
      <Text style={ModalStyles.infoItem}>
        {`Setlist Name: ${setlist.Name}`}
      </Text>
    </ModalContainer>
  );
}

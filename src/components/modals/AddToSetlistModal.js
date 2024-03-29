import React, { useState, useEffect } from 'react';
import {
  Text,
  Alert,
  Picker,
  View
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import TuneRepository from '../../data-access/tune-repository';
import CollectionRepository from '../../data-access/collection-repository';
import Constants from '../../constants';


export default function AddtoSetlistModal(props) {
  const [setlists, setSetlists] = useState([]);
  const [selectedSetlist, setSelectedSetlist] = useState({});
  const [tune, setTune] = useState({});
  const { tuneRowid, closeModal } = props;

  useEffect(() => {
    const loadData = async () => {
      try {
        const tune = await TuneRepository.get(tuneRowid);
        const setlists = await CollectionRepository.getCollectionsByType(Constants.CollectionTypes.SETLIST);
        setSetlists(setlists);
        setSelectedSetlist(setlists[0].rowid);
        setTune(tune);
      } catch (e) {
        Alert.alert('AddToSetlistModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  const addToSetlistOperation = async () => {
    try {
      await TuneRepository.addTuneToSetlist(tune, selectedSetlist);
      closeModal();
    } catch (e) {
      Alert.alert('Failed to add to setlist', `${e}`);
    }
  };

  return (
    <ModalContainer submit={addToSetlistOperation} cancel={closeModal} title="Add To Setlist">

      <Text style={ModalStyles.message}>
        Tune:
      </Text>
      <Text style={ModalStyles.infoItem}>
        {tune.Title}
      </Text>
      <Text style={ModalStyles.message}>
        Setlist:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Picker
          selectedValue={selectedSetlist}
          onValueChange={value => setSelectedSetlist(value)}
        >
          {setlists.map(setlist => <Picker.Item label={setlist.Name} value={setlist.rowid} key={setlist.rowid} />)}
        </Picker>
      </View>
    </ModalContainer>
  );
}

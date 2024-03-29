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

export default function MoveToCollectionModal(props) {
  const [tune, setTune] = useState({});
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState({});
  const { closeModal, tuneRowid } = props;

  // here, we could get collections from Redux? but selectedCollection here is actually a name used
  // in Redux but we wouldn't want to change it, it's not the same purpose. so should at least rename.

  useEffect(() => {
    const loadData = async () => {
      try {
        const tune = await TuneRepository.get(tuneRowid);
        const collections = await CollectionRepository.getCollectionsByType(Constants.CollectionTypes.COLLECTION);
        setTune(tune);
        setCollections(collections);
        setSelectedCollection(collections[0].rowid);
      } catch (e) {
        Alert.alert('MoveToCollectionModal error', `${e}`);
        closeModal();
      }
    };
    loadData();
  }, []);

  const moveToCollectionOperation = async () => {
    const { rowid } = tune;
    const tuneDelta = {
      rowid,
      Collection: selectedCollection
    };
    try {
      await TuneRepository.update(tuneDelta);
      closeModal();
    } catch (e) {
      Alert.alert('Failed to move to collection', `${e}`);
    }
  };

  return (
    <ModalContainer submit={moveToCollectionOperation} cancel={closeModal} title="Move To Collection">
      <Text style={ModalStyles.message}>
        Tune:
      </Text>
      <Text style={ModalStyles.infoItem}>
        {tune.Title}
      </Text>
      <Text style={ModalStyles.message}>
        Collection:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Picker
          selectedValue={selectedCollection}
          onValueChange={itemValue => setSelectedCollection(itemValue)}
        >
          {collections.map(collection => <Picker.Item label={collection.Name} value={collection.rowid} key={collection.rowid} />)}
        </Picker>
      </View>
    </ModalContainer>
  );
}

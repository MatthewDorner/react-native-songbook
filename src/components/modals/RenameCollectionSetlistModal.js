import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import {
  Text,
  Alert
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Constants from '../../constants';
import CollectionRepository from '../../data-access/collection-repository';
import Fonts from '../../styles/fonts';

export default function RenameCollectionSetlistModal(props) {
  const [name, setName] = useState('');
  const { item, closeModal } = props;
  const type = item.type === Constants.CollectionTypes.COLLECTION ? 'Collection' : 'Setlist';

  const renameCollectionSetlistOperation = async () => {
    const collectionDelta = {
      rowid: item.rowid,
      Name: name
    };
    try {
      await CollectionRepository.update(collectionDelta);
      closeModal();
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
        inputStyle={{ fontFamily: Fonts.default }}
      />
      <Text style={ModalStyles.infoItem}>
        {`${type} Name: ${item.Name}`}
      </Text>
    </ModalContainer>
  );
}

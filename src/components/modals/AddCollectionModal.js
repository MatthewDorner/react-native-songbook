import React, { useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  Text,
  Alert,
  View
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import CollectionRepository from '../../data-access/collection-repository';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../constants';
import Fonts from '../../styles/fonts';
import Colors from '../../styles/colors';

export default function AddCollectionModal(props) {
  const [name, setName] = useState('');
  const [importFilePath, setImportFilePath] = useState('');
  const [importFileName, setImportFilename] = useState('');
  const { closeModal } = props;

  const createCollectionOperation = async () => {
    try {
      if (name === '') {
        throw new Error('Name was blank');
      }
      const res = await CollectionRepository.insert({
        Name: name,
        Type: Constants.CollectionTypes.COLLECTION
      });

      if (importFilePath !== '') {
        let contents = await RNFS.readFile(importFilePath, 'ascii');
        contents = contents.replace(/\r/g, ''); // get weird errors if I don't do this

        const songsAdded = await DBOperations.importTuneBook(contents, res.insertId);
        Alert.alert('Imported Songbook Successfully', `Imported ${songsAdded} tunes.`);
      }
      closeModal();
    } catch (e) {
      Alert.alert('Failed to create collection', `${e}`);
    }
  };

  const pickFile = () => {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    }, (error, res) => {
      if (res && !(res.fileName.endsWith('.abc') || res.fileName.endsWith('.txt'))) {
        // test that this works
        Alert.alert('Please select a file of type .abc or .txt');
      } else if (error) {
        // there will be error if user backs out of picking file but don't want to
        // show an error message here
      } else {
        setImportFilePath(res.uri);
        setImportFilename(res.fileName);
        setName(res.fileName.substr(0, res.fileName.lastIndexOf('.')));
      }
    });
  };

  return (
    <ModalContainer submit={createCollectionOperation} cancel={closeModal} title="Add Collection">
      <Text style={ModalStyles.message}>
        Select an ABC file from your device storage or leave File blank to create an empty Collection:
      </Text>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={value => setName(value)}
        inputStyle={ModalStyles.input}
      />
      <View style={{ flexDirection: 'row' }}>
        <Button
          containerStyle={ModalStyles.browseButtonContainer}
          onPress={() => pickFile()}
          title="Browse"
          titleStyle={ModalStyles.browseButtonTitle}
        />
        <Text style={ModalStyles.fileInfoItem} numberOfLines={1}>
          {`File: ${importFileName}`}
        </Text>
      </View>
    </ModalContainer>
  );
}

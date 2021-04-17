import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  Text,
  Alert,
  View
} from 'react-native';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import DBOperations from '../../data-access/db-operations';
import Fonts from '../../styles/fonts';

export default function ImportIntoCollectionModal(props) {
  const [importFilePath, setImportFilePath] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const { closeModal, collection } = props;

  const importIntoCollectionOperation = async () => {
    try {
      if (importFilePath !== '') {
        let contents = await RNFS.readFile(importFilePath, 'ascii');
        contents = contents.replace(/\r/g, ''); // get weird errors if I don't do this

        const songsAdded = await DBOperations.importTuneBook(contents, collection.rowid);
        Alert.alert('Imported Songbook Successfully', `Imported ${songsAdded} tunes.`);
        closeModal();
      }
    } catch (e) {
      Alert.alert('Failed to import into collection:', `${e}`);
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
        setImportFileName(res.fileName);
      }
    });
  };

  return (
    <ModalContainer submit={importIntoCollectionOperation} cancel={closeModal} title="Import Into Collection">
      <Text style={ModalStyles.message}>
        Collection:
      </Text>
      <Text style={ModalStyles.infoItem}>
        {collection.Name}
      </Text>
      <Text style={ModalStyles.message}>
        Select an ABC songbook from your device storage:
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Button
          containerStyle={{ width: '30%' }}
          onPress={pickFile}
          title="Browse"
          titleStyle={{ fontFamily: Fonts.default, fontSize: 16, fontWeight: 'bold' }}
        />
        <Text style={ModalStyles.fileInfoItem} numberOfLines={1}>
          {`File: ${importFileName}`}
        </Text>
      </View>
    </ModalContainer>
  );
}

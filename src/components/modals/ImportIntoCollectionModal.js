import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  Text,
  Alert,
  View
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import DBOperations from '../../data-access/db-operations';

export default class AddCollectionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      importFilePath: '',
      importFileName: ''
    };

    this.importIntoCollectionOperation = this.importIntoCollectionOperation.bind(this);
    this.pickFile = this.pickFile.bind(this);
  }

  async importIntoCollectionOperation() {
    const { importFilePath, } = this.state;
    const { closeModal, queryDatabaseState, collection } = this.props;
    let contents = '';
    closeModal();

    try {
      if (importFilePath !== '') {
        contents = await RNFS.readFile(importFilePath, 'ascii');
        contents = contents.replace(/\r/g, ''); // get weird errors if I don't do this

        const songsAdded = await DBOperations.importTuneBook(contents, collection.rowid);
        Alert.alert('Imported Songbook Successfully', `Imported ${songsAdded} tunes.`);
        queryDatabaseState();
      }
    } catch (e) {
      Alert.alert('Failed to import into collection:', `${e}`);
    }
  }

  pickFile() {
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
        this.setState({
          importFilePath: res.uri,
          importFileName: res.fileName
        });
      }
    });
  }

  render() {
    const { closeModal, collection } = this.props;
    const { importFileName } = this.state;

    return (
      <AbstractModal submit={this.importIntoCollectionOperation} cancel={closeModal} title="Import Into Collection">

        <Text style={ModalStyles.message}>
          Select an ABC songbook from your device storage:
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Button
            containerStyle={{ width: '30%' }}
            onPress={() => this.pickFile()}
            title="Select a File"
          />
          <Text style={ModalStyles.fileInfoItem}>
            {`File: ${importFileName}`}
          </Text>
        </View>

        <Text style={ModalStyles.infoItem}>
          {`Collection Name: ${collection.Name}`}
        </Text>
      </AbstractModal>
    );
  }
}

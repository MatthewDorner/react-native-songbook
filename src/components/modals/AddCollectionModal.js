import React, { Component } from 'react';
import { Button, Input } from 'react-native-elements';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  Text,
  Alert,
  View
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../data-access/constants';


export default class AddCollectionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      importFilePath: '',
      importFileName: ''
    };

    this.createCollectionOperation = this.createCollectionOperation.bind(this);
    this.pickFile = this.pickFile.bind(this);
  }

  async createCollectionOperation() {
    const { name, importFilePath } = this.state;
    const { closeModal } = this.props;

    try {
      Database.addCollection(name, Constants.CollectionTypes.COLLECTION).then((res) => {
        if (importFilePath !== '') {
          RNFS.readFile(importFilePath, 'utf8').then((contents) => {
            DBOperations.importTuneBook(contents, res.insertId).then((songsAdded) => {
              Alert.alert('Imported Songbook Successfully', `Imported ${songsAdded} songs.`);
            });
          });
        }
        closeModal();
      });
    } catch (e) {
      Alert.alert(`Failed to create collection: ${e}`);
    }
  }

  pickFile() {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    }, (error, res) => {
      if (res && !(res.fileName.endsWith('.abc') || res.fileName.endsWith('.txt'))) {
        // test that this works
        Alert.alert('Please select a file of type .abc or .txt');
      } else if (!error) {
        this.setState({
          importFilePath: res.uri,
          importFileName: res.fileName
        });
      }
    });
  }

  render() {
    const { closeModal } = this.props;
    const { importFileName } = this.state;

    return (
      <AbstractModal submit={this.createCollectionOperation} cancel={closeModal} title="Add Collection">
        <Text style={ModalStyles.message}>
          Select an ABC tunebook from your device storage or leave File blank to create an empty Collection:
        </Text>
        <Input
          placeholder="Name"
          onChangeText={text => this.setState({ name: text })}
        />
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
      </AbstractModal>
    );
  }
}

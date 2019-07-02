import React, { Component } from 'react';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from "react-native-fs";
import AbstractModal from '../modals/AbstractModal';
import ModalStyles from '../../styles/modal-styles';
import ButtonStyles from '../../styles/button-styles';
import Database from '../../data-access/database';
import DBOperations from '../../data-access/db-operations';
import Constants from '../../logic/constants';

import {
  Text,
  TextInput,
  Alert,
  TouchableHighlight,
  View
} from 'react-native';

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
    try {
      Database.addCollection(this.state.name, Constants.CollectionTypes.COLLECTION).then((res) => {
        if (this.state.importFilePath != '') {
          RNFS.readFile(this.state.importFilePath, "utf8").then((contents) => {
            DBOperations.importTuneBook(contents, res.insertId).then((songsAdded) => {
              Alert.alert('Imported Songbook Successfully', 'Imported ' + songsAdded + ' songs.');
            });
          });
        }
        this.props.closeModal();
      }).catch((e) => {
        //console.log('failed to create collection, error was: ');
        //console.log(e);
      });
    } catch (e) {
      alert("exception in createCollection Operation" + e);
    }
  }

  pickFile() {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    },(error,res) => {
      if (!(res.fileName.endsWith('.abc') || res.fileName.endsWith('.txt'))) {
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
    return (
      <AbstractModal submit={this.createCollectionOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Add Collection</Text>

        <TextInput
          style={ModalStyles.nameInput}
          placeholder="Name"
          onChangeText={text => this.setState({ name: text })}
        />

        <Text style={ModalStyles.message}>
          Select an ABC tunebook from your device storage or leave File blank to create an empty Collection:
        </Text>

        <TouchableHighlight
          underlayColor="lightgray"
          onPress={() => this.pickFile()}
          style={ButtonStyles.pickFileButton}
        >
          <Text style={ButtonStyles.buttonTitle}>Select a File</Text>
        </TouchableHighlight>

        <View style={ModalStyles.infoContainer}>
          <Text style={ModalStyles.infoItem}>File: {this.state.importFileName}</Text>
        </View>
      </AbstractModal>
    );
  }
}

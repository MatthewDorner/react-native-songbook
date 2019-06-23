import React, { Component } from 'react';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from "react-native-fs";
import AbstractModal from './AbstractModal';
import ModalStyles from '../styles/modal-styles';
import Database from '../data-access/database';
import Constants from '../logic/constants';

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
        // res needs to contain the database obj with like the rowId...
        //console.log('back in addCollectionModal, the response for addCollection was: ');
        //console.log(res);

        if (this.state.importFilePath != '') {
          RNFS.readFile(this.state.importFilePath, "utf8").then((contents) => {
            // //console.log('got file contents: ');
            // //console.log(contents);
            Database.importTuneBook(contents, res.insertId).then((songsAdded) => {
              // alert that file was successfully imported?
              Alert.alert('Imported Songbook Successfully', 'Imported ' + songsAdded + ' songs.');
              // this.props.closeModal();
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
      if (!res.fileName.endsWith('.abc') || res.fileName.endsWith('.txt')) {
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
          Select an ABC songbook from your device storage or leave File blank to create an empty Collection:
        </Text>

        <TouchableHighlight
          underlayColor="lightgray"
          onPress={() => this.pickFile()}
          style={ModalStyles.modalButton}
        >
          <Text style={ModalStyles.modalButtonTitle}>Select a File</Text>
        </TouchableHighlight>

        <View style={ModalStyles.infoContainer}>
          {/* <Text style={ModalStyles.infoLabel}>File:</Text> */}
          <Text style={ModalStyles.infoItem}>File: {this.state.importFileName}</Text>
        </View>
      </AbstractModal>
    );
  }
}

import React, { Component } from 'react';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFS from "react-native-fs";
import AbstractModal from './AbstractModal';
import ModalStyles from '../styles/modal-styles';

import {
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

export default class DeleteSetlistModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      importFilePath: '',
      importFileName: ''
    };

    this.createSetlistOperation = this.createSetlistOperation.bind(this);
  }

  createSetlistOperation() {
    //console.log('doing whatever here. the setlist name will be: ');
    //console.log(this.refs.name);
  }

  render() {
    return (
      <AbstractModal submit={this.createSetlistOperation} cancel={this.props.closeModal}>
        <Text style={ModalStyles.title}>Delete Setlist</Text>

        <TextInput
          // onSubmitEditing={() => this.props.onSearch(this.refs.search_box.value, { rhythm: this.state.rhythmFilter, key: this.state.keyFilter })}
          style={ModalStyles.nameInput}
          placeholder="Name"
          ref="name"
          // onChangeText={text => this.setState({ rhythmFilter: text })}
        />

        <Text style={ModalStyles.message}>
          Songs in the setlist will not be deleted as they reside in their collection.
        </Text>

      </AbstractModal>
    );
  }
}

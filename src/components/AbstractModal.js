import React, { Component } from 'react';
import ModalStyles from '../styles/modal-styles';

import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ScrollView
} from 'react-native';

export default class AddCollectionModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <ScrollView style={ModalStyles.modalContainer}>
          {this.props.children}
          <View style={ModalStyles.modalFooter}>

            <TouchableHighlight
              underlayColor="lightgray"
              style={ModalStyles.modalButton}
              onPress={() => this.props.submit()}
            >
              <Text style={ModalStyles.modalButtonTitle}>Submit</Text>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor="lightgray"
              style={ModalStyles.modalButton}
              onPress={() => this.props.cancel()}
            >
              <Text style={ModalStyles.modalButtonTitle}>Cancel</Text>
            </TouchableHighlight>

          </View>
        </ScrollView>
    );
  }
}

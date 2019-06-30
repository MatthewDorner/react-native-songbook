import React, { Component } from 'react';
import ModalStyles from '../styles/modal-styles';
import ButtonStyles from '../styles/button-styles';

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
    let buttons = [];

    // if props.close is passed, override the default "submit / cancel" controls with just "close"
    if (this.props.submit) {
      buttons = [
        <TouchableHighlight
        underlayColor="lightgray"
        style={ButtonStyles.button}
        onPress={() => this.props.submit()}
        key="submit"
      >
        <Text style={ButtonStyles.buttonTitle}>Submit</Text>
      </TouchableHighlight>,

      <TouchableHighlight
        underlayColor="lightgray"
        style={ButtonStyles.button}
        onPress={() => this.props.cancel()}
        key="cancel"
      >
        <Text style={ButtonStyles.buttonTitle}>Cancel</Text>
      </TouchableHighlight>
      ];
    } else {
      buttons = [
        <TouchableHighlight
        underlayColor="lightgray"
        style={ButtonStyles.button}
        onPress={() => this.props.close()}
        key="close"
      >
        <Text style={ButtonStyles.buttonTitle}>Close</Text>
      </TouchableHighlight>
      ];
    }

    return (
        <ScrollView contentContainerStyle={ModalStyles.modalContainer}>
          {this.props.children}
          <View style={ModalStyles.modalFooter}>

            {buttons}

          </View>
        </ScrollView>
    );
  }
}

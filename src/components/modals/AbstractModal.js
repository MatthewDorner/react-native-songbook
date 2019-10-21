import React from 'react';
import {
  TouchableHighlight,
  Text,
  View,
  ScrollView
} from 'react-native';
import ModalStyles from '../../styles/modal-styles';
import ButtonStyles from '../../styles/button-styles';

export default function AbstractModal({ submit, cancel, close, children }) {
  let buttons = [];

  // if props.close is passed, override the default "submit / cancel" controls with just "close"
  if (submit) {
    buttons = [
      <TouchableHighlight
        underlayColor="lightgray"
        style={ButtonStyles.button}
        onPress={() => submit()}
        key="submit"
      >
        <Text style={ButtonStyles.buttonTitle}>Submit</Text>
      </TouchableHighlight>,

      <TouchableHighlight
        underlayColor="lightgray"
        style={ButtonStyles.button}
        onPress={() => cancel()}
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
        onPress={() => close()}
        key="close"
      >
        <Text style={ButtonStyles.buttonTitle}>Close</Text>
      </TouchableHighlight>
    ];
  }

  return (
    <ScrollView contentContainerStyle={ModalStyles.modalContainer}>
      {children}
      <View style={ModalStyles.modalFooter}>
        {buttons}
      </View>
    </ScrollView>
  );
}

import React from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import { Button } from 'react-native-elements';
import ModalStyles from '../../styles/modal-styles';
import Colors from '../../styles/colors';

export default function ModalContainer({ submit, cancel, close, children, title }) {
  let buttons = [];

  // these buttons are all identical, it should just render whichever ones are given,
  // or let you specify an arbitrary number of button callbacks and button titles??

  if (submit && cancel) {
    buttons = [
      <Button
        onPress={() => submit()}
        containerStyle={{ width: 130 }}
        key="submit"
        title="submit"
        buttonStyle={{ backgroundColor: Colors.modalButtonBackground, marginBottom: 40 }}
      />,
      <Button
        onPress={() => cancel()}
        containerStyle={{ width: 130 }}
        key="cancel"
        title="cancel"
        buttonStyle={{ backgroundColor: Colors.modalButtonBackground, marginBottom: 40 }}
      />
    ];
  } else if (close) {
    buttons = [
      <Button
        onPress={() => close()}
        containerStyle={{ width: 120, marginBottom: 40 }}
        key="close"
        title="close"
        buttonStyle={{ backgroundColor: Colors.modalButtonBackground }}
      />
    ];
  }

  return (
    <View style={ModalStyles.modalContainer}>
      <ScrollView contentContainerStyle={ModalStyles.modalScrollContainer}>
        <View style={ModalStyles.modalHeader}>
          <Text style={ModalStyles.title}>{title}</Text>
        </View>
        <View style={ModalStyles.modalBody}>
          {children}
        </View>
      </ScrollView>
      <View style={ModalStyles.modalFooter}>
        {buttons}
      </View>
    </View>
  );
}

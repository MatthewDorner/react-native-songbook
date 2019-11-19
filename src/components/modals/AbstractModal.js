import React from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import { Button } from 'react-native-elements';
import ModalStyles from '../../styles/modal-styles';

export default function AbstractModal({ submit, cancel, close, children, title }) {
  let buttons = [];

  // if props.close is passed, override the default "submit / cancel" controls with just "close"
  if (submit) {
    buttons = [
      <Button
        onPress={() => submit()}
        containerStyle={{ width: 130 }}
        key="submit"
        title="submit"
        buttonStyle={{ backgroundColor: 'gray' }}
      />,
      <Button
        onPress={() => cancel()}
        containerStyle={{ width: 130 }}
        key="cancel"
        title="cancel"
        buttonStyle={{ backgroundColor: 'gray' }}
      />
    ];
  } else {
    buttons = [
      <Button
        onPress={() => close()}
        containerStyle={{ width: 120 }}
        key="close"
        title="close"
        buttonStyle={{ backgroundColor: 'gray' }}
      />
    ];
  }

  return (
    <ScrollView contentContainerStyle={ModalStyles.modalContainer}>
      <View style={ModalStyles.modalHeader}>
        <Text style={ModalStyles.title}>{title}</Text>
      </View>
      <View style={ModalStyles.modalBody}>
        {children}
      </View>
      <View style={ModalStyles.modalFooter}>
        {buttons}
      </View>
    </ScrollView>
  );
}

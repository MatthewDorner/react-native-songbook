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
  if (!close) {
    buttons = [
      <Button
        onPress={() => submit()}
        containerStyle={{ width: 130 }}
        key="submit"
        title="submit"
        buttonStyle={{ backgroundColor: 'gray', marginBottom: 40 }}
      />,
      <Button
        onPress={() => cancel()}
        containerStyle={{ width: 130 }}
        key="cancel"
        title="cancel"
        buttonStyle={{ backgroundColor: 'gray', marginBottom: 40 }}
      />
    ];
  } else {
    buttons = [
      <Button
        onPress={() => close()}
        containerStyle={{ width: 120, marginBottom: 40 }}
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

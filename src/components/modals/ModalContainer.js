import React from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import { Button } from 'react-native-elements';
import ModalStyles from '../../styles/modal-styles';
import Colors from '../../styles/colors';
import Fonts from '../../styles/fonts';

export default function ModalContainer({ submit, cancel, close, children, title }) {
  let buttons = [];

  if (submit && cancel) {
    buttons = (
      <>
        <Button
          onPress={() => cancel()}
          title="cancel"
          type="outline"
          titleStyle={{ fontFamily: Fonts.default, fontSize: 16, color: Colors.modalButtonTitle }}
          buttonStyle={ModalStyles.modalButton}
        />
        <Button
          onPress={() => submit()}
          title="submit"
          type="outline"
          titleStyle={{ fontFamily: Fonts.default, fontSize: 16, color: Colors.modalButtonTitle }}
          buttonStyle={ModalStyles.modalButton}
        />
      </>
    );
  } else if (close) {
    buttons = (
      <Button
        onPress={() => close()}
        title="close"
        type="outline"
        titleStyle={{ fontFamily: Fonts.default, fontSize: 16, color: Colors.modalButtonTitle }}
        buttonStyle={ModalStyles.modalButton}
      />
    );
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

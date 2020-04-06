/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import {
  Text,
  View,
  Picker,
} from 'react-native';
import Slider from '@react-native-community/slider';
import ModalContainer from './ModalContainer';
import ModalStyles from '../../styles/modal-styles';
import Constants from '../../constants';

export default function OptionsModal(props) {
  const [zoom, setZoom] = useState(props.zoom);
  const [tabsVisibility, setTabsVisibility] = useState(props.tabsVisibility);
  const [tuning, setTuning] = useState(props.tuning);
  const [playMode, setPlaymode] = useState(props.playMode);
  const { closeModal, updateOptions } = props;

  async function saveOptionsOperation() {
    closeModal();
    updateOptions(tabsVisibility, zoom, tuning, playMode);
  }

  return (
    <ModalContainer submit={saveOptionsOperation} cancel={closeModal} title="Options">
      <Text style={ModalStyles.message}>
        Tabs Visibility:
      </Text>
      <Text style={ModalStyles.pickerContainer}>
        <Picker
          style={ModalStyles.modalPicker}
          selectedValue={tabsVisibility}
          onValueChange={value => setTabsVisibility(value)}
        >
          <Picker.Item label="Show" value={1} key="show" />
          <Picker.Item label="Hide" value={0} key="hide" />
        </Picker>
      </Text>
      <Text style={ModalStyles.message}>
        Tuning:
      </Text>
      <Text style={ModalStyles.pickerContainer}>
        <Picker
          style={ModalStyles.modalPicker}
          selectedValue={tuning}
          onValueChange={value => setTuning(value)}
        >
          {Object.keys(Constants.Tunings).map(key => (
            <Picker.Item label={key} value={key} key={key} />
          ))}
        </Picker>
      </Text>
      <Text style={ModalStyles.message}>
        Play Mode:
      </Text>
      <Text style={ModalStyles.pickerContainer}>
        <Picker
          style={ModalStyles.modalPicker}
          selectedValue={playMode}
          onValueChange={value => setPlaymode(value)}
        >
          <Picker.Item label="Melody and Chords" value={Constants.PlayModes.CHORDS_AND_MELODY} key={Constants.PlayModes.CHORDS_AND_MELODY} />
          <Picker.Item label="Chords Only" value={Constants.PlayModes.CHORDS_ONLY} key={Constants.PlayModes.CHORDS_AND_MELODY} />
          <Picker.Item label="Melody Only" value={Constants.PlayModes.MELODY_ONLY} key={Constants.PlayModes.CHORDS_AND_MELODY} />
        </Picker>
      </Text>
      <Text style={ModalStyles.message}>
        Zoom:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Slider
          style={{ alignSelf: 'stretch' }}
          step={5}
          onValueChange={value => setZoom(value)}
          value={zoom}
          minimumValue={30}
          maximumValue={70}
          minimumTrackTintColor="darkgray"
          maximumTrackTintColor="gray"
        />
      </View>
    </ModalContainer>
  );
}

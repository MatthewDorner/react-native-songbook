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
import Colors from '../../styles/colors';

export default function OptionsModal(props) {
  const [zoom, setZoom] = useState(props.zoom);
  const [tabsVisibility, setTabsVisibility] = useState(props.tabsVisibility);
  const [tuning, setTuning] = useState(props.tuning);
  const [playMode, setPlaymode] = useState(props.playMode);
  const [playbackSpeed, setPlaybackSpeed] = useState(props.playbackSpeed);
  const { closeModal, updateOptions } = props;

  async function saveOptionsOperation() {
    closeModal();
    updateOptions(tabsVisibility, zoom, tuning, playMode, playbackSpeed);
  }

  /*
    TODO: Add option for playback speed. just normal, slow, slower?
    TODO: Also, the stuff is still too small with the "default" screen size
    on a 10-inch tablet. not sure if can be handled without.. explicitly
    multiplying all the dimensions according to a factor based on the detected
    screen size or resolution or something? what determines the 'default' screen
    size for a device?
    TODO: Get better samples
  */

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
        Tabs Tuning:
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
        Playback Mode:
      </Text>
      <Text style={ModalStyles.pickerContainer}>
        <Picker
          style={ModalStyles.modalPicker}
          selectedValue={playMode}
          onValueChange={value => setPlaymode(value)}
        >
          <Picker.Item label="Melody and Chords" value={Constants.PlayModes.MELODY_AND_CHORDS} />
          <Picker.Item label="Chords Only" value={Constants.PlayModes.CHORDS_ONLY} />
          <Picker.Item label="Melody Only" value={Constants.PlayModes.MELODY_ONLY} />
        </Picker>
      </Text>

      <Text style={ModalStyles.message}>
        Playback Speed:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Slider
          style={{ alignSelf: 'stretch' }}
          step={2}
          onValueChange={value => setPlaybackSpeed(value)}
          value={playbackSpeed}
          minimumValue={10}
          maximumValue={90}
          minimumTrackTintColor={Colors.sliderMin}
          maximumTrackTintColor={Colors.sliderMax}
          thumbTintColor={Colors.sliderThumb}
        />
      </View>

      <Text style={ModalStyles.message}>
        Zoom:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Slider
          style={{ alignSelf: 'stretch' }}
          step={2}
          onValueChange={value => setZoom(value)}
          value={zoom}
          minimumValue={30}
          maximumValue={70}
          minimumTrackTintColor={Colors.sliderMin}
          maximumTrackTintColor={Colors.sliderMax}
          thumbTintColor={Colors.sliderThumb}
        />
      </View>
    </ModalContainer>
  );
}

/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import {
  Text,
  View,
  Picker
} from 'react-native';
import Slider from '@react-native-community/slider';
import { AbcjsVexFlowRenderer } from 'abcjs-vexflow-renderer';
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
  const { closeModal, updateTuneOptions, updateAudioOptions } = props;

  async function saveOptionsOperation() {
    closeModal();
    updateTuneOptions(tabsVisibility, zoom, tuning);
    updateAudioOptions(playMode, playbackSpeed);
  }

  return (
    <ModalContainer submit={saveOptionsOperation} cancel={closeModal} title="Options">
      <Text style={ModalStyles.optionLabel}>
        Tabs Visibility:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Picker
          selectedValue={tabsVisibility}
          onValueChange={value => setTabsVisibility(value)}
        >
          <Picker.Item label="Show" value={1} key="show" />
          <Picker.Item label="Hide" value={0} key="hide" />
        </Picker>
      </View>
      <Text style={ModalStyles.optionLabel}>
        Tabs Tuning:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Picker
          selectedValue={tuning}
          onValueChange={value => setTuning(value)}
        >
          {Object.keys(AbcjsVexFlowRenderer.TUNINGS).map(key => (
            <Picker.Item label={AbcjsVexFlowRenderer.TUNINGS[key].displayName} value={key} key={key} />
          ))}
        </Picker>
      </View>
      <Text style={ModalStyles.optionLabel}>
        Playback Mode:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Picker
          selectedValue={playMode}
          onValueChange={value => setPlaymode(value)}
        >
          <Picker.Item label="Melody and Chords" value={Constants.PlayModes.MELODY_AND_CHORDS} />
          <Picker.Item label="Chords Only" value={Constants.PlayModes.CHORDS_ONLY} />
          <Picker.Item label="Melody Only" value={Constants.PlayModes.MELODY_ONLY} />
        </Picker>
      </View>

      <Text style={ModalStyles.optionLabel}>
        Playback Speed:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Slider
          style={{ alignSelf: 'stretch' }}
          step={1}
          onValueChange={value => setPlaybackSpeed(value)}
          value={playbackSpeed}
          minimumValue={-50}
          maximumValue={90}
          minimumTrackTintColor={Colors.sliderMin}
          maximumTrackTintColor={Colors.sliderMax}
          thumbTintColor={Colors.sliderThumb}
        />
      </View>

      <Text style={ModalStyles.optionLabel}>
        Zoom:
      </Text>
      <View style={ModalStyles.pickerContainer}>
        <Slider
          style={{ alignSelf: 'stretch' }}
          step={1}
          onValueChange={value => setZoom(value)}
          value={zoom}
          minimumValue={35}
          maximumValue={85}
          minimumTrackTintColor={Colors.sliderMin}
          maximumTrackTintColor={Colors.sliderMax}
          thumbTintColor={Colors.sliderThumb}
        />
      </View>
    </ModalContainer>
  );
}

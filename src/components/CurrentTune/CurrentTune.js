import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  View,
  Modal,
  Picker
} from 'react-native';

import Fonts from '../../styles/fonts';
import AudioPlayer from '../AudioPlayer';
import VexFlowScore from '../VexFlowScore';
import DetailsModal from '../modals/DetailsModal';
import OptionsModal from '../modals/OptionsModal';

export default class CurrentTune extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      modalContents: <View />,
    };

    Dimensions.addEventListener('change', (e) => {
      const { width, height } = e.window;
      const { setDimensions } = this.props;
      setDimensions({ width, height });
    });

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    const { refreshAudioOptions } = this.props;
    await refreshAudioOptions();
  }

  showModal(action) {
    const { rowid, updateTuneOptions, updateAudioOptions, tabsVisibility, zoom, tuning, playMode, playbackSpeed } = this.props;
    let modalToShow;
    switch (action) {
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tuneRowid={rowid} />;
        break;
      case 'options':
        modalToShow = <OptionsModal closeModal={() => this.closeModal()} updateTuneOptions={updateTuneOptions} updateAudioOptions={updateAudioOptions} tabsVisibility={tabsVisibility} zoom={zoom} tuning={tuning} playMode={playMode} playbackSpeed={playbackSpeed} />;
        break;
      default:
        return;
    }

    this.setState({
      modalContents: modalToShow,
      modalVisible: true
    });
  }

  closeModal() {
    this.setState({
      modalVisible: false
    });
  }

  render() {
    const { modalVisible, modalContents } = this.state;
    const { height, width, tabsVisibility, zoom, tuning, tune, title, loading } = this.props;

    let content;
    if (loading === false && tune) {
      content = (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <AudioPlayer
                currentTuneTune={tune}
                showControls
              />
            </View>
            <View style={styles.headerCenter}>
              <Text style={styles.title}>
                {title}
              </Text>
              <Picker
                style={styles.titlePicker}
                onValueChange={(itemValue) => {
                  this.showModal(itemValue);
                }}
              >
                <Picker.Item label="Cancel" value="cancel" />
                <Picker.Item label="Details" value="details" />
                <Picker.Item label="Options" value="options" />
              </Picker>
            </View>
            <View style={styles.headerRight} />
          </View>
          <VexFlowScore
            tune={tune}
            dimHeight={height}
            dimWidth={width}
            tabsVisibility={tabsVisibility}
            zoom={zoom}
            tuning={tuning}
          />
        </>
      );
    } else if (loading === false) {
      // so the user can play audio from browser before any tune has been loaded
      content = [
        <AudioPlayer
          key="audioPlayer"
          showControls={false}
        />
      ];
    } else {
      content = (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={styles.title}>
            Please Wait...
          </Text>
        </View>
      );
    }

    return (
      <ScrollView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
        >
          {modalContents}
        </Modal>
        {content}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginLeft: '5%',
    marginRight: '5%',
  },

  // all inside headerContainer
  headerLeft: {
    flex: 1,
    minWidth: 27,
  },
  headerCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexShrink: 1,
  },
  headerRight: {
    flex: 1,
  },

  // both inside headerCenter
  title: {
    maxWidth: '85%',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: Fonts.default,
    textDecorationLine: 'underline',
  },
  titlePicker: {
    height: 50,
    width: 30,
  },
});

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  Picker,
  View,
  Modal,
  ImageBackground,
} from 'react-native';
import VexFlowScore from '../VexFlowScore';
import AudioPlayer from '../AudioPlayer';
import DetailsModal from '../modals/DetailsModal';
import OptionsModal from '../modals/OptionsModal';

const paperImage = require('./grey-paper-texture.jpg');

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
    this.closeModal = this.closeModal.bind(this); // is necessary?
  }

  showModal(action) {
    const { rowid, updateOptions, tabsVisibility, zoom, tuning, playMode } = this.props;
    let modalToShow;
    switch (action) {
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tuneRowid={rowid} />;
        break;
      case 'options':
        modalToShow = <OptionsModal closeModal={() => this.closeModal()} updateOptions={updateOptions} tabsVisibility={tabsVisibility} zoom={zoom} tuning={tuning} playMode={playMode} />;
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
    const {
      modalVisible, modalContents
    } = this.state;
    const { height, width, tabsVisibility, zoom, tuning, tune, title, loading, playMode } = this.props;

    let content;
    if (loading === false) {
      content = [
        <View style={styles.contentContainer} key="contentContainer">
          <Text style={styles.title}>
            {title}
          </Text>
          <Picker
            style={{ height: 50, width: 30 }}
            onValueChange={(itemValue) => {
              this.showModal(itemValue);
            }}
          >
            <Picker.Item label="Cancel" value="cancel" />
            <Picker.Item label="Details" value="details" />
            <Picker.Item label="Options" value="options" />
          </Picker>
          <AudioPlayer
            tune={tune}
            playMode={playMode}
          />
        </View>,
        <VexFlowScore
          tune={tune}
          dimHeight={height}
          dimWidth={width}
          tabsVisibility={tabsVisibility}
          zoom={zoom}
          tuning={tuning}
          key="vexflowscore"
        />,
      ];
    } else if (tune) { // tune is loaded but loading is also true, meaning another tune is being loaded
      content = [
        <View style={styles.contentContainer} key="contentContainer">
          <Text style={styles.title}>
            Please Wait...
          </Text>
        </View>
      ];
    } else { // nothing is loaded, app is just started, so leave blank
      content = [];
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
        <ImageBackground source={paperImage} style={styles.background} resizeMethod="scale" resizeMode="stretch">
          {content}
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row'
  },
  title: {
    maxWidth: '85%',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

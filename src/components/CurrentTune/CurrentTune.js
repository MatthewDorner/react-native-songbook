import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  Picker,
  View,
  Modal,
} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import Colors from '../../styles/colors';
import Fonts from '../../styles/fonts';

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
    this.closeModal = this.closeModal.bind(this); // is necessary?
  }

  showModal(action) {
    const { rowid, updateOptions, tabsVisibility, zoom, tuning, playMode, playbackSpeed } = this.props;
    let modalToShow;
    switch (action) {
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tuneRowid={rowid} />;
        break;
      case 'options':
        modalToShow = <OptionsModal closeModal={() => this.closeModal()} updateOptions={updateOptions} tabsVisibility={tabsVisibility} zoom={zoom} tuning={tuning} playMode={playMode} playbackSpeed={playbackSpeed} />;
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
    const { height, width, tabsVisibility, zoom, tuning, tune, title, loading, toggleCurrentTunePlayback, playing } = this.props;

    let content;
    if (loading === false && tune) {
      content = (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <Button
                containerStyle={styles.playButtonContainer}
                buttonStyle={styles.playButtonButton}
                onPress={() => toggleCurrentTunePlayback()}
                icon={(
                  <Icon
                    name={playing ? 'controller-stop' : 'controller-play'}
                    size={18}
                    color={Colors.playButtonIcon}
                  />
                )}
              />
            </View>
            <View style={styles.headerCenter}>
              {/* <View style={{ width: 17, height: 30, flexShrink: 1 }} /> */}
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
      content = [];
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

  // both inside headerLeft
  playButtonContainer: {
    marginTop: 11.5,
    marginRight: 'auto',
  },
  playButtonButton: {
    padding: 0,
    backgroundColor: Colors.playButtonBackground,
    height: 27,
    width: 27,
  }
});

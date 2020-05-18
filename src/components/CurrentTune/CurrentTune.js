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
    const { height, width, tabsVisibility, zoom, tuning, tune, title, loading, togglePlayback } = this.props;

    let content;
    if (loading === false) {
      content = [
        <View style={styles.headerContainer} key="headerContainer">
          <View style={styles.titleContainer} key="titleContainer">
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
          </View>
          <Button
            containerStyle={styles.playButtonContainer}
            buttonStyle={styles.playButtonButton}
            onPress={() => { togglePlayback({ tune }); }}
            title="P"
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
      <ScrollView style={styles.scrollViewContainer}>
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

// WANT TO CENTER THE ACTUAL TITLE, AND MAKE THE PICKER JUST
// STICK TO THE RIGHT SIDE OF THE TITLE.
// https://stackoverflow.com/questions/36008969/how-to-justify-left-right-center-each-child-independently

// OR, just make the picker stick to the right of the title and
// the play button stick to the right of the picker

const styles = StyleSheet.create({
  background: { // get rid of this... no background will look good
    flex: 1,
    // justifyContent: 'center',
  },
  headerContainer: {
    // flexDirection: 'row',
  },
  titleContainer: {
    // alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row'
  },
  title: {
    // maxWidth: '85%',
    maxWidth: '65%',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: Fonts.default,
  },
  playButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  playButtonButton: {
    backgroundColor: Colors.playButtonBackground,
    height: 27,
    width: 27,
  }
});

import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  Picker,
  View,
  Modal
} from 'react-native';
import VexFlowScore from './VexFlowScore';
import DetailsModal from './modals/DetailsModal';
import OptionsModal from './modals/OptionsModal';

export default class CurrentTune extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waiting: false,
      dimWidth: Dimensions.get('window').width,
      dimHeight: Dimensions.get('window').height,
      tabsVisibility: true,
      modalVisible: false,
      modalContents: <View />,
      tune: {
        Title: '',
        Tune: ''
      }
    };

    Dimensions.addEventListener('change', (e) => {
      const { width, height } = e.window;
      this.setState({
        dimWidth: width,
        dimHeight: height,
        waiting: true
      }, () => {
        setTimeout(() => {
          this.setState({ waiting: false });
        }, 1);
      });
    });

    props.tuneChangeCallback.setCallback((tune) => {
      this.setState({ waiting: true }, () => {
        setTimeout(() => {
          Navigation.mergeOptions('CurrentTune', {
            bottomTabs: {
              currentTabIndex: 0
            }
          });
          this.setState({ tune, waiting: false });
        }, 1); // timeout to allow it to render the wait message
      });
    });

    this.showModal = this.showModal.bind(this);
    this.setTabsVisibility = this.setTabsVisibility.bind(this);
  }

  setTabsVisibility(value) {
    this.setState({
      tabsVisibility: value
    }, () => {
      this.closeModal();
    });
  }

  showModal(action) {
    const { tune } = this.state;
    let modalToShow;
    switch (action) {
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tune={tune} />;
        break;
      case 'options':
        modalToShow = <OptionsModal closeModal={() => this.closeModal()} setTabsVisibility={this.setTabsVisibility} prevTabsVisibility={this.state.tabsVisibility} />;
        break;
      default:
        return;
    }

    this.setState({
      modalContents: modalToShow
    }, () => {
      this.setState({
        modalVisible: true
      });
    });
  }

  closeModal() {
    this.setState({
      modalVisible: false
    });
  }

  render() {
    const {
      waiting, tune, dimHeight, dimWidth, tabsVisibility, modalVisible, modalContents
    } = this.state;

    // WHY IS THIS RUNNING WHEN I OPEN UP A COLLECTION IN THE OTHER TAB!!!!!
    let content;
    if (waiting === false) {
      if (tune.Tune) {
        content = [
          <View style={{ marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }} key="title">
            <Text style={styles.title}>
              {tune.Title}
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
          </View>,
          // tune={tune.Tune} is really not ideal here
          <VexFlowScore tune={tune.Tune} dimHeight={dimHeight} dimWidth={dimWidth} tabsVisibility={tabsVisibility} key="vexflowscore" />,
        ];
      } else {
        content = [];
      }
    } else {
      content = [
        <Text style={styles.title} key="title">
          Please Wait...
        </Text>
      ];
    }

    return (
      <ScrollView>
        <Modal
          style={styles.modal}
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
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

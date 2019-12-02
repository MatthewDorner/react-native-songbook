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
import Database from '../data-access/database';

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
      const { dimWidth, dimHeight } = this.state;
      if (Math.round(dimWidth) === Math.round(width) && Math.round(dimHeight) === Math.round(height)) {
        return;
      }

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

    props.tuneChangeCallback.setCallback((tuneRowid) => {
      this.setState({ waiting: true }, () => {
        setTimeout(() => {
          Navigation.mergeOptions('CurrentTune', {
            bottomTabs: {
              currentTabIndex: 0
            }
          });
          Database.getWholeTune(tuneRowid).then((res) => {
            this.setState({ tune: res, waiting: false });
          });
        }, 1); // timeout to allow it to render the wait message
      });
    });

    this.showModal = this.showModal.bind(this);
    this.setTabsVisibility = this.setTabsVisibility.bind(this);
  }

  setTabsVisibility(value) {
    this.closeModal();
    this.setState({ waiting: true }, () => {
      setTimeout(() => {
        this.setState({
          waiting: false,
          tabsVisibility: value
        });
      }, 1);
    });
  }

  showModal(action) {
    const { tune } = this.state;
    let modalToShow;
    switch (action) {
      case 'details':
        modalToShow = <DetailsModal closeModal={() => this.closeModal()} tuneRowid={tune.rowid} />;
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

    let content;
    if (waiting === false) {
      if (tune.Tune) {
        content = [
          <View style={styles.contentContainer} key="contentContainer">
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
          <VexFlowScore tune={tune.Tune} dimHeight={dimHeight} dimWidth={dimWidth} tabsVisibility={tabsVisibility} key="vexflowscore" />,
        ];
      } else {
        content = [];
      }
    } else {
      content = [
        <View style={styles.contentContainer} key="contentContainer">
          <Text style={styles.title}>
            Please Wait...
          </Text>
        </View>
      ];
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

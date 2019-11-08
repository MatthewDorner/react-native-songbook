import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  Text,
  Dimensions,
  ScrollView
} from 'react-native';
import VexFlowScore from './VexFlowScore';
import TuneAttributes from './TuneAttributes';

export default class CurrentTune extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waiting: false,
      dimWidth: Dimensions.get('window').width,
      dimHeight: Dimensions.get('window').height,
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
  }


  render() {
    const {
      waiting, tune, dimHeight, dimWidth
    } = this.state;

    // WHY IS THIS RUNNING WHEN I OPEN UP A COLLECTION IN THE OTHER TAB!!!!!
    console.log(`in render of currentTune, waiting was: ${waiting}`);
    let content;
    if (waiting === false) {
      content = [
        <Text style={styles.title} key="welcome">
          {tune.Title}
        </Text>,
        // tune={tune.Tune} is really not ideal here
        <VexFlowScore tune={tune.Tune} dimHeight={dimHeight} dimWidth={dimWidth} key="vexflowscore" />,
        <TuneAttributes tune={tune.Tune} />
      ];
    } else {
      content = [
        <Text style={styles.title} key="welcome">
          PLEASE WAIT...
        </Text>
      ];
    }

    return (
      <ScrollView>
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

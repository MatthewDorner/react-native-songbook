import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  Text,
  Dimensions,
  ScrollView
} from 'react-native';
import VexFlowScore from './VexFlowScore';

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
          this.setState({waiting: false});
        }, 1);
      });
    });

    props.tuneChangeCallback.setCallback((tune) => {
      console.log('in tuneChangeCallack');
      this.setState({ waiting: true }, () => {
        setTimeout(() => {
          console.log('in tuneChangeCallback, setState callback');
          Navigation.mergeOptions('CurrentTune', {
            bottomTabs: {
              currentTabIndex: 0
            }
          });
          console.log('going to set state waiting to false');
          this.setState({ tune: tune, waiting: false });
        }, 1); // timeout to allow it to render the wait message
      });
    });
  }


  render() {
    // WHY IS THIS RUNNING WHEN I OPEN UP A COLLECTION IN THE OTHER TAB!!!!!
    console.log('in render of currentTune, waiting was: ' + this.state.waiting);
    let content;
    if (this.state.waiting == false) {
      content = [
        <Text style={styles.welcome} key='welcome'>
          {this.state.tune.Title}
        </Text>,
        <VexFlowScore tune={this.state.tune.Tune} dimHeight={this.state.dimHeight} dimWidth={this.state.dimWidth} key='vexflowscore'/>
      ];
    } else {
      content = [
        <Text style={styles.welcome} key='welcome'>
          PLEASE WAIT...
        </Text>
      ];
    }

    console.log('content was: ');
    console.log(content);

    return (
      <ScrollView>
        {content}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

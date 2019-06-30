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
        dimHeight: height
      });
    });

    props.tuneChangeCallback.setCallback((tune) => {
      Navigation.mergeOptions('CurrentTune', {
        bottomTabs: {
          currentTabIndex: 0
        }
      });
      this.setState({ tune });
    });
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.welcome}>
          {this.state.tune.Title}
        </Text>
        <VexFlowScore tune={this.state.tune.Tune} dimHeight={this.state.dimHeight} dimWidth={this.state.dimWidth} />
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

import React, { Component } from 'react';
import VexFlowScore from './VexFlowScore';

import {
  StyleSheet,
  Text,
  Dimensions,
  ScrollView
} from 'react-native';

export default class CurrentTune extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dimensions: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
      },
      tune: props.tune // eventually initialize this somehow else (to empty) instead of passing in from index.js
    };

    Dimensions.addEventListener('change', (e) => {
      const { width, height } = e.window;
      console.log('width and height: ' + width, ', ' + height);
      this.setState({
        dimensions: {
          width: width,
          height: height
        }
      });
    });

    props.tuneChangeCallback.setCallback((tune) => {
      this.setState({
        tune: tune
      });
    });
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.welcome}>
          {this.state.tune.Title}
        </Text>
        <VexFlowScore tune={this.state.tune.Tune} dimensions={this.state.dimensions}></VexFlowScore>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

import React, { Component } from 'react';
import VexFlowScore from './VexFlowScore';

import {
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';

export default class CurrentTune extends Component {
  constructor(props) {
    super(props);
    // this.getTuneName = this.getTuneName.bind(this);
  }

  // getTuneName(abcString) {
  //   let lines = abcString.split('\n');
  //   let meterLine = lines.filter((line) => {
  //       return line.charAt(0) == "T";
  //   });
  //   return meterLine[0].slice(2, meterLine[0].length).trim();
  // }

  render() {
    return (
      <ScrollView>
        <Text style={styles.welcome}>
          {this.props.tune.Title}
        </Text>
        <VexFlowScore tune={this.props.tune.Tune}></VexFlowScore>
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

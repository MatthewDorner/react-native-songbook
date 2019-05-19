import React, { PureComponent } from 'react';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import VexUtils from '../vex-utils';
import ABCJS from 'abcjs';
import Tune from '../tune';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from 'react-native';

export default class VexFlowScore extends PureComponent {
  constructor(props) {
    super(props);
    this.runVexFlowCode = this.runVexFlowCode.bind(this);
    this.onPress = this.onPress.bind(this);
    this.state = {
      bottomTabsVisiblity: true
    }
  }

  onPress() {
    this.setState({
      bottomTabsVisiblity: !this.state.bottomTabsVisiblity
    }, () => {
      Navigation.mergeOptions('CurrentTune', {
        bottomTabs: {
          visible: this.state.bottomTabsVisiblity,
        }
      });  
    });
  }

  // log for unnecessary updates. think it should be good since switched to PureComponent though
  componentDidUpdate(prevProps, prevState) {
    console.log('---------------------------------------------------');
    console.log('VexFlowScore did update');
    Object.entries(this.props).forEach(([key, val]) => {
        if (prevProps[key] !== val) {
          console.log(`Prop '${key}' changed`)
          console.log(prevProps[key] + " was not equal to " + val);
        }
      }
    );
    Object.entries(this.state).forEach(([key, val]) => {
        if (prevState[key] !== val) {
          console.log(`State '${key}' changed`)
          console.log(prevState[key] + " was not equal to " + val);  
        }
      }
    );
    console.log('---------------------------------------------------');
  }

  runVexFlowCode(context) {
    if (this.props.dimHeight > this.props.dimWidth) {
      // portrait
      var RENDER_WIDTH = 500;
    } else {
      //landscape
      var RENDER_WIDTH = 850
    }
    context.setViewBox(0, 130, RENDER_WIDTH + 5, 500); // x y width height... WHAT ARE X AND Y DOING AGAIN, WHY 150???
    // console.log('IN RUNVEXFLOWCODE, TUNE WAS: ' + this.props.tune);

    // GET THE PARSED OBJECT AND PROPERTIES
    let parsedObject = ABCJS.parseOnly(this.props.tune);
    let musicalObjects = parsedObject[0].lines.map(function(line, i) {
      return line.staff[0].voices[0]
    }).reduce((acc, val) => acc.concat(val), []);

    // GET THE TUNE DETAILS
    var meter = VexUtils.getMeter(this.props.tune);
    var clef = parsedObject[0].lines[0].staff[0].clef.type;
    let abcKeySignature = parsedObject[0].lines[0].staff[0].key;
    var vexKeySignature = VexUtils.convertKeySignature(abcKeySignature);

    // PROCESS AND RENDER
    let bars = Tune.getBars(musicalObjects, abcKeySignature, clef);
    let positionedBars = Tune.positionBars(bars, RENDER_WIDTH);
    Tune.render(positionedBars, clef, meter, vexKeySignature, context);
  }

  render() {
    let context = new ReactNativeSVGContext(NotoFontPack, { width: this.props.dimWidth * .90, height: this.props.dimHeight * 2 });
    this.runVexFlowCode(context);

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          {context.render()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});


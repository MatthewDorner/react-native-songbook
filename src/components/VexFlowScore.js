import React, { PureComponent } from 'react';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import ABCJS from 'abcjs';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import Tune from '../logic/tune';
import VexUtils from '../logic/vex-utils';

export default class VexFlowScore extends PureComponent {
  constructor(props) {
    super(props);
    this.runVexFlowCode = this.runVexFlowCode.bind(this);
    this.onPress = this.onPress.bind(this);
    this.state = {
      bottomTabsVisiblity: true
    };
  }

  // log for unnecessary updates. think it should be good since switched to PureComponent though
  componentDidUpdate(prevProps, prevState) {
    console.log('---------------------------------------------------');
    console.log('VexFlowScore did update');
    Object.entries(this.props).forEach(([key, val]) => {
      if (prevProps[key] !== val) {
        console.log(`Prop '${key}' changed`);
        console.log(`${prevProps[key]} was not equal to ${val}`);
      }
    });
    Object.entries(this.state).forEach(([key, val]) => {
      if (prevState[key] !== val) {
        console.log(`State '${key}' changed`);
        console.log(`${prevState[key]} was not equal to ${val}`);
      }
    });
    console.log('---------------------------------------------------');
  }

  onPress() {
    this.setState(prevState => ({ bottomTabsVisibility: !prevState.bottomTabsVisiblity }),
      () => {
        const { bottomTabsVisibility } = this.state;
        Navigation.mergeOptions('CurrentTune', {
          bottomTabs: {
            visible: bottomTabsVisibility,
          }
        });
      });
  }

  runVexFlowCode(context) {
    const { dimWidth, dimHeight, tune } = this.props;
    let renderWidth;
    if (dimHeight > dimWidth) {
      // portrait
      renderWidth = 500;
    } else {
      // landscape
      renderWidth = 850;
    }

    // x y width height... WHAT ARE X AND Y DOING AGAIN, WHY 150???
    context.setViewBox(0, 130, renderWidth + 5, 500);
    // console.log('IN RUNVEXFLOWCODE, TUNE WAS: ' + this.props.tune);

    // GET THE PARSED OBJECT AND PROPERTIES
    const parsedObject = ABCJS.parseOnly(tune);
    const musicalObjects = parsedObject[0].lines
      .map(line => line.staff[0].voices[0])
      .reduce((acc, val) => acc.concat(val), []);

    if (!parsedObject[0].lines[0]) {
      return;
    }

    // GET THE TUNE DETAILS
    const meter = VexUtils.getMeter(tune);
    const clef = parsedObject[0].lines[0].staff[0].clef.type;
    const abcKeySignature = parsedObject[0].lines[0].staff[0].key;
    const vexKeySignature = VexUtils.convertKeySignature(abcKeySignature);

    // PROCESS AND RENDER
    const bars = Tune.getBars(musicalObjects, abcKeySignature, clef);
    const positionedBars = Tune.positionBars(bars, renderWidth);
    Tune.render(positionedBars, clef, meter, vexKeySignature, context);
  }

  render() {
    const { dimWidth, dimHeight } = this.props;
    const context = new ReactNativeSVGContext(
      NotoFontPack,
      { width: dimWidth * 0.90, height: dimHeight * 2 }
    );
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

import React, { PureComponent } from 'react';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import Tune from '../logic/tune';

export default class VexFlowScore extends PureComponent {
  constructor(props) {
    super(props);
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

  render() {
    // CREATE CONTEXT BASED ON DIMENSIONS
    const { dimWidth, dimHeight, tune } = this.props;
    const context = new ReactNativeSVGContext(
      NotoFontPack,
      { width: dimWidth * 0.90, height: dimHeight * 2 }
    );
    let renderWidth;
    if (dimHeight > dimWidth) {
      // portrait
      renderWidth = 500;
    } else {
      // landscape
      renderWidth = 850;
    }
    context.setViewBox(0, 130, renderWidth + 5, 500);

    // for now, eventually some of these will be integrated into display settings functionality
    const renderOptions = {
      xOffset: 3,
      widthFactor: 27,
      lineHeight: 190,
      clefsAndSigsWidth: 120,
      renderWidth
    };

    const tuneParser = new Tune(tune, renderOptions);
    tuneParser.drawToContext(context);

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

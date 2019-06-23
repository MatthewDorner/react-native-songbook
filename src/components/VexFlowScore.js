import React, { PureComponent } from 'react';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  View,
  Text,
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
    //console.log.log('---------------------------------------------------');
    //console.log.log('VexFlowScore did update');
    //console.log.log(new Date());
    Object.entries(this.props).forEach(([key, val]) => {
      if (prevProps[key] !== val) {
        //console.log.log(`Prop '${key}' changed`);
        //console.log.log(`${prevProps[key]} was not equal to ${val}`);
      }
    });
    Object.entries(this.state).forEach(([key, val]) => {
      if (prevState[key] !== val) {
        //console.log.log(`State '${key}' changed`);
        //console.log.log(`${prevState[key]} was not equal to ${val}`);
      }
    });
    //console.log.log('---------------------------------------------------');
  }

  onPress() {
    this.setState(prevState => ({ bottomTabsVisibility: !prevState.bottomTabsVisibility }),
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
      { width: dimWidth * 0.90, height: dimHeight * 3 }
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
    // should these be expressed as fraction of renderWidth? aren't they changing relative
    // size depending on the device the way it is now?
    const renderOptions = {
      xOffset: 3,
      widthFactor: 27,
      lineHeight: 190,
      clefWidth: 40,
      meterWidth: 40,
      repeatWidthModifier: 45, // can't figure out why this is necessary but...
      // putting this to 2 makes it look better for the second part's lead-in, but makes it look worse
      // for the lead-in notes in the very first bar........
      minWidthMultiplier: 2, // minimum bar width should be that of a bar with 2 notes
      renderWidth
    };

    // try/catch? to display error on screen or something
    const tuneParser = new Tune(tune, renderOptions);
    tuneParser.drawToContext(context);
    //console.log.log('after drawToContext: ' + new Date());

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View>
          <View style={styles.container}>
            {context.render()}
          </View>
          <View>
            <Text style={styles.text}>{new Date().toString()}</Text>
          </View>          
        </View>
      </TouchableWithoutFeedback>    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 100
  }
});

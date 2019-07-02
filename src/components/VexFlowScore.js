import React, { Component } from 'react';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import { Navigation } from 'react-native-navigation';

import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import Tune from '../logic/tune';


export default class VexFlowScore extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.state = {
      bottomTabsVisibility: true
    };
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.dimWidth != this.props.dimWidth || nextProps.dimHeight != this.props.dimHeight || nextProps.tune != this.props.tune) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('---------------------------------------------------');
    console.log('VexFlowScore did update');
    console.log(new Date());
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
    const { dimWidth, dimHeight, tune } = this.props;
    let renderWidth;
    if (dimHeight > dimWidth) {
      // portrait
      renderWidth = 500;
    } else {
      // landscape
      renderWidth = 850;
    }

    const renderOptions = {
      xOffset: 3,
      widthFactor: 27,
      lineHeight: 180,
      clefWidth: 40,
      meterWidth: 40,
      repeatWidthModifier: 35, // can't figure out why this is necessary but...
      // putting this to 2 makes it look better for the second part's lead-in, but makes it look worse
      // for the lead-in notes in the very first bar........
      dottedNotesModifier: 23,
      keySigAccidentalWidth: 20, // used to be 14 or 16...
      minWidthMultiplier: 2, // minimum bar width should be that of a bar with 2 notes
      renderWidth
    };

let context, tuneParser, exception, content;

    try {
      tuneParser = new Tune(tune, renderOptions);
      context = new ReactNativeSVGContext(
        NotoFontPack,
        { width: dimWidth * 0.90, height: 3000 }
      );
      context.setViewBox(0, 0, renderWidth + 5, renderWidth + 5); //250 500
      context.svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
      tuneParser.drawToContext(context);
    } catch(e) {
      exception = e;
    }

    if (!exception) {
      console.log('getting context.render, before: ' + new Date());
      content = context.render();
      console.log('after context.render(), after: ' + new Date());
    } else {
      content = 
        <View style={styles.errorContainer}>
          <Text>Error</Text>
          <Text>Code: {exception.code}</Text>
          <Text>Message: {exception.message}</Text>
        </View>
      ;
    }

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          {content}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  errorContainer: {
    width: '80%'
  }
});

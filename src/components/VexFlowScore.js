import React, { Component } from 'react';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import { Navigation } from 'react-native-navigation';
import { AbcjsVexFlowRenderer } from 'abcjs-vexflow-renderer';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import Constants from '../constants';

export default class VexFlowScore extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.state = {
      bottomTabsVisibility: true
    };
  }

  // changing bottom tabs now causes the component to re-render
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
    const { dimWidth, tune, tabsVisibility, tuning, zoom } = this.props;

    const renderOptions = {
      xOffset: 3,
      widthFactor: 1.5,
      lineHeight: 185,
      clefWidth: 40,
      meterWidth: 30,
      repeatWidthModifier: 35,
      dottedNotesModifier: 23,
      keySigAccidentalWidth: 20,
      tabsVisibility,
      voltaHeight: 25,
      renderWidth: dimWidth * (50 / zoom) * 1.2, // doesn't work right
      tuning: Constants.Tunings[tuning],
    };

    let context; let exception; let content;

    try {
      const tuneObject = AbcjsVexFlowRenderer.getTune(tune, renderOptions);
      if (tuneObject === null) {
        return null; // what, what else to do other than return null?
      }
      const lastPart = tuneObject.parts[tuneObject.parts.length - 1];
      const lastBar = lastPart.bars[lastPart.bars.length - 1];

      /*
        explaining the math here. earlier, I did: const renderWidth = dimWidth * 1.2; this is just because
        if I don't * 1.2, the music ends up bigger than I'd prefer.

        for the context size here, since I set context width to dimWidth * 0.90 (right below this),
        I need to multiply by 0.75 for the height. This is because:
        1 / 1.2 === .83333, and then .83333 * .9 === 0.75

        the + 50 is to add the extra space at the bottom

        why don't I reference dimWidth in the height argument? Because it's already factored in by the
        lastBar.position.y???

        really all this math should be moved into the abcjs-vexflow-renderer library, and it shouldn't
        use magic numbers yeah blah blah
      */
      context = new ReactNativeSVGContext(
        NotoFontPack,
        { width: dimWidth * 0.90, height: ((lastBar.position.y + renderOptions.lineHeight) * 0.75) + 50 }
      );

      context.setViewBox(0, 0, renderOptions.renderWidth + 6, (lastBar.position.y + renderOptions.lineHeight) + 5);
      context.svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
      AbcjsVexFlowRenderer.drawToContext(context, tuneObject);
    } catch (e) {
      exception = e;
    }

    if (!exception) {
      content = context.render();
    } else {
      content = (
        <View style={styles.errorContainer}>
          <Text>Error</Text>
          <Text>
            Code:
            {exception.code}
          </Text>
          <Text>
            Message:
            {exception.message}
          </Text>
        </View>
      );
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

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


export default class VexFlowScore extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.state = {
      bottomTabsVisibility: true
    };
  }

  shouldComponentUpdate(nextProps) {
    const { dimWidth, dimHeight, tune, tabsVisibility } = this.props;

    if (nextProps.dimWidth !== dimWidth || nextProps.dimHeight !== dimHeight || nextProps.tune !== tune || nextProps.tabsVisibility !== tabsVisibility) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    Object.entries(this.props).forEach(([key, val]) => {
      if (prevProps[key] !== val) {
        // console.log(`Prop '${key}' changed`);
        // console.log(`${prevProps[key]} was not equal to ${val}`);
      }
    });
    Object.entries(this.state).forEach(([key, val]) => {
      if (prevState[key] !== val) {
        // console.log(`State '${key}' changed`);
        // console.log(`${prevState[key]} was not equal to ${val}`);
      }
    });
    // console.log('---------------------------------------------------');
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
    const { dimWidth, tune, tabsVisibility } = this.props;

    const renderOptions = {
      xOffset: 3,
      widthFactor: 1.5,
      lineHeight: 185,
      clefWidth: 40,
      meterWidth: 30,
      repeatWidthModifier: 35,
      dottedNotesModifier: 23,
      keySigAccidentalWidth: 20,
      minWidthMultiplier: 1.7,
      tabsVisibility,
      voltaHeight: 25,
      minNotesWidth: 40,
      renderWidth: dimWidth * 1.2
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

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

  shouldComponentUpdate(nextProps) {
    const { tune, dimHeight, dimWidth, tabsVisibility, zoom, tuning } = this.props;
    if (nextProps.tune !== tune
      || nextProps.dimHeight !== dimHeight
      || nextProps.dimWidth !== dimWidth
      || nextProps.tabsVisibility !== tabsVisibility
      || nextProps.zoom !== zoom
      || nextProps.tuning !== tuning
    ) {
      return true;
    }
    return false;
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
      renderWidth: dimWidth * (50 / zoom) * 1.2,
      tuning: Constants.Tunings[tuning],
    };

    let context; let exception; let content;

    try {
      const tuneObject = AbcjsVexFlowRenderer.getTune(tune, renderOptions);
      // if (tuneObject === null) {
      //   return null;
      // }
      const lastPart = tuneObject.parts[tuneObject.parts.length - 1];
      const lastBar = lastPart.bars[lastPart.bars.length - 1];

      // 1.2, .75, .90, these numbers are all related but I don't remember how, and the math be simplified
      const contextWidth = dimWidth * 0.90;
      const contextHeight = ((lastBar.position.y + renderOptions.lineHeight) * (zoom / 50) * 0.75) + 50;
      context = new ReactNativeSVGContext(
        NotoFontPack,
        { width: contextWidth, height: contextHeight }
      );

      const viewBoxWidth = renderOptions.renderWidth + 6;
      const viewBoxHeight = (lastBar.position.y + renderOptions.lineHeight) + 5;
      context.setViewBox(0, 0, viewBoxWidth, viewBoxHeight);

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

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class TuneAttributes extends PureComponent {
  render() {
    const { tune } = this.props;
    let endOfAttributesReached = false;
    const attributes = tune.split('\n').filter((line) => {
      if (line.startsWith('K:')) { // it's the last line we want as K: is always last before the tune body
        endOfAttributesReached = true;
        return true;
      }
      if (endOfAttributesReached) {
        return false;
      }
      return true;
    }).join('\n');

    return (
      <View>
        <Text style={styles.attributesHeader}>
          Tune Header Fields:
        </Text>
        <Text style={styles.attributes}>
          {attributes}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  attributes: {
    color: '#696969',
    fontSize: 17,
    marginLeft: '5%',
    marginBottom: '20%'
  },
  attributesHeader: {
    fontSize: 17,
    marginLeft: '5%'
  }
});

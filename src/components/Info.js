import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Fonts from '../styles/fonts';

export default function Info() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ABC Songbook
      </Text>
      <Text style={styles.body}>
        This application allows you to view and import music in ABC notation format. To download more music, check out
        {' '}
        <Text style={styles.url}>https://abcnotation.com/tunes</Text>
        . Then, import the file by adding a new Collection from the Browser tab.
      </Text>
      <Text style={styles.body}>
        This application is free, open-source software licensed under GPLv3. Any issues, feature requests or contributions can be submitted via GitHub at
        {' '}
        <Text style={styles.url}>https://github.com/matthewdorner/react-native-songbook</Text>
        , or via e-mail at me@matthewdorner.com.
      </Text>
      <Text style={styles.body}>
        The included music is also free and open-source, and is from the Nottingham Dataset project. While the ABC files are available at several locations online, the specific versions used here can be found at
        {' '}
        <Text style={styles.url}>https://github.com/matthewdorner/nottingham-dataset</Text>
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: Fonts.default,
    textDecorationLine: 'underline',
    textAlign: 'center',
    margin: 10,
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.default,
    marginTop: 20
  },
  url: {
    textDecorationLine: 'underline',
  },
  container: {
    marginLeft: 20,
    marginRight: 20
  }
});

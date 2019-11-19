import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Info extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Songbook
        </Text>
        <Text style={styles.body}>
          This application allows you to view and import music in ABC notation format. To find more music to import, search Google for 'ABC songbooks', etc. Then, import the file by adding a new Collection from the Browser tab.
        </Text>
        <Text style={styles.body}>
          This application is free, open-source software licensed under GPLv3. Any issues, features requests or contributions can be submitted via GitHub at https://github.com/matthewdorner/react-native-songbook, or via e-mail at me@matthewdorner.com.
        </Text>
        <Text style={styles.body}>
          The included music is also free and open-source, and is from the Nottingham Dataset project. While the ABC files are available at several locations online, the specific versions used here can be found at https://github.com/matthewdorner/nottingham-dataset.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  body: {
    fontSize: 15,
    marginTop: 20
  },
  container: {
    marginLeft: '5%',
    marginRight: '5%'
  }
});

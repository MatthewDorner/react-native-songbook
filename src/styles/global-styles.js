import { StyleSheet } from 'react-native';
import Fonts from './fonts';

export default StyleSheet.create({
  title: {
    flexShrink: 1,
    fontSize: 24,
    fontFamily: Fonts.default,
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 15,
    marginRight: 5,
    textDecorationLine: 'underline',
  }
});

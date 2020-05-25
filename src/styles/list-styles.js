import { StyleSheet } from 'react-native';
import Fonts from './fonts';
import Colors from './colors';

export default StyleSheet.create({
  listItemSeparator: {
    marginTop: 5,
    marginRight: 20,
    alignSelf: 'stretch',
    height: 2,
    borderBottomColor: Colors.listItemBorder,
    borderBottomWidth: 0.8,
  },
  listItem: {
    flexDirection: 'row',
    width: '85%'
  },
  listItemTitle: {
    fontSize: 19,
    fontFamily: Fonts.default,
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 2,
    marginRight: 10
  },
  listItemDetail: {
    fontSize: 14,
    fontFamily: Fonts.default,
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 2
  },
  listItemPicker: {
    marginTop: 2,
    height: 31,
    width: 28
  }
});

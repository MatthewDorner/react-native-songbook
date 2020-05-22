import { StyleSheet } from 'react-native';
import Fonts from './fonts';
import Colors from './colors';

export default StyleSheet.create({
  listItemSeparator: {
    marginTop: 5,
    width: 370,
    height: 2,
    borderBottomColor: Colors.listItemBorder,
    borderBottomWidth: 1,
  },
  listItem: {
    flexDirection: 'row',
    width: '85%'
  },
  listItemTitle: {
    fontSize: 17,
    fontFamily: Fonts.default,
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 2,
    marginRight: 10
  },
  listItemDetail: {
    fontSize: 12,
    fontFamily: Fonts.default,
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 2
  },
  listItemPicker: {
    height: 33,
    width: 30
  }
});

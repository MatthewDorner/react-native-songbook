import { StyleSheet } from 'react-native';
import Fonts from './fonts';
import Colors from './colors';

export default StyleSheet.create({
  listItemSeparator: {
    // backgroundColor: 'gray',
    marginTop: 5,
    marginRight: 20,
    alignSelf: 'stretch',
    height: 2,
    borderBottomColor: Colors.listItemBorder,
    borderBottomWidth: 0.8,
  },
  listItem: {
    // backgroundColor: 'pink',
    flexDirection: 'row',
    width: '85%'
  },
  listItemTitle: {
    // backgroundColor: 'blue',
    fontSize: 19,
    fontFamily: Fonts.default,
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 2,
    marginRight: 10
  },
  listItemDetail: {
    // backgroundColor: 'yellow',
    fontSize: 14,
    fontFamily: Fonts.default,
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 2
  },
  listItemPicker: {
    // backgroundColor: 'orange',
    marginTop: 6,
    height: 24,
    width: 26
  }
});

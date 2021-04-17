import { StyleSheet } from 'react-native';
import Fonts from './fonts';

// margin on top of Title should be the same as margin on the left and right
// sides, though this is... the side margins are expressed as percent?
// if that's true it would be difficult to make the top be 5% of the horizontal
// dimension.

// so question is why does the Title and Picker combine to overflow the headerCenter container?
export default StyleSheet.create({
  title: {
    flexShrink: 1,
    // backgroundColor: 'pink',
    fontSize: 24,
    fontFamily: Fonts.default,
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 15,
    marginRight: 5,
    textDecorationLine: 'underline',
  }
});

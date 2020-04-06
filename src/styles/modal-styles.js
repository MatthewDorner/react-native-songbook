import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    flex: 1
  },
  modalScrollContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  modalHeader: {
    alignItems: 'center'
  },
  modalBody: {
    alignItems: 'flex-start',
  },
  modalFooter: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 15,
  },
  message: {
    fontSize: 17,
    marginTop: 20,
    marginBottom: 15,
  },
  infoItem: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 10,
    width: '100%',
  },
  // height should be the same as height for the button? what determines the height of the button?
  fileInfoItem: {
    width: '70%',
    backgroundColor: 'lightgray',
    paddingTop: 11,
    paddingBottom: 9,
    paddingLeft: 12,
    fontFamily: 'monospace',
    height: 41
  },
  pickerContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    minHeight: 45,
    backgroundColor: '#eeeeee',
    borderRadius: 6
  },
  // setting an arbitrarily large number allows 100% width, but it hides the little black arrow.
  // but it won't accept '100%' in this case for some reason so have to do this
  // should change to use alignSelf stretch and flex??
  modalPicker: {
    width: 999999,
    height: 45
  }
});

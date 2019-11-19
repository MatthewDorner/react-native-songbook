import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    // textAlign: 'center',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  modalHeader: {
    alignItems: 'center'
  },
  modalBody: {
    alignItems: 'flex-start',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
    marginTop: 50
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
  fileInfoItem: {
    width: '70%',
    backgroundColor: 'lightgray',
    paddingTop: 11,
    paddingBottom: 9,
    paddingLeft: 12,
    fontFamily: 'monospace'
  },
  pickerContainer: {
    backgroundColor: '#eeeeee',
    borderRadius: 6
  },
  // setting an arbitrarily large number allows 100% width, but it hides the little black arrow.
  // but it won't accept '100%' in this case for some reason so have to do this
  modalPicker: {
    width: 999999,
    height: 45
  }
});

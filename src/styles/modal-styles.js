import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 15
  },
  nameInput: {
    fontSize: 20,
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'black',
    width: '90%'
  },
  message: {
    fontSize: 15,
    margin: 15,
    width: '90%'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 80
  },
  modalContainer: {
    // textAlign: 'center',
    alignItems: 'center'
  },
  infoItem: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 10,
    marginLeft: '5%',
    marginRight: '5%',
    backgroundColor: 'lightgrey',
  },
  picker: {
    height: 50,
    width: '80%',
  }
});

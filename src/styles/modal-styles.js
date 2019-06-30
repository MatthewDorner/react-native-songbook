import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 15
  },
  nameInput: {
    fontSize: 20,
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: '90%'
  },
  message: {
    fontSize: 20,
    margin: 15,
    width: '90%'
  },
  infoContainer: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row'
  },
  infoItem: {
    fontSize: 18,
    backgroundColor: 'lightyellow',
    width: '100%',
    padding: 5
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
  tuneDetails: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 10,
    margin: 10,
    backgroundColor: 'lightyellow'
  }
});


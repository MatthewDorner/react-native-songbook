import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 15,
  },
  nameInput: {
    fontSize: 20,
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
  },
  message: {
    fontSize: 20,
    margin: 15
    // textAlign: 'center',
    // flex: 1,
    // height: 30,
    // paddingTop: 5,
    // paddingBottom: 5,
    // // width: '45%',
    // borderColor: '#444',
    // backgroundColor: '#f7f7f7',
    // borderRadius: 5,
    // fontSize: 13,
    // borderWidth: 0,
    // marginLeft: 5,
    // marginRight: 5
  },
  infoContainer: {
    margin: 15,
    flexDirection: 'row'
  },
  // infoLabel: {
  //   fontSize: 18,
  //   backgroundColor: 'lightgrey'
  // },
  infoItem: {
    fontSize: 18,
    backgroundColor: 'lightyellow',
    width: '100%',
    padding: 5
    // height: 35,
    // flexDirection: 'row',
    // backgroundColor: 'grey'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 100
  },
  modalContainer: {
    textAlign: 'center',
  },
  modalButton: { // touchablehighlight
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#696969',
    padding: 7
  },
  modalFooterButton: {
    // backgroundColor: '#C6E2FF',
    margin: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    padding: 7,
    width: '80%'
  },
  modalButtonTitle: {
    fontSize: 20,
    color: '#696969'
  }
});


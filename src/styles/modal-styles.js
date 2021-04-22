import { StyleSheet } from 'react-native';
import Fonts from './fonts';
import Colors from './colors';

export default StyleSheet.create({
  modalContainer: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 5,
  },
  modalScrollContainer: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  modalHeader: {
    alignItems: 'center'
  },
  modalBody: {
    alignItems: 'flex-start',
    paddingBottom: 30,
  },
  modalFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  modalButton: {
    marginBottom: 40,
    width: 130,
    borderWidth: 1.5,
    borderColor: Colors.modalButtonBorder,
  },
  message: {
    fontSize: 18,
    fontFamily: Fonts.default,
    marginTop: 20,
    marginBottom: 15,
  },
  optionLabel: {
    fontSize: 18,
    fontFamily: Fonts.default,
    marginTop: 19,
    marginBottom: 7,
  },
  infoItem: {
    fontSize: 16,
    fontFamily: Fonts.dataField,
    backgroundColor: Colors.pickerBackground,
    marginBottom: 15,
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 7,
    borderRadius: 5,
    borderColor: Colors.pickerBackground,
    borderWidth: 2.5,
    alignSelf: 'stretch',
  },
  pickerContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: 45,
    borderRadius: 5,
    borderColor: Colors.fileInfoBackground,
    borderWidth: 1,
  },
  infoMonospace: {
    fontSize: 16,
    fontFamily: Fonts.monospace,
    borderRadius: 5,
    borderColor: Colors.fileInfoBackground,
    paddingTop: 12,
    paddingLeft: 7,
    alignSelf: 'stretch',
  },
  browseButtonTitle: {
    fontFamily: Fonts.default,
    fontSize: 16,
    fontWeight: 'bold'
  },
  browseButtonContainer: {
    width: '30%',
    height: 41,
  },
  fileInfoItem: {
    width: '70%',
    backgroundColor: Colors.fileInfoBackground,
    paddingTop: 11,
    paddingBottom: 9,
    paddingLeft: 12,
    paddingRight: 12,
    fontFamily: Fonts.dataField,
    fontSize: 16,
    height: 41,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  input: {
    fontSize: 16,
    fontFamily: Fonts.dataField
  }
});

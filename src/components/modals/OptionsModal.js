import React, { Component } from 'react';
import {
  Text,
  Picker,
} from 'react-native';
import AbstractModal from './AbstractModal';
import ModalStyles from '../../styles/modal-styles';

export default class OptionsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabsVisibility: props.prevTabsVisibility
    };
  }

  render() {
    const { tabsVisibility } = this.state;
    const { setTabsVisibility, closeModal } = this.props;

    return (
      <AbstractModal submit={() => setTabsVisibility(tabsVisibility)} cancel={closeModal} title="Options">
        <Text style={ModalStyles.message}>
          Tabs Visibility:
        </Text>
        <Text style={ModalStyles.pickerContainer}>
          <Picker
            style={ModalStyles.modalPicker}
            selectedValue={tabsVisibility}
            onValueChange={(value) => {
              this.setState({
                tabsVisibility: value
              });
            }}
          >
            <Picker.Item label="Show" value={true} key="show" />
            <Picker.Item label="Hide" value={false} key="hide" />
          </Picker>
        </Text>
      </AbstractModal>
    );
  }
}

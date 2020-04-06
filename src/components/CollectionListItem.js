import React, { PureComponent } from 'react';
import {
  Picker,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Constants from '../constants';
import ListStyles from '../styles/list-styles';

export default class CollectionBrowser extends PureComponent {

  render() {
    const { queriedBy, fetchTune, item, showModal } = this.props;

    let pickerOptions = [];
    if (queriedBy === Constants.CollectionTypes.COLLECTION) {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Details" value="details" key="details" />,
        <Picker.Item label="Add to Setlist" value="addToSetlist" key="addToSetlist" />,
        <Picker.Item label="Move to Collection" value="moveToCollection" key="moveToCollection" />,
        <Picker.Item label="Delete" value="delete" key="delete" />
      ];
    } else if (queriedBy === Constants.CollectionTypes.SETLIST) {
      pickerOptions = [
        <Picker.Item label="Cancel" value="cancel" key="cancel" />,
        <Picker.Item label="Details" value="details" key="details" />,
        <Picker.Item label="Remove from Setlist" value="removeFromSetlist" key="removeFromSetlist" />
      ];
    }

    return ([
      <View style={ListStyles.listItem} key="listItem">
        <TouchableOpacity
          onPress={() => {
            fetchTune(item.rowid);
          }}
        >
          <Text style={ListStyles.listItemTitle}>
            {item.Title}
          </Text>
        </TouchableOpacity>
        <Picker
          style={ListStyles.listItemPicker}
          onValueChange={(action) => {
            showModal(action, item);
          }}
        >
          {pickerOptions}
        </Picker>
      </View>,
      <Text style={ListStyles.listItemDetail} key="listItemDetail">
        {`Key: ${item.Key}`}
        {(item.Rhythm ? `, Rhythm: ${item.Rhythm}` : '')}
      </Text>
    ]);
  }
}
